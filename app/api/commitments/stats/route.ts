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

    const allCommitments = await commitmentRepository.find({
      where: { userId: session.user.id },
    });

    const total = allCommitments.length;
    const achieved = allCommitments.filter(
      (c) => c.outcome === CommitmentOutcome.ACHIEVED
    ).length;
    const failed = allCommitments.filter(
      (c) => c.outcome === CommitmentOutcome.FAILED
    ).length;
    const pending = allCommitments.filter(
      (c) => c.outcome === CommitmentOutcome.PENDING
    ).length;

    const completed = achieved + failed;
    const successRate = completed > 0 ? (achieved / completed) * 100 : 0;

    // Calculate average delta (minutes) for achieved commitments
    const achievedCommitments = allCommitments.filter(
      (c) => c.outcome === CommitmentOutcome.ACHIEVED && c.deltaMinutes !== null && c.deltaMinutes !== undefined
    );
    const avgDelta =
      achievedCommitments.length > 0
        ? achievedCommitments.reduce((sum, c) => sum + (c.deltaMinutes || 0), 0) /
          achievedCommitments.length
        : 0;

    return NextResponse.json({
      total,
      achieved,
      failed,
      pending,
      successRate: parseFloat(successRate.toFixed(1)),
      avgDelta: parseFloat(avgDelta.toFixed(1)),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

