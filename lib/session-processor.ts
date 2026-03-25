import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';
import { createAdminClient } from '@/utils/supabase/admin';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

function getGenAI() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

interface ProcessingParams {
  bookingId: string;
  userId: string | null;
  downloadUrl: string;
  meetingId: string;
}

export async function processSessionRecording(params: ProcessingParams) {
  const { bookingId, downloadUrl, meetingId } = params;
  const supabase = createAdminClient();

  try {
    // 1. Zoom 오디오 다운로드
    console.log(`[Session Processor] 오디오 다운로드 시작: ${meetingId}`);
    await updateStatus(supabase, bookingId, 'transcribing');

    const audioResponse = await fetch(downloadUrl);
    if (!audioResponse.ok) {
      throw new Error(`오디오 다운로드 실패: ${audioResponse.status}`);
    }
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // 2. Whisper로 한국어 음성 → 텍스트 변환
    console.log(`[Session Processor] Whisper 변환 시작: ${meetingId}`);
    const audioFile = new File([audioBuffer], `${meetingId}.m4a`, { type: 'audio/m4a' });

    const transcription = await getOpenAI().audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'ko',
      response_format: 'text',
    });

    console.log(`[Session Processor] 변환 완료: ${transcription.length}자`);

    // 트랜스크립트 저장
    await supabase
      .from('bookings')
      .update({ transcript: transcription, summary_status: 'summarizing', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    // 3. Gemini로 코칭 세션 요약
    console.log(`[Session Processor] Gemini 요약 시작: ${meetingId}`);
    const summary = await generateSummary(transcription);

    // 4. Google Docs에 요약 문서 생성
    console.log(`[Session Processor] Google Docs 생성: ${meetingId}`);
    const docUrl = await createGoogleDoc(meetingId, transcription, summary);

    // 5. 결과 저장
    await supabase
      .from('bookings')
      .update({
        google_doc_url: docUrl,
        summary_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    console.log(`[Session Processor] 후처리 완료: ${meetingId} → ${docUrl}`);
  } catch (error) {
    console.error(`[Session Processor] 실패:`, error);
    await updateStatus(supabase, bookingId, 'failed');
    throw error;
  }
}

async function updateStatus(
  supabase: ReturnType<typeof createAdminClient>,
  bookingId: string,
  status: string
) {
  await supabase
    .from('bookings')
    .update({ summary_status: status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);
}

async function generateSummary(transcript: string): Promise<string> {
  const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `당신은 전문 코칭 세션 분석가입니다. 아래 코칭 세션 녹취록을 분석하여 구조화된 요약을 작성하세요.

## 요약 형식

### 세션 개요
- 주요 논의 주제 (2~3문장)

### 핵심 인사이트
- 코칭 과정에서 도출된 주요 깨달음이나 발견 (불릿 포인트)

### 코치 피드백
- 코치가 제공한 주요 피드백과 제안 사항

### 액션 아이템
- 코치이가 다음 세션까지 실행할 구체적 과제 (체크리스트)

### 다음 세션 준비
- 다음 세션에서 다룰 주제나 준비 사항

---

녹취록:
${transcript}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function createGoogleDoc(
  meetingId: string,
  transcript: string,
  summary: string
): Promise<string> {
  // Google Service Account 인증
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const title = `[Me-mentum] 코칭 세션 요약 — ${today}`;

  // 1. 빈 문서 생성
  const doc = await docs.documents.create({
    requestBody: { title },
  });

  const documentId = doc.data.documentId!;

  // 2. 문서 내용 삽입 (역순으로 삽입해야 인덱스가 안 밀림)
  const content = `${summary}\n\n${'─'.repeat(40)}\n\n📝 전체 녹취록\n\n${transcript}`;

  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content,
          },
        },
      ],
    },
  });

  // 3. 공유 설정 — 링크가 있는 사람 누구나 읽기 가능
  if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
    await drive.files.update({
      fileId: documentId,
      addParents: process.env.GOOGLE_DRIVE_FOLDER_ID,
      requestBody: {},
    });
  }

  await drive.permissions.create({
    fileId: documentId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return `https://docs.google.com/document/d/${documentId}`;
}
