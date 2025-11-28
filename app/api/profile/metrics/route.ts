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
    const completed = achieved + failed;
    const successRate = completed > 0 ? (achieved / completed) * 100 : 0;

    // Calculate calibration by confidence bucket
    const confidenceBuckets: { [key: string]: { achieved: number; total: number } } = {};
    
    allCommitments.forEach((commitment) => {
      if (commitment.outcome !== CommitmentOutcome.PENDING) {
        const bucket = Math.floor(commitment.declaredConfidence / 10) * 10;
        const bucketKey = `${bucket}-${bucket + 9}`;
        
        if (!confidenceBuckets[bucketKey]) {
          confidenceBuckets[bucketKey] = { achieved: 0, total: 0 };
        }
        
        confidenceBuckets[bucketKey].total++;
        if (commitment.outcome === CommitmentOutcome.ACHIEVED) {
          confidenceBuckets[bucketKey].achieved++;
        }
      }
    });

    const calibration = Object.entries(confidenceBuckets).map(([bucket, data]) => ({
      bucket,
      achieved: data.achieved,
      total: data.total,
      actualRate: data.total > 0 ? (data.achieved / data.total) * 100 : 0,
    }));

    // Calculate average delta for achieved commitments
    const achievedCommitments = allCommitments.filter(
      (c) => c.outcome === CommitmentOutcome.ACHIEVED && c.deltaMinutes !== null
    );
    const avgDelta =
      achievedCommitments.length > 0
        ? achievedCommitments.reduce((sum, c) => sum + (c.deltaMinutes || 0), 0) /
          achievedCommitments.length
        : 0;

    // Calculate sincerity score (how well confidence matches actual success rate)
    const avgConfidence = allCommitments.length > 0
      ? allCommitments.reduce((sum, c) => sum + c.declaredConfidence, 0) / allCommitments.length
      : 0;
    
    const sincerityScore = completed > 0
      ? 100 - Math.abs(avgConfidence - successRate)
      : 0;

    return NextResponse.json({
      total,
      achieved,
      failed,
      completed,
      successRate: parseFloat(successRate.toFixed(1)),
      avgDelta: parseFloat(avgDelta.toFixed(1)),
      avgConfidence: parseFloat(avgConfidence.toFixed(1)),
      sincerityScore: parseFloat(sincerityScore.toFixed(1)),
      calibration,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

