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

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-green-500/20 text-green-300 border-green-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      critical: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">PR Review Assistant</h2>
            <p className="text-purple-200">Enter GitHub PR details to analyze</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Repository Owner</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="e.g., facebook"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Repository Name</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="e.g., react"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">PR Number</label>
            <input
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="e.g., 123"
              type="number"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
            />
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing PR...
            </span>
          ) : (
            "🚀 Start Review"
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {totalFiles > 0 && (
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-purple-200">Files Reviewed</span>
            <span className="text-2xl font-bold text-white">{totalFiles}</span>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden shadow-xl">
            {/* File Header */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-mono font-semibold text-white">{r.filename}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 text-sm">+{r.additions || 0}</span>
                  <span className="text-red-400 text-sm">-{r.deletions || 0}</span>
                  {r.review?.severity && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(r.review.severity)}`}>
                      {r.review.severity}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="p-6 space-y-4">
              {/* Quality */}
              <div>
                <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Code Quality
                </h4>
                <p className="text-white/90 leading-relaxed">{r.review?.quality}</p>
              </div>

              {/* Security */}
              {r.review?.security?.length > 0 && (
                <div>
                  <h4 className="text-red-300 font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Security Issues
                  </h4>
                  <ul className="space-y-2">
                    {r.review.security.map((item, idx) => (
                      <li key={idx} className="text-red-200 flex items-start">
                        <span className="text-red-400 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Performance */}
              {r.review?.performance?.length > 0 && (
                <div>
                  <h4 className="text-yellow-300 font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Performance
                  </h4>
                  <ul className="space-y-2">
                    {r.review.performance.map((item, idx) => (
                      <li key={idx} className="text-yellow-200 flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best Practices */}
              {r.review?.best_practices?.length > 0 && (
                <div>
                  <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Best Practices
                  </h4>
                  <ul className="space-y-2">
                    {r.review.best_practices.map((item, idx) => (
                      <li key={idx} className="text-blue-200 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>{item}</span>
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
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
          <p className="text-purple-200">Enter a GitHub PR above to get started with AI-powered code review</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;