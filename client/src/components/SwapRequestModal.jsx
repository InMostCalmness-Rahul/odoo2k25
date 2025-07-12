import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { createSwap } from '../api/swap';
import { toast } from 'react-toastify';

export default function SwapRequestModal({ fromUser, toUser, onClose, onSubmit }) {
  const [message, setMessage] = useState('');
  const [offeredSkill, setOfferedSkill] = useState(fromUser.skillsOffered[0] || '');
  const [requestedSkill, setRequestedSkill] = useState(toUser.skillsOffered[0] || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [duration, setDuration] = useState('1 hour');
  const [meetingType, setMeetingType] = useState('online');
  const [meetingDetails, setMeetingDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!offeredSkill) {
      toast.error('Please select a skill you want to offer');
      return;
    }

    if (!requestedSkill) {
      toast.error('Please select a skill you want to learn');
      return;
    }

    setIsSubmitting(true);

    try {
      const swapData = {
        toUser: toUser._id,
        offeredSkill,
        requestedSkill,
        message: message.trim(),
        scheduledDate: scheduledDate || undefined,
        duration,
        meetingType,
        meetingDetails: meetingDetails.trim() || undefined
      };

      await createSwap(swapData);
      toast.success('Swap request sent successfully!');
      onSubmit && onSubmit(swapData);
      onClose();
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error(error.response?.data?.error || 'Failed to send swap request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 relative m-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">
            Request Skill Swap
          </h2>
          <p className="text-gray-600 mb-6">
            You're requesting a swap with <strong>{toUser.name}</strong>.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Skill Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="offeredSkill" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Offer
                </label>
                <select
                  id="offeredSkill"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a skill you offer</option>
                  {fromUser.skillsOffered.map((skill, idx) => (
                    <option key={idx} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="requestedSkill" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill You Want
                </label>
                <select
                  id="requestedSkill"
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a skill you want</option>
                  {toUser.skillsOffered.map((skill, idx) => (
                    <option key={idx} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short message explaining your swap proposal..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Meeting Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="Half day">Half day</option>
                  <option value="Full day">Full day</option>
                </select>
              </div>

              <div>
                <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Type
                </label>
                <select
                  id="meetingType"
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="online">Online</option>
                  <option value="in-person">In Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="meetingDetails" className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Details (Optional)
                </label>
                <input
                  type="text"
                  id="meetingDetails"
                  value={meetingDetails}
                  onChange={(e) => setMeetingDetails(e.target.value)}
                  placeholder="e.g., Zoom link, location, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
}
