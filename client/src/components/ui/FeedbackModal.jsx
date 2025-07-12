import React, { useState } from 'react';
import { X, Send, Star } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Rating from './Rating';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const FeedbackModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onSubmit 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please provide a comment with at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        comment: comment.trim()
      });
      
      toast.success('Feedback submitted successfully!');
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Rate & Review
              </h2>
              <p className="text-sm text-gray-600">
                Share your experience with {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-600">{user?.location}</p>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your experience?
            </label>
            <div className="flex justify-center">
              <Rating
                value={rating}
                onChange={setRating}
                size="xl"
                showValue={false}
              />
            </div>
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm text-gray-600 mt-2"
              >
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your skill swap experience..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Minimum 10 characters required
              </p>
              <p className="text-xs text-gray-500">
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={rating === 0 || comment.trim().length < 10}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
