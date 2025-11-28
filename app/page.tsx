import Link from 'next/link';
import { Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-8">
            <Target className="w-20 h-20 text-white mx-auto mb-6" />
            <h1 className="text-6xl font-bold text-white mb-6">
              Commitment Dashboard
            </h1>
            <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Track your commitments, measure your sincerity, and achieve your goals with data-driven insights.
            </p>
          </div>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-indigo-700 text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-indigo-800 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <CheckCircle2 className="w-10 h-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Track Everything</h3>
              <p className="text-indigo-100">
                Record all your commitments with confidence levels and deadlines
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <TrendingUp className="w-10 h-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Measure Progress</h3>
              <p className="text-indigo-100">
                Get insights into your success rate and calibration metrics
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <Target className="w-10 h-10 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-white mb-2">Stay Accountable</h3>
              <p className="text-indigo-100">
                Resolve commitments with evidence and testimony
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
