import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미들웨어에서 처리되지만 이중 보호
  if (!user) redirect('/login');

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return <DashboardClient user={user} isAdmin={isAdmin} />;
}
