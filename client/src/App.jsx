import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Header from './components/Header';
import SwapRequestModal from './components/SwapRequestModal';

import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/Signup';
import Profile from './pages/ProfilePage';
import Requests from './pages/RequestsPage';
import Browse from './pages/Browse';
import UserProfileView from './pages/UserProfileView';

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSwapRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={user} onNavigate={handleNavigate} onLogout={logout} />

      <main className="container mx-auto pt-16 px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home onSwapRequest={handleSwapRequest} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <Browse onSwapRequest={handleSwapRequest} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute>
                <UserProfileView />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div className="text-center text-xl font-bold text-red-500">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {showSwapModal && selectedUser && user && (
        <SwapRequestModal
          fromUser={user}
          toUser={selectedUser}
          onClose={() => setShowSwapModal(false)}
          onSubmit={(data) => {
            setShowSwapModal(false);
          }}
        />
      )}
    </div>
  );
}

export default App;