import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  BarChart3,
  FileText,
  Search,
  Filter,
  MoreVertical,
  Ban,
  Trash2,
  Eye,
  Download,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export function AdminDashboard({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Mock data - replace with actual API calls
  const mockStats = {
    users: {
      total: 150,
      active: 140,
      public: 120,
      admins: 2,
      recent: 15,
    },
    requests: {
      total: 89,
      pending: 12,
      accepted: 35,
      completed: 25,
      recent: 8,
    },
    popularSkills: [
      { skill: 'JavaScript', count: 25 },
      { skill: 'Guitar', count: 18 },
      { skill: 'Photography', count: 15 },
      { skill: 'Cooking', count: 12 },
      { skill: 'Spanish', count: 10 },
    ],
  };

  const mockUsers = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      swapCount: 5,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      swapCount: 8,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      status: 'inactive',
      role: 'user',
      joinDate: '2024-01-05',
      lastActive: '2024-01-12',
      swapCount: 3,
      rating: 4.7,
    },
  ];

  const mockSwapRequests = [
    {
      id: '1',
      fromUser: 'Alex Johnson',
      toUser: 'Sarah Chen',
      skillOffered: 'Web Development',
      skillWanted: 'Photography',
      status: 'pending',
      createdAt: '2024-01-20T10:30:00Z',
      message: "Hi Sarah! I'd love to learn photography from you...",
    },
    {
      id: '2',
      fromUser: 'Mike Rodriguez',
      toUser: 'Alex Johnson',
      skillOffered: 'Content Writing',
      skillWanted: 'UI/UX Design',
      status: 'accepted',
      createdAt: '2024-01-18T14:15:00Z',
      message: 'Hey! I saw your UX design skills...',
    },
    {
      id: '3',
      fromUser: 'Sarah Chen',
      toUser: 'Mike Rodriguez',
      skillOffered: 'Photography',
      skillWanted: 'Copywriting',
      status: 'completed',
      createdAt: '2024-01-15T09:20:00Z',
      message: "I'm interested in improving my copywriting...",
    },
  ];

  useEffect(() => {
    setStats(mockStats);
    setUsers(mockUsers);
    setSwapRequests(mockSwapRequests);
  }, []);

  const handleUserAction = async (userId, action, reason = '') => {
    setLoading(true);
    try {
      // API call would go here
      console.log(`${action} user ${userId}`, reason);
      // Update local state
      if (action === 'ban') {
        setUsers(
          users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === 'active' ? 'banned' : 'active',
                }
              : user
          )
        );
      } else if (action === 'delete') {
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (format = 'json') => {
    setLoading(true);
    try {
      // API call would go here
      console.log(`Generating ${format} report`);
      // Mock download
      const data =
        format === 'csv' ? 'CSV data...' : JSON.stringify(mockStats, null, 2);
      const blob = new Blob([data], {
        type: format === 'csv' ? 'text/csv' : 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-report-${
        new Date().toISOString().split('T')[0]
      }.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      banned: { color: 'bg-red-100 text-red-800', icon: Ban },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.users.total}
              </p>
              <p className="text-sm text-green-600">
                +{stats?.users.recent} this week
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.users.active}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round((stats?.users.active / stats?.users.total) * 100)}%
                of total
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Swap Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.requests.total}
              </p>
              <p className="text-sm text-blue-600">
                +{stats?.requests.recent} this week
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.requests.pending}
              </p>
              <p className="text-sm text-orange-600">Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Skills */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Popular Skills
        </h3>
        <div className="space-y-3">
          {stats?.popularSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.skill}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (skill.count / stats.popularSkills[0].count) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8">{skill.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={userFilters.status}
            onChange={(e) =>
              setUserFilters({ ...userFilters, status: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
          <select
            value={userFilters.role}
            onChange={(e) =>
              setUserFilters({ ...userFilters, role: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Swaps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.swapCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ⭐ {user.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUserAction(user.id, 'ban')}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          user.status === 'banned'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                        title={
                          user.status === 'banned' ? 'Unban user' : 'Ban user'
                        }
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="p-1 rounded hover:bg-gray-100 text-red-600"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-gray-100 text-gray-600"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSwapRequests = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={swapFilters.status}
            onChange={(e) =>
              setSwapFilters({ ...swapFilters, status: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={swapFilters.sort}
            onChange={(e) =>
              setSwapFilters({ ...swapFilters, sort: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Swap Requests */}
      <div className="space-y-4">
        {swapRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {request.fromUser} → {request.toUser}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(request.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {request.skillOffered}
                </div>
                <p className="text-xs text-gray-500 mt-1">Offered</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-gray-600">⇄</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {request.skillWanted}
                </div>
                <p className="text-xs text-gray-500 mt-1">Wanted</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">{request.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Generate Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => generateReport('json')}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate JSON</span>
              </button>
              <button
                onClick={() => generateReport('csv')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage users, monitor swap requests, and view platform analytics.
        </p>
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
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'swaps' && renderSwapRequests()}
      {activeTab === 'reports' && renderReports()}
    </div>
  );
}
