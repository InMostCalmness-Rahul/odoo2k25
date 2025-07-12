import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export function SwapRequestModal({ fromUser, toUser, onClose, onSubmit }) {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOfferedSkill && selectedWantedSkill && message.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={toUser.profilePhoto}
                alt={toUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{toUser.name}</h3>
                <p className="text-gray-600">{toUser.location}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-700">{toUser.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* What you offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill I can offer
              </label>
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill you can offer</option>
                {fromUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* What you want */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill I want to learn
              </label>
              <select
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill you want to learn</option>
                {toUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Preview */}
          {selectedOfferedSkill && selectedWantedSkill && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skill Exchange</h4>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedOfferedSkill}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">You teach</p>
                </div>
                <div className="text-blue-600 text-xl">⇄</div>
                <div className="text-center">
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedWantedSkill}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">You learn</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to exchange skills with this person..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              A personal message increases your chances of getting a positive response.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedOfferedSkill || !selectedWantedSkill || !message.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}