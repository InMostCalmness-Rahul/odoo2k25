import React, { useState } from 'react';
import { Clock, Check, X, User as UserIcon, Calendar, MessageSquare } from 'lucide-react';

export function RequestsPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('received');

  const mockReceivedRequests = [
    {
      id: '1',
      from: {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        profilePhoto: 'https://images.pexels.com/photos/3483830/pexels-photo-3483830.jpeg?auto=compress&cs=tinysrgb&w=150',
        skillsOffered: ['Photography', 'Photo Editing'],
        skillsWanted: ['Web Development', 'SEO'],
        rating: 4.9,
        location: 'New York, NY'
      },
      to: user,
      skillOffered: 'Photography',
      skillWanted: 'Web Development',
      message: 'Hi Alex! I\'d love to learn web development from you. In exchange, I can teach you professional photography techniques and photo editing. Let me know if you\'re interested!',
      status: 'pending',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      from: {
        id: '3',
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        profilePhoto: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150',
        skillsOffered: ['Content Writing', 'Copywriting'],
        skillsWanted: ['Graphic Design', 'Illustration'],
        rating: 4.7,
        location: 'Austin, TX'
      },
      to: user,
      skillOffered: 'Content Writing',
      skillWanted: 'UI/UX Design',
      message: 'Hey! I saw your UX design skills and I\'m really interested in learning. I\'m a professional copywriter and would love to help you with content strategy in return.',
      status: 'accepted',
      createdAt: '2024-01-18T14:15:00Z'
    }
  ];

  const mockSentRequests = [
    {
      id: '3',
      from: user,
      to: {
        id: '4',
        name: 'Emily Foster',
        email: 'emily@example.com',
        profilePhoto: 'https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg?auto=compress&cs=tinysrgb&w=150',
        skillsOffered: ['Graphic Design', 'UI/UX Design'],
        skillsWanted: ['Digital Marketing', 'Social Media'],
        rating: 4.8,
        location: 'Seattle, WA'
      },
      skillOffered: 'Web Development',
      skillWanted: 'Graphic Design',
      message: 'Hi Emily! I\'m a web developer looking to improve my graphic design skills. I\'d be happy to help you with any web development projects in exchange!',
      status: 'pending',
      createdAt: '2024-01-19T16:20:00Z'
    }
  ];

  const handleRequestAction = (requestId, action) => {
    // In a real app, this would update the request status via API
    console.log(`${action} request ${requestId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Check className="w-4 h-4 mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderRequestCard = (request, isReceived) => (
    <div key={request.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* Request Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={isReceived ? request.from.profilePhoto : request.to.profilePhoto}
            alt={isReceived ? request.from.name : request.to.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {isReceived ? request.from.name : request.to.name}
            </h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(request.createdAt)}</span>
            </div>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>

      {/* Skill Exchange */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {request.skillOffered}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isReceived ? 'They offer' : 'You offer'}
            </p>
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
            <p className="text-xs text-gray-500 mt-1">
              {isReceived ? 'They want' : 'You want'}
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MessageSquare className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Message</span>
        </div>
        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
          {request.message}
        </p>
      </div>

      {/* Actions */}
      {isReceived && request.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => handleRequestAction(request.id, 'accept')}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Accept</span>
          </button>
          <button
            onClick={() => handleRequestAction(request.id, 'reject')}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Decline</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">
          Manage your skill exchange requests and build your learning network.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Received Requests
            <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {mockReceivedRequests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === 'sent'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent Requests
            <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {mockSentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-6">
        {activeTab === 'received' ? (
          mockReceivedRequests.length > 0 ? (
            mockReceivedRequests.map(request => renderRequestCard(request, true))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests received</h3>
              <p className="text-gray-600">
                When people request to swap skills with you, they'll appear here.
              </p>
            </div>
          )
        ) : (
          mockSentRequests.length > 0 ? (
            mockSentRequests.map(request => renderRequestCard(request, false))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent</h3>
              <p className="text-gray-600 mb-4">
                Start connecting with people by sending skill swap requests.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Skills
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}