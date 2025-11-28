'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Target, Calendar, Tag, Percent, Plus } from 'lucide-react';

export default function NewCommitmentPage() {
  const router = useRouter();
  const [text, setText] = useState('I will');
  const [declaredConfidence, setDeclaredConfidence] = useState('70');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!deadlineDate || !deadlineTime) {
        setError('Please provide both date and time for the deadline');
        return;
      }

      const deadline = new Date(`${deadlineDate}T${deadlineTime}`);
      if (isNaN(deadline.getTime())) {
        setError('Invalid date or time');
        return;
      }

      const response = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          declaredConfidence: parseFloat(declaredConfidence),
          deadline: deadline.toISOString(),
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create commitment');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create a Commitment</h1>
                <p className="text-indigo-100 mt-1">Set a new goal and track your progress</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="text" className="block text-sm font-semibold text-slate-700 mb-2">
                  Commitment Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 resize-y transition-all"
                  placeholder="I will..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="confidence" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                    <Percent className="w-4 h-4 mr-2 text-slate-500" />
                    Declared Confidence (%)
                  </label>
                  <input
                    id="confidence"
                    type="number"
                    min="0"
                    max="100"
                    value={declaredConfidence}
                    onChange={(e) => setDeclaredConfidence(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-slate-500" />
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all"
                    placeholder="general"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                  Deadline (local time)
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    id="deadline-date"
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    required
                    min={today}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all"
                  />
                  <input
                    id="deadline-time"
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Submit Commitment
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className="flex-1 bg-white text-slate-700 border-2 border-slate-300 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
