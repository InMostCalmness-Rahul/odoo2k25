import { useState } from 'react';

const FeedbackForm = ({ swapId, receiverId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = rating >= 1 && rating <= 5 && comment.trim().length > 0;
  const maxCommentLength = 500;

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Please provide a rating (1-5) and a comment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swapId,
          receiverId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRating(0);
    setComment('');
    setSubmitted(false);
    setError('');
  };

  const renderStarRating = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
            aria-label={`Rate ${star} out of 5 stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="space-y-4 p-4 border rounded-xl shadow-md max-w-md">
        <div className="text-center">
          <p className="text-green-600 text-lg font-medium">✅ Feedback submitted!</p>
          <p className="text-gray-600 text-sm mt-1">Thank you for your feedback.</p>
        </div>
        <button
          onClick={handleReset}
          className="w-full bg-yellow-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        >
          Submit Another Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-xl shadow-md max-w-md">
      <h2 className="text-lg font-semibold text-gray-800">Give Feedback</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        {renderStarRating()}
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            You rated: {rating} out of 5 stars
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block font-medium text-gray-700 mb-2">
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded p-2 w-full resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          rows={4}
          maxLength={maxCommentLength}
          placeholder="How was your experience? Share your thoughts..."
          aria-label="Feedback comment"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Required</span>
          <span>
            {comment.length}/{maxCommentLength}
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className={`w-full px-4 py-2 rounded font-medium transition-colors ${
          isValid && !isSubmitting
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your feedback helps improve the experience for everyone.
      </p>
    </div>
  );
};

export default FeedbackForm;