import React from 'react';
import { CheckCircle, Clock, Ban, XCircle } from 'lucide-react';

export default function AdminStatusBadge({ status }) {
  // Handle undefined or null status
  if (!status) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        Unknown
      </span>
    );
  }

  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock },
    banned: { color: 'bg-red-100 text-red-800', icon: Ban },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    accepted: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
  };
  
  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
