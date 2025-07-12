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
import Requests from './pages/RequestsPage';
import Browse from './pages/Browse';
import ProfilePage from './pages/ProfilePage';
import UserProfileView from './pages/UserProfileView';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSwapRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentUser={user} onLogout={logout} />

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
            path="/admin"
            element={
              <ProtectedRoute>
                {user && user.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-semibold">Unauthorized Access</p>
                    <p className="text-gray-600">You must be an admin to view this page.</p>
                  </div>
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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