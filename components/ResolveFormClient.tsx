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
}

export default function ResolveFormClient({
  commitmentId,
}: {
  commitmentId: string;
}) {
  const router = useRouter();
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [outcome, setOutcome] = useState<CommitmentOutcome>(CommitmentOutcome.ACHIEVED);
  const [resolution, setResolution] = useState('');
  const [evidence, setEvidence] = useState('');
  const [testimony, setTestimony] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

      if (data.commitment.outcome !== CommitmentOutcome.PENDING) {
        setError('This commitment has already been resolved');
        return;
      }

      setCommitment(data.commitment);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/commitments/${commitmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          resolution,
          evidence,
          testimony,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to resolve commitment');
        return;
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
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
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !commitment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            href="/resolve"
            className="text-indigo-600 hover:text-indigo-800"
          >
            ← Back to Resolve List
          </Link>
        </div>
      </div>
    );
  }

  if (!commitment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/resolve"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Resolve List
        </Link>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commitment Details</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Code: </span>
              <span className="font-mono text-sm">{commitment.code}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Text: </span>
              <span className="text-gray-900">{commitment.text}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Deadline: </span>
              <span className="text-gray-900">{formatDate(commitment.deadline)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Confidence: </span>
              <span className="text-gray-900">{commitment.declaredConfidence}%</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Resolve/Testify Form</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="outcome" className="block text-sm font-medium text-gray-700 mb-2">
                Outcome
              </label>
              <select
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as CommitmentOutcome)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={CommitmentOutcome.ACHIEVED}>Achieved</option>
                <option value={CommitmentOutcome.FAILED}>Failed</option>
              </select>
            </div>

            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                Provide Outcome
              </label>
              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                placeholder="Describe the outcome of this commitment..."
              />
            </div>

            <div>
              <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Evidence
              </label>
              <textarea
                id="evidence"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                placeholder="Provide evidence or links to support your outcome..."
              />
              <p className="text-xs text-gray-500 mt-1">
                You can paste URLs, describe evidence, or provide other supporting information
              </p>
            </div>

            <div>
              <label htmlFor="testimony" className="block text-sm font-medium text-gray-700 mb-2">
                Submit Testimony
              </label>
              <textarea
                id="testimony"
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
                placeholder="Share your testimony about this commitment..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Resolution'}
              </button>
              <Link
                href="/resolve"
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

