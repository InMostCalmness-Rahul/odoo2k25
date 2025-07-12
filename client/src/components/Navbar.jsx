import { Link } from 'react-router-dom';

const Navbar = () => {
  // TODO: Connect to AuthContext for auth state
  const isAuthenticated = false; // placeholder
  const user = null; // placeholder

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
            SkillSwap
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 focus:outline-none focus:underline transition-colors">Profile</Link>
                <Link to="/requests" className="text-gray-700 hover:text-primary-600 focus:outline-none focus:underline transition-colors">Requests</Link>
                <span className="text-gray-600 hidden sm:inline">Welcome, {user?.name || 'User'}</span>
                <button
                  type="button"
                  className="btn-secondary"
                  aria-label="Logout"
                  // onClick={logout}
                  disabled={false}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 focus:outline-none focus:underline transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
