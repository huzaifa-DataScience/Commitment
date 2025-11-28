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
      where: { userId: session.user.id },
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json({ commitments });
  } catch (error) {
    console.error('Error fetching commitments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { text, declaredConfidence, deadline, category } = body;

    if (!text || declaredConfidence === undefined || !deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const commitmentRepository = dataSource.getRepository(Commitment);

    // Generate code: YYYYMMDD-HHMMSS
    const now = new Date();
    const code = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    const commitment = commitmentRepository.create({
      code,
      text,
      declaredConfidence: parseFloat(declaredConfidence),
      deadline: new Date(deadline),
      category: category || 'general',
      outcome: CommitmentOutcome.PENDING,
      userId: session.user.id,
    });

    await commitmentRepository.save(commitment);

    return NextResponse.json({ commitment }, { status: 201 });
  } catch (error) {
    console.error('Error creating commitment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

