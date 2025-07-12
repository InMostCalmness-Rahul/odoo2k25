import { useState } from "react";
import { searchUsers } from "../api/user";
import { toast } from "react-toastify";

const Browse = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      toast.warn("Please enter a search term.");
      return;
    }

    setLoading(true);
    setResults([]);
    try {
      const res = await searchUsersAPI(trimmed);
      const users = res.data.users || [];
      setResults(users);

      if (users.length === 0) {
        toast.info("No matching users found.");
      }
    } catch (err) {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h3 className="font-bold text-lg">{user.name}</h3>
      <p className="text-sm text-gray-600">📍 {user.location || "Unknown"}</p>

      <p className="mt-2 text-sm">
        <strong>Skills Offered:</strong>{" "}
        {user.skillsOffered?.join(", ") || "N/A"}
      </p>
      <p className="text-sm">
        <strong>Skills Wanted:</strong>{" "}
        {user.skillsWanted?.join(", ") || "N/A"}
      </p>

      {/* 🔄 Future functionality */}
      <button className="btn-secondary mt-3">Request Skill Swap</button>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      {/* 🔍 Search Form */}
      <section className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field flex-1"
            placeholder="Search users by name or skill..."
          />
          <button type="submit" className="btn-primary">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {/* 👥 Results */}
      <section>
        {loading && <p className="text-gray-600">Loading results...</p>}

        {!loading && results.length > 0 && (
          <div>
            {results.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="text-gray-500">No users found</p>
        )}
      </section>
    </main>
  );
};

export default Browse;
