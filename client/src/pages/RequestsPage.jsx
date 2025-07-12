import React, { useState } from 'react';
import { Clock, Check, X, User as UserIcon, Calendar, MessageSquare, Mail, Phone, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/Alert';
import { notifySwapAccepted, notifySwapRejected } from '../utils/toast';
import { formatRelativeTime } from '../utils/helpers';

export function RequestsPage({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('received');

  const mockReceivedRequests = [
    {
      id: '1',
      from: {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        profilePhoto: 'https://images.pexels.com/photos/3783830/pexels-photo-3783830.jpeg?auto=compress&cs=tinysrgb&w=150',
        skillsOffered: ['Photography', 'Photo Editing'],
        skillsWanted: ['Web Development', 'SEO'],
        rating: 4.9,
        location: 'New York, NY'
      },
      to: user,
      offeredSkill: 'Photography',
      requestedSkill: 'Web Development',
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
      offeredSkill: 'Content Writing',
      requestedSkill: 'UI/UX Design',
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
      offeredSkill: 'Web Development',
      requestedSkill: 'Graphic Design',
      message: 'Hi Emily! I\'m a web developer looking to improve my graphic design skills. I\'d be happy to help you with any web development projects in exchange!',
      status: 'pending',
      createdAt: '2024-01-19T16:20:00Z'
    }
  ];

  const handleRequestAction = (requestId, action, requesterName) => {
    // In a real app, this would update the request status via API
    console.log(`${action} request ${requestId}`);
    
    if (action === 'accept') {
      notifySwapAccepted(requesterName);
    } else if (action === 'reject') {
      notifySwapRejected(requesterName);
    }
  };

  const formatDate = (dateString) => {
    return formatRelativeTime(dateString);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'accepted':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderRequestCard = (request, isReceived) => (
    <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
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
            <p className="text-sm text-gray-600">{formatDate(request.createdAt)}</p>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>

      {/* Skill Exchange */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <Badge variant="primary" className="mb-1">
              {request.offeredSkill}
            </Badge>
            <p className="text-xs text-gray-600">
              {isReceived ? 'They offer' : 'You offered'}
            </p>
          </div>
          <div className="text-2xl text-gray-400">⇄</div>
          <div className="text-center">
            <Badge variant="success" className="mb-1">
              {request.requestedSkill}
            </Badge>
            <p className="text-xs text-gray-600">
              {isReceived ? 'They want' : 'You requested'}
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">{request.message}</p>
        </div>
      </div>

      {/* Actions */}
      {isReceived && request.status === 'pending' && (
        <div className="flex space-x-3">
          <Button
            variant="success"
            size="sm"
            icon={Check}
            onClick={() => handleRequestAction(request.id, 'accept', request.from.name)}
            className="flex-1"
          >
            Accept
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={X}
            onClick={() => handleRequestAction(request.id, 'reject', request.from.name)}
            className="flex-1"
          >
            Decline
          </Button>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
          <p className="text-sm text-green-700">
            🎉 Swap request accepted! Time to start learning.
          </p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" icon={Mail}>
              Message
            </Button>
            <Button size="sm" variant="outline" icon={Phone}>
              Contact
            </Button>
          </div>
        </div>
      )}
    </Card>
  );

  const receivedRequests = mockReceivedRequests;
  const sentRequests = mockSentRequests;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">
          Manage your incoming and outgoing skill exchange requests
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'received'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Received ({receivedRequests.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'sent'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserIcon className="w-4 h-4" />
            <span>Sent ({sentRequests.length})</span>
          </div>
        </button>
      </div>

      {/* Request Lists */}
      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedRequests.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No requests received"
              description="When someone wants to exchange skills with you, their requests will appear here."
              action={
                <Button onClick={() => onNavigate('home')} variant="primary">
                  Browse People
                </Button>
              }
            />
          ) : (
            receivedRequests.map(request => renderRequestCard(request, true))
          )
        ) : (
          sentRequests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No requests sent"
              description="Start browsing profiles and send skill exchange requests to begin learning!"
              action={
                <Button onClick={() => onNavigate('home')} variant="primary">
                  Find People
                </Button>
              }
            />
          ) : (
            sentRequests.map(request => renderRequestCard(request, false))
          )
        )}
      </div>
    </div>
  );
}
