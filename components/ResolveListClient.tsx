'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Commitment {
  id: string;
  code: string;
  text: string;
  declaredConfidence: number;
  deadline: string;
  category: string;
  createdAt: string;
}

export default function ResolveListClient() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCommitments();
  }, []);

  const fetchPendingCommitments = async () => {
    try {
      const response = await fetch('/api/commitments/pending');
      const data = await response.json();
      setCommitments(data.commitments || []);
    } catch (error) {
      console.error('Error fetching pending commitments:', error);
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resolve/Testify List</h1>

        {commitments.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No open commitments requiring resolution.
            </p>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View all commitments →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Open Commitments ({commitments.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {commitments.map((commitment) => (
                <div
                  key={commitment.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/resolve/${commitment.id}`}
                          className="font-mono text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {commitment.code}
                        </Link>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{commitment.text}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>Confidence: {commitment.declaredConfidence}%</span>
                        <span>Category: {commitment.category || 'general'}</span>
                        <span>Deadline: {formatDate(commitment.deadline)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/resolve/${commitment.id}`}
                      className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                      Resolve/Testify
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

