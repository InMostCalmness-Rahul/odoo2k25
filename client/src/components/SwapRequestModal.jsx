import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function SwapRequestModal({ fromUser, toUser, onClose, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    const swapData = {
      from: fromUser,
      to: toUser,
      message,
      skillOffered: fromUser.skillsOffered[0] || '',
      skillWanted: toUser.skillsOffered[0] || '',
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    onSubmit(swapData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">
          Request Skill Swap
        </h2>
        <p className="text-gray-600 mb-4">
          You're requesting a swap with <strong>{toUser.name}</strong>.
        </p>

        {/* Skill Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">You Offer</p>
              <p className="text-blue-600 font-medium">
                {fromUser.skillsOffered[0] || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">You Want</p>
              <p className="text-emerald-600 font-medium">
                {toUser.skillsOffered[0] || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Message Field */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a short message explaining your swap proposal..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Request
          </button>
        </form>
      </div>
    </AnimatePresence>
  );
}
