import { NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';

// This endpoint initializes the database on first request
export async function GET() {
  try {
    await getDataSource();
    return NextResponse.json({ message: 'Database initialized' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

