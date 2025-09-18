import { useState } from "react";
import { fetchPRReview } from "../services/api";

function Dashboard() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmit = async () => {
    const { data } = await fetchPRReview(owner, repo, prNumber);
    setReviews(data.reviews);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">CodeSentry - AI PR Reviewer</h1>
      <input placeholder="Owner" onChange={e => setOwner(e.target.value)} />
      <input placeholder="Repo" onChange={e => setRepo(e.target.value)} />
      <input placeholder="PR Number" onChange={e => setPrNumber(e.target.value)} />
      <button onClick={handleSubmit}>Review PR</button>

      <div className="mt-4">
        {reviews.map((r, i) => (
          <div key={i} className="border p-2 my-2">
            <h2>{r.filename}</h2>
            <pre>{r.review}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
