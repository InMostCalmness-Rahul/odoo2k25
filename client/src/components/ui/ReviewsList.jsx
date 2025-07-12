import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import Rating from './Rating';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const ReviewsList = ({ feedbacks = [], userRating = 0, feedbackCount = 0 }) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
          <p className="text-gray-600">Be the first to leave a review!</p>
        </div>
      </div>
    );
  }

  const displayedFeedbacks = showAll ? feedbacks : feedbacks.slice(0, 3);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reviews ({feedbackCount})
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={userRating} readonly size="sm" />
                <span className="text-sm text-gray-600">
                  {userRating.toFixed(1)} out of 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6 space-y-6">
        <AnimatePresence>
          {displayedFeedbacks.map((feedback, index) => (
            <motion.div
              key={feedback._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                {feedback.from?.profilePhoto ? (
                  <img
                    src={feedback.from.profilePhoto}
                    alt={feedback.from.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {feedback.from?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {feedback.from?.name || 'Anonymous'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Rating value={feedback.rating} readonly size="sm" showValue={false} />
                        <span className="text-sm text-gray-500">
                          {feedback.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Comment */}
                  {feedback.comment && (
                    <p className="text-gray-700 leading-relaxed">
                      {feedback.comment}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Show More/Less Button */}
        {feedbacks.length > 3 && (
          <div className="text-center pt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {feedbacks.length - 3} More Reviews
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
