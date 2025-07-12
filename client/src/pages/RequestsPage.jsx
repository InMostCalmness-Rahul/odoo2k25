import React, { useState } from 'react';
import {
  Clock, Check, X, User as UserIcon, Calendar, MessageSquare
} from 'lucide-react';

export default function RequestsPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('received');

  const mockReceivedRequests = [
    // ... unchanged
  ];

  const mockSentRequests = [
    // ... unchanged
  ];

  const handleRequestAction = (requestId, action) => {
    console.log(`${action} request ${requestId}`);
    // Implement API call to accept/reject
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusBadge = (status) => {
    const badgeStyles = {
      pending: { text: 'Pending', icon: <Clock />, bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
      accepted: { text: 'Accepted', icon: <Check />, bg: 'bg-green-100', textColor: 'text-green-800' },
      rejected: { text: 'Rejected', icon: <X />, bg: 'bg-red-100', textColor: 'text-red-800' },
    }[status];

    if (!badgeStyles) return null;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeStyles.bg} ${badgeStyles.textColor}`}>
        {React.cloneElement(badgeStyles.icon, { className: 'w-4 h-4 mr-1' })}
        {badgeStyles.text}
      </span>
    );
  };

  const RequestCard = ({ request, isReceived }) => {
    const counterpart = isReceived ? request.from : request.to;

    return (
      <div key={request.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={counterpart.profilePhoto}
              alt={counterpart.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{counterpart.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(request.status)}
        </div>

        {/* Skills Exchange */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 items-center text-center gap-4">
          <div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{request.skillOffered}</div>
            <p className="text-xs text-gray-500 mt-1">{isReceived ? 'They offer' : 'You offer'}</p>
          </div>
          <div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-600">⇄</span>
            </div>
          </div>
          <div>
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{request.skillWanted}</div>
            <p className="text-xs text-gray-500 mt-1">{isReceived ? 'They want' : 'You want'}</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Message</span>
          </div>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{request.message}</p>
        </div>

        {/* Action Buttons */}
        {isReceived && request.status === 'pending' && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleRequestAction(request.id, 'accept')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => handleRequestAction(request.id, 'reject')}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEmptyState = (type) => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {type === 'received' ? (
          <UserIcon className="w-12 h-12 text-gray-400" />
        ) : (
          <MessageSquare className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No requests {type === 'received' ? 'received' : 'sent'}
      </h3>
      <p className="text-gray-600 mb-4">
        {type === 'received'
          ? "When people request to swap skills with you, they'll appear here."
          : 'Start connecting with people by sending skill swap requests.'}
      </p>
      {type === 'sent' && (
        <button
          onClick={() => onNavigate('home')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Browse Skills
        </button>
      )}
    </div>
  );

  const activeRequests = activeTab === 'received' ? mockReceivedRequests : mockSentRequests;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your skill exchange requests and build your learning network.</p>
      </header>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border mb-8">
        <div className="flex border-b border-gray-200">
          {['received', 'sent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'received' ? 'Received Requests' : 'Sent Requests'}
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tab === 'received' ? mockReceivedRequests.length : mockSentRequests.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests */}
      <div className="space-y-6">
        {activeRequests.length > 0
          ? activeRequests.map((request) =>
              <RequestCard key={request.id} request={request} isReceived={activeTab === 'received'} />
            )
          : renderEmptyState(activeTab)}
      </div>
    </div>
  );
}
