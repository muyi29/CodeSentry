import { useState } from "react";
import Dashboard from "./pages/dashboard";

function App() {
  const [page] = useState("dashboard");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Header */}
      <header className="backdrop-blur-md bg-neutral-900/80 border-b border-neutral-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-neutral-200 to-neutral-400 rounded-md flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-neutral-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  CodeSentry
                </h1>
                <p className="text-xs text-neutral-400">
                  AI-Powered Code Review
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 border border-neutral-700 rounded-full text-xs text-neutral-400">
                ● Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-10">
        {page === "dashboard" && <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-500">
        <p>
          Built with <span className="font-medium text-neutral-300">FastAPI</span>,{" "}
          <span className="font-medium text-neutral-300">React</span> &{" "}
          <span className="font-medium text-neutral-300">OpenAI</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
