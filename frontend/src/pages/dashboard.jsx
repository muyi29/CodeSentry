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
      low: "bg-green-950/40 text-green-300 border-green-900",
      medium: "bg-yellow-950/40 text-yellow-300 border-yellow-900",
      high: "bg-orange-950/40 text-orange-300 border-orange-900",
      critical: "bg-red-950/40 text-red-300 border-red-900",
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-neutral-100">
      {/* Input Card */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-neutral-100 text-neutral-900 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">PR Review Assistant</h2>
            <p className="text-sm text-neutral-400">
              Enter GitHub PR details to analyze
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Repository Owner", value: owner, setValue: setOwner, placeholder: "e.g., facebook" },
            { label: "Repository Name", value: repo, setValue: setRepo, placeholder: "e.g., react" },
            { label: "PR Number", value: prNumber, setValue: setPrNumber, placeholder: "e.g., 123", type: "number" },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm text-neutral-400 mb-1">
                {field.label}
              </label>
              <input
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder={field.placeholder}
                value={field.value}
                type={field.type || "text"}
                onChange={(e) => field.setValue(e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium px-6 py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-800"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing PR...
            </span>
          ) : (
            "Analyze Pull Request"
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-950/40 border border-red-900 text-red-300 rounded-lg p-4 flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      {totalFiles > 0 && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Files Reviewed</span>
            <span className="text-2xl font-semibold">{totalFiles}</span>
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.map((r, i) => (
        <div
          key={i}
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden"
        >
          <div className="border-b border-neutral-800 p-4 flex items-center justify-between">
            <h3 className="font-mono text-sm text-neutral-300">{r.filename}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-green-400 text-sm">+{r.additions || 0}</span>
              <span className="text-red-400 text-sm">-{r.deletions || 0}</span>
              {r.review?.severity && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                    r.review.severity
                  )}`}
                >
                  {r.review.severity}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-5 text-neutral-300">
            {r.review?.quality && (
              <div>
                <h4 className="font-medium text-neutral-100 mb-2">
                  Code Quality
                </h4>
                <p className="text-neutral-400 leading-relaxed">
                  {r.review.quality}
                </p>
              </div>
            )}

            {r.review?.security?.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-100 mb-2">
                  Security Issues
                </h4>
                <ul className="space-y-1">
                  {r.review.security.map((item, idx) => (
                    <li key={idx} className="text-red-300 flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {r.review?.performance?.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-100 mb-2">Performance</h4>
                <ul className="space-y-1">
                  {r.review.performance.map((item, idx) => (
                    <li key={idx} className="text-yellow-300 flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {r.review?.best_practices?.length > 0 && (
              <div>
                <h4 className="font-medium text-neutral-100 mb-2">
                  Best Practices
                </h4>
                <ul className="space-y-1">
                  {r.review.best_practices.map((item, idx) => (
                    <li key={idx} className="text-blue-300 flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {!loading && reviews.length === 0 && !error && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-100 mb-1">
            No Reviews Yet
          </h3>
          <p className="text-neutral-400">
            Enter a GitHub PR above to get started with AI-powered review
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
