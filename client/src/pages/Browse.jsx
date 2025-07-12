import { useState, useEffect } from "react";
import { searchUsers } from "../api/user";
import { toast } from "react-toastify";

const Browse = ({ onSwapRequest }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (searchParams = {}) => {
    setLoading(true);
    try {
      console.log('Loading users with params:', searchParams);
      const res = await searchUsers(searchParams);
      console.log('API response:', res);
      const users = res.users || [];
      console.log('Users found:', users.length);
      setResults(users);

      if (users.length === 0) {
        console.log('No users found');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      // If no search term, load all users
      loadUsers();
      return;
    }

    // Search with the query
    loadUsers({ skill: trimmed });
  };

  const UserCard = ({ user }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">📍 {user.location || "Location not specified"}</p>
          </div>
        </div>
        {user.rating && (
          <div className="flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{user.rating}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <span className="font-medium text-gray-700">Skills Offered:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skillsOffered?.length > 0 ? (
              user.skillsOffered.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No skills offered</span>
            )}
          </div>
        </div>

        <div>
          <span className="font-medium text-gray-700">Skills Wanted:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skillsWanted?.length > 0 ? (
              user.skillsWanted.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No skills wanted</span>
            )}
          </div>
        </div>

        {user.availability?.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Available:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.availability.map((time, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onSwapRequest && onSwapRequest(user)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Request Skill Swap
      </button>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Users</h1>
        <p className="text-gray-600">Find users to exchange skills with</p>
      </div>

      {/* Search Form */}
      <section className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by name, skill, or location..."
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                loadUsers();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </section>

      {/* Results */}
      <section>
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600">
                {results.length} user{results.length !== 1 ? 's' : ''} found
                {query && ` for "${query}"`}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {query 
                ? `No users match your search for "${query}". Try a different search term.`
                : "No users are currently available. Check back later!"
              }
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Browse;
