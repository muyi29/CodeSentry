import { useState } from "react";
import Dashboard from "./pages/dashboard";

function App() {
  const [page] = useState("dashboard"); 

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">CodeSentry</h1>
      </header>

      <main className="p-6">
        {page === "dashboard" && <Dashboard />}
      </main>
    </div>
  );
}

export default App;
