import React, { useState, useEffect } from 'react';
import { BarChart3, Users, MessageSquare, FileText } from 'lucide-react';
import { getAllUsers, banUser, deleteUser, getAllSwaps, getAdminStats } from '../api/admin';
import { toast } from 'react-toastify';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSwaps from '../components/admin/AdminSwaps';
import AdminReports from '../components/admin/AdminReports';
import UserProfileModal from '../components/admin/UserProfileModal';

export default function AdminDashboard({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [userFilters, setUserFilters] = useState({
    status: 'all',
    role: 'all',
    page: 1,
    limit: 10,
  });
  const [swapFilters, setSwapFilters] = useState({
    status: 'all',
    sort: 'newest',
    page: 1,
    limit: 10,
  });

  // Load admin data
  useEffect(() => {
    loadAdminData();
    // eslint-disable-next-line
  }, [activeTab, userFilters, swapFilters]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const statsData = await getAdminStats();
        setStats(statsData);
      }
      if (activeTab === 'users') {
        const usersData = await getAllUsers(userFilters);
        setUsers(usersData.users || []);
      }
      if (activeTab === 'swaps') {
        const swapsData = await getAllSwaps(swapFilters);
        setSwapRequests(swapsData.requests || []);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, shouldBan = true) => {
    try {
      let reason = '';
      if (shouldBan) {
        reason = prompt('Please provide a reason for banning this user:');
        if (reason === null) return; // User cancelled
        if (!reason.trim()) {
          toast.error('Please provide a reason for banning');
          return;
        }
      } else {
        reason = 'Unbanned by admin';
      }
      
      await banUser(userId, reason);
      toast.success(shouldBan ? 'User banned successfully' : 'User unbanned successfully');
      loadAdminData();
    } catch (error) {
      console.error('Failed to ban/unban user:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully');
        loadAdminData();
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'ban') {
        // Find the user to check current status
        const user = users.find(u => (u._id || u.id) === userId);
        const shouldBan = user?.status !== 'banned';
        await handleBanUser(userId, shouldBan);
      } else if (action === 'delete') {
        await handleDeleteUser(userId);
      } else if (action === 'view') {
        setSelectedUserId(userId);
        setShowUserProfileModal(true);
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const generateReport = async (format = 'json') => {
    setLoading(true);
    try {
      // TODO: Replace with real API call for report generation
      toast.info(`Generating ${format.toUpperCase()} report (mock)`);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating report:', error);
      setLoading(false);
    }
  };


  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'swaps', name: 'Swap Requests', icon: MessageSquare },
    { id: 'reports', name: 'Reports', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, monitor swap requests, and view platform analytics.</p>
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Content */}
      {activeTab === 'overview' && <AdminOverview stats={stats} />}
      {activeTab === 'users' && (
        <AdminUsers
          users={users}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          handleUserAction={handleUserAction}
        />
      )}
      {activeTab === 'swaps' && (
        <AdminSwaps
          swapRequests={swapRequests}
          swapFilters={swapFilters}
          setSwapFilters={setSwapFilters}
        />
      )}
      {activeTab === 'reports' && (
        <AdminReports loading={loading} generateReport={generateReport} />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={showUserProfileModal}
        onClose={() => {
          setShowUserProfileModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
