import { useState } from "react";
import { fetchPRReview } from "../services/api";

function Dashboard() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);

  const handleSubmit = async () => {
    if (!owner || !repo || !prNumber) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setReviews([]);

    try {
      const { data } = await fetchPRReview(owner, repo, prNumber);
      setReviews(data.reviews);
      setTotalFiles(data.total_files || 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch review. Please check your inputs.");
      console.error("Error fetching review:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
    return styles[severity] || styles.low;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Input Card - Vercel Style */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        
        <div className="relative p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-1">Review Pull Request</h2>
            <p className="text-sm text-white/60">AI-powered code analysis in seconds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              { label: "Owner", value: owner, setValue: setOwner, placeholder: "vercel" },
              { label: "Repository", value: repo, setValue: setRepo, placeholder: "next.js" },
              { label: "PR #", value: prNumber, setValue: setPrNumber, placeholder: "12345", type: "number" },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  {field.label}
                </label>
                <input
                  className="w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  placeholder={field.placeholder}
                  value={field.value}
                  type={field.type || "text"}
                  onChange={(e) => field.setValue(e.target.value)}
                />
              </div>
            ))}
          </div>

          <button
            className="w-full h-10 bg-white hover:bg-white/90 text-black text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze PR
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Badge */}
      {totalFiles > 0 && (
        <div className="flex items-center gap-3 px-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm">
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white/60">{totalFiles} file{totalFiles !== 1 ? 's' : ''} reviewed</span>
          </div>
        </div>
      )}

      {/* Reviews - Vercel Cards */}
      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-white/20 transition-all">
            {/* Header */}
            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <span className="font-mono text-sm text-white/90 truncate">{r.filename}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400">+{r.additions || 0}</span>
                  <span className="text-rose-400">−{r.deletions || 0}</span>
                </div>
                {r.review?.severity && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getSeverityBadge(r.review.severity)}`}>
                    {r.review.severity}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {r.review?.quality && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-blue-500/50 rounded-full" />
                    <h4 className="text-sm font-medium text-white">Code Quality</h4>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed pl-3">
                    {r.review.quality}
                  </p>
                </div>
              )}

              {r.review?.security?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-rose-500/50 rounded-full" />
                    <h4 className="text-sm font-medium text-white">Security</h4>
                  </div>
                  <ul className="space-y-1.5 pl-3">
                    {r.review.security.map((item, idx) => (
                      <li key={idx} className="text-sm text-rose-300/90 flex items-start gap-2">
                        <span className="text-rose-400/60 mt-1">→</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.review?.performance?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-amber-500/50 rounded-full" />
                    <h4 className="text-sm font-medium text-white">Performance</h4>
                  </div>
                  <ul className="space-y-1.5 pl-3">
                    {r.review.performance.map((item, idx) => (
                      <li key={idx} className="text-sm text-amber-300/90 flex items-start gap-2">
                        <span className="text-amber-400/60 mt-1">→</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.review?.best_practices?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-emerald-500/50 rounded-full" />
                    <h4 className="text-sm font-medium text-white">Best Practices</h4>
                  </div>
                  <ul className="space-y-1.5 pl-3">
                    {r.review.best_practices.map((item, idx) => (
                      <li key={idx} className="text-sm text-emerald-300/90 flex items-start gap-2">
                        <span className="text-emerald-400/60 mt-1">→</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && reviews.length === 0 && !error && (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-white mb-1">No reviews yet</h3>
          <p className="text-sm text-white/60">Enter a PR to get AI-powered insights</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;