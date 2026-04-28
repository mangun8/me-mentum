import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const track = url.searchParams.get('track');

  if (!track) {
    return NextResponse.json({ error: 'track is required' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ creditAmount: 0, paymentIds: [] });
  }

  const { data: program } = await supabase
    .from('programs')
    .select('id')
    .eq('track', track)
    .eq('is_active', true)
    .single();

  if (!program) {
    return NextResponse.json({ creditAmount: 0, paymentIds: [] });
  }

  const { data: trials } = await supabase
    .from('payments')
    .select('id, amount')
    .eq('user_id', user.id)
    .eq('program_id', program.id)
    .eq('package_mode', 'trial')
    .eq('status', 'completed')
    .is('credit_consumed_at', null);

  const rows = trials ?? [];
  const creditAmount = rows.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const paymentIds = rows.map(p => p.id);

  return NextResponse.json({ creditAmount, paymentIds });
}
