import React from 'react';
import { Users, UserCheck, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminOverview({ stats }) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.users.total}</p>
              <p className="text-sm text-green-600">+{stats?.users.recent} this week</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.users.active}</p>
              <p className="text-sm text-gray-500">{Math.round((stats?.users.active / stats?.users.total) * 100)}% of total</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.requests.total}</p>
              <p className="text-sm text-blue-600">+{stats?.requests.recent} this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.requests.pending}</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Skills</h3>
        <div className="space-y-3">
          {stats?.popularSkills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{skill.skill}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(skill.count / stats.popularSkills[0].count) * 100}%` }}
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
}
