import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RequestsPage } from './pages/RequestsPage';
import { SwapRequestModal } from './components/SwapRequestModal';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogin = (email, password) => {
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email,
      profilePhoto: 'https://images.pexels.com/photos/3782179/pexels-photo-3782179.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['Web Development', 'UI/UX Design'],
      skillsWanted: ['Photography', 'Content Writing'],
      rating: 4.8,
      location: 'San Francisco, CA',
    };
    setCurrentUser(mockUser);
    navigate('/profile'); // go to profile after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/'); // go to home after logout
  };

  const handleSwapRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onNavigate={handleNavigate} // 🔷 pass navigate handler
        onLogout={handleLogout}
      />

      <main className="pt-16">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                currentUser={currentUser}
                onSwapRequest={handleSwapRequest}
              />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}
              />
            }
          />

          <Route
            path="/profile"
            element={
              currentUser ? (
                <ProfilePage user={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/requests"
            element={
              currentUser ? (
                <RequestsPage user={currentUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {showSwapModal && selectedUser && currentUser && (
        <SwapRequestModal
          fromUser={currentUser}
          toUser={selectedUser}
          onClose={() => setShowSwapModal(false)}
          onSubmit={() => {
            setShowSwapModal(false);
          }}
        />
      )}
    </div>
  );
}

export default AppWrapper;
