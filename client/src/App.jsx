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
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);


  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSwapRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  const handleLogin = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: email,
      role: email === 'admin@skillswap.com' ? 'admin' : 'user',
      profilePhoto: 'https://images.pexels.com/photos/3782179/pexels-photo-3782179.jpeg?auto=compress&cs=tinysrgb&w=150',
      skillsOffered: ['Web Development', 'UI/UX Design'],
      skillsWanted: ['Photography', 'Content Writing'],
      rating: 4.8,
      location: 'San Francisco, CA'
    };
    setCurrentUser(mockUser);
    setCurrentPage('home');
  };
const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
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
            path="/admin"
            element={
              currentUser && currentUser.role === 'admin' ? (
                <AdminDashboard currentUser={currentUser} onNavigate={setCurrentPage} />
              ) : (
                <div className="text-center">
                  <p className="text-lg font-semibold">Unauthorized Access</p>
                  <p className="text-gray-600">You must be an admin to view this page.</p>
                  <Login onLogin={handleLogin} onNavigate={setCurrentPage} />
                </div>
              )
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