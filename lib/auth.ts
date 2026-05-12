import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export type UserRole = 'user' | 'friend' | 'coach';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  remaining_tickets: number;
}

const COACH_EMAILS = (process.env.COACH_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function isCoachEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return COACH_EMAILS.includes(email.toLowerCase());
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, role, remaining_tickets')
    .eq('id', user.id)
    .single<UserProfile>();

  if (!profile) return null;

  // COACH_EMAILS env에 있는 사용자는 자동으로 coach role 승격
  if (isCoachEmail(profile.email) && profile.role !== 'coach') {
    const admin = createAdminClient();
    await admin.from('users').update({ role: 'coach' }).eq('id', user.id);
    return { ...profile, role: 'coach' };
  }

  return profile;
}

export async function isCoach(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === 'coach';
}

export async function isFriendOrCoach(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === 'friend' || profile?.role === 'coach';
}

export async function requireCoach(): Promise<UserProfile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'coach') {
    throw new Error('FORBIDDEN_COACH_ONLY');
  }
  return profile;
}
