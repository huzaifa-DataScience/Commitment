import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDataSource } from '@/lib/database';
import { Commitment } from '@/entities/Commitment';
import { CommitmentOutcome } from '@/entities/Commitment';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataSource = await getDataSource();
    const commitmentRepository = dataSource.getRepository(Commitment);

    const commitment = await commitmentRepository.findOne({
      where: { id: params.id, userId: session.user.id },
    });

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ commitment });
  } catch (error) {
    console.error('Error fetching commitment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const dataSource = await getDataSource();
    const commitmentRepository = dataSource.getRepository(Commitment);

    const commitment = await commitmentRepository.findOne({
      where: { id: params.id, userId: session.user.id },
    });

    if (!commitment) {
      return NextResponse.json(
        { error: 'Commitment not found' },
        { status: 404 }
      );
    }

    // Update commitment fields
    if (body.outcome !== undefined) {
      commitment.outcome = body.outcome;
    }
    if (body.resolution !== undefined) {
      commitment.resolution = body.resolution;
    }
    if (body.evidence !== undefined) {
      commitment.evidence = body.evidence;
    }
    if (body.testimony !== undefined) {
      commitment.testimony = body.testimony;
    }

    // If marking as completed, calculate delta
    if (body.outcome && body.outcome !== CommitmentOutcome.PENDING) {
      commitment.completedAt = new Date();
      const deadlineTime = new Date(commitment.deadline).getTime();
      const completedTime = commitment.completedAt.getTime();
      commitment.deltaMinutes = Math.round((completedTime - deadlineTime) / (1000 * 60));
    }

    await commitmentRepository.save(commitment);

    return NextResponse.json({ commitment });
  } catch (error) {
    console.error('Error updating commitment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

