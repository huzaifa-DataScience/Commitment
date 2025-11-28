import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CommitmentDetailClient from '@/components/CommitmentDetailClient';

export default async function CommitmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <CommitmentDetailClient commitmentId={params.id} />;
}

