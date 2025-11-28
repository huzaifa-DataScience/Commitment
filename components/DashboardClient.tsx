'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { CommitmentOutcome } from '@/entities/Commitment';
import { CheckCircle2, XCircle, Clock, TrendingUp, Target, BarChart3, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Commitment {
  id: string;
  code: string;
  createdAt: string;
  text: string;
  declaredConfidence: number;
  deadline: string;
  category: string;
  outcome: CommitmentOutcome;
  completedAt: string | null;
  deltaMinutes: number | null;
}

interface Stats {
  total: number;
  achieved: number;
  failed: number;
  pending: number;
  successRate: number;
  avgDelta: number;
}

export default function DashboardClient() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commitmentsRes, statsRes] = await Promise.all([
        fetch('/api/commitments'),
        fetch('/api/commitments/stats'),
      ]);

      const commitmentsData = await commitmentsRes.json();
      const statsData = await statsRes.json();

      setCommitments(commitmentsData.commitments || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getOutcomeBadge = (outcome: CommitmentOutcome) => {
    switch (outcome) {
      case CommitmentOutcome.ACHIEVED:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Achieved
          </span>
        );
      case CommitmentOutcome.FAILED:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
              <p className="text-slate-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's your commitment overview.</p>
          </div>
          <Link
            href="/commitments/new"
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Commitment
          </Link>
        </div>

        {/* Summary Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.total}</div>
              <div className="flex items-center text-sm text-slate-600">
                <span>All commitments</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Achieved</span>
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.achieved}</div>
              <div className="flex items-center text-sm text-slate-600">
                <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-600" />
                <span>Completed successfully</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Failed</span>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.failed}</div>
              <div className="flex items-center text-sm text-slate-600">
                <ArrowDownRight className="w-4 h-4 mr-1 text-red-600" />
                <span>Not completed</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Success Rate</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stats.successRate}%</div>
              <div className="flex items-center text-sm text-slate-600">
                <span>Completion rate</span>
              </div>
            </div>
          </div>
        )}

        {/* All Commitments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">All Commitments</h2>
                <p className="text-sm text-slate-600 mt-0.5">{commitments.length} total commitments</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Filter
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Sort
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {commitments.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-900 font-semibold mb-2">No commitments yet</p>
                <p className="text-sm text-slate-600 mb-6">Start tracking your commitments and measure your progress</p>
                <Link
                  href="/commitments/new"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first commitment
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Commitment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Delta
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {commitments.map((commitment) => (
                    <tr
                      key={commitment.id}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = `/commitments/${commitment.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/commitments/${commitment.id}`}
                          className="text-sm font-mono font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {commitment.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 max-w-md">
                          {commitment.text || <span className="text-slate-400 italic">No text</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Created {formatDate(commitment.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-slate-900">{commitment.declaredConfidence}%</div>
                          <div className="ml-2 w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                              style={{ width: `${commitment.declaredConfidence}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-medium">
                          {commitment.deadline ? formatDate(commitment.deadline) : <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {commitment.category || 'uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getOutcomeBadge(commitment.outcome)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">
                          {commitment.deltaMinutes !== null && commitment.deltaMinutes !== undefined
                            ? `${commitment.deltaMinutes > 0 ? '+' : ''}${commitment.deltaMinutes.toFixed(1)}m`
                            : <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Calibration Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Calibration by Confidence Bucket</h2>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No completed commitments yet to compute calibration.</p>
            <p className="text-sm text-slate-500 mt-2">Complete some commitments to see your calibration metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
