import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDataSource } from '@/lib/database';
import { Commitment } from '@/entities/Commitment';
import { CommitmentOutcome } from '@/entities/Commitment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const commitmentRepository = dataSource.getRepository(Commitment);

    const commitments = await commitmentRepository.find({
      where: {
        userId: session.user.id,
        outcome: CommitmentOutcome.PENDING,
      },
      order: { deadline: 'ASC' },
    });

    return NextResponse.json({ commitments });
  } catch (error) {
    console.error('Error fetching pending commitments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

