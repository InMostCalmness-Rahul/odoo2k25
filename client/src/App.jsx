import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RequestsPage } from './pages/RequestsPage';
import { SwapRequestModal } from './components/SwapRequestModal';
import { notifyLoginSuccess, notifyLogout, notifySwapRequest } from './utils/toast';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogin = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: email,
      role: email === 'admin@example.com' ? 'admin' : 'user',
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

  const handleSwapRequest = (targetUser) => {
    setSelectedUser(targetUser);
    setShowSwapModal(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'profile':
        return currentUser ? (
          <ProfilePage user={currentUser} onNavigate={setCurrentPage} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
        );
      case 'requests':
        return currentUser ? (
          <RequestsPage user={currentUser} onNavigate={setCurrentPage} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
        );
      case 'admin':
        return currentUser && currentUser.role === 'admin' ? (
          <AdminDashboard currentUser={currentUser} onNavigate={setCurrentPage} />
        ) : (
          <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
        );
      default:
        return (
          <HomePage 
            currentUser={currentUser} 
            onNavigate={setCurrentPage}
            onSwapRequest={handleSwapRequest}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="pt-16">
        {renderPage()}
      </main>

      {showSwapModal && selectedUser && user && (
      
      {showSwapModal && selectedUser && currentUser && (
        <SwapRequestModal
          fromUser={user}
          toUser={selectedUser}
          onClose={() => setShowSwapModal(false)}
          onSubmit={() => {
            setShowSwapModal(false);
            setCurrentPage('requests');
          }}
        />
      )}
    </div>
  );
}

export default App;