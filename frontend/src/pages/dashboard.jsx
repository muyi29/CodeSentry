import { useState } from "react";
import { fetchPRReview } from "../services/api";

function Dashboard() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmit = async () => {
    try {
      const { data } = await fetchPRReview(owner, repo, prNumber);
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI PR Reviewer</h2>

      <div className="space-x-2">
        <input
          className="border p-2 rounded"
          placeholder="Owner"
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Repo"
          onChange={(e) => setRepo(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="PR Number"
          onChange={(e) => setPrNumber(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Review PR
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="border p-4 bg-white rounded shadow">
            <h3 className="font-bold">{r.filename}</h3>
            <pre className="whitespace-pre-wrap">{r.review}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
