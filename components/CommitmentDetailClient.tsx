'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { CommitmentOutcome } from '@/entities/Commitment';

interface Commitment {
  id: string;
  code: string;
  text: string;
  declaredConfidence: number;
  deadline: string;
  category: string;
  outcome: CommitmentOutcome;
  completedAt: string | null;
  deltaMinutes: number | null;
  resolution?: string | null;
  evidence?: string | null;
  testimony?: string | null;
  createdAt: string;
}

export default function CommitmentDetailClient({
  commitmentId,
}: {
  commitmentId: string;
}) {
  const router = useRouter();
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommitment();
  }, [commitmentId]);

  const fetchCommitment = async () => {
    try {
      const response = await fetch(`/api/commitments/${commitmentId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load commitment');
        return;
      }

      setCommitment(data.commitment);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading commitment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !commitment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Commitment not found'}
          </div>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOpen = commitment.outcome === CommitmentOutcome.PENDING;
  const isAchieved = commitment.outcome === CommitmentOutcome.ACHIEVED;
  const isFailed = commitment.outcome === CommitmentOutcome.FAILED;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Commitment Details</h1>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                {commitment.code}
              </span>
            </div>
            <p className="text-sm text-gray-500">Created: {formatDate(commitment.createdAt)}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commitment Text
              </label>
              <p className="text-lg text-gray-900">{commitment.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Declared Confidence
                </label>
                <p className="text-gray-900">{commitment.declaredConfidence}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-gray-900">{commitment.category || 'general'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <p className="text-gray-900">{formatDate(commitment.deadline)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  isAchieved
                    ? 'bg-green-100 text-green-800'
                    : isFailed
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {commitment.outcome}
              </span>
            </div>

            {!isOpen && (
              <>
                {commitment.completedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completed At
                    </label>
                    <p className="text-gray-900">{formatDate(commitment.completedAt)}</p>
                  </div>
                )}

                {commitment.deltaMinutes !== null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delta (minutes)
                    </label>
                    <p className="text-gray-900">{commitment.deltaMinutes.toFixed(1)} minutes</p>
                  </div>
                )}

                {commitment.resolution && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resolution
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{commitment.resolution}</p>
                  </div>
                )}

                {commitment.evidence && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{commitment.evidence}</p>
                  </div>
                )}

                {commitment.testimony && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimony
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{commitment.testimony}</p>
                  </div>
                )}
              </>
            )}

            {isOpen && (
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href={`/resolve/${commitment.id}`}
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Resolve/Testify
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

