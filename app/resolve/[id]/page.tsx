import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ResolveFormClient from '@/components/ResolveFormClient';

export default async function ResolveFormPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <ResolveFormClient commitmentId={params.id} />;
}

