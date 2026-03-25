import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSessionsClient from './AdminSessionsClient';

export default async function AdminSessionsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!isAdmin) redirect('/dashboard');

  return <AdminSessionsClient />;
}
