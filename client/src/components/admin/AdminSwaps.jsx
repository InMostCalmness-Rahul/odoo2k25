import React from 'react';
import AdminStatusBadge from './AdminStatusBadge';

export default function AdminSwaps({ swapRequests, swapFilters, setSwapFilters }) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={swapFilters.status}
            onChange={(e) => setSwapFilters({ ...swapFilters, status: e.target.value })}
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
            onChange={(e) => setSwapFilters({ ...swapFilters, sort: e.target.value })}
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
          <div key={request.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium text-gray-900">{request.fromUser} → {request.toUser}</h4>
                  <p className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <AdminStatusBadge status={request.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{request.skillOffered}</div>
                <p className="text-xs text-gray-500 mt-1">Offered</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-gray-600">⇄</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">{request.skillWanted}</div>
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
}
