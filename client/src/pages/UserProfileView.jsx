import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, MessageSquare, ArrowLeft, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserById, addFeedback } from '../api/user';
import { createSwap } from '../api/swap';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Rating from '../components/ui/Rating';
import ReviewsList from '../components/ui/ReviewsList';
import FeedbackModal from '../components/ui/FeedbackModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const UserProfileView = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Determine if this is the current user's profile or another user's profile
  const isOwnProfile = !userId; // If no userId param, it's the current user's profile
  const targetUserId = userId || currentUser?._id;

  useEffect(() => {
    if (targetUserId) {
      fetchUserProfile();
    }
  }, [targetUserId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      if (isOwnProfile) {
        // For own profile, use the current user data
        setProfileUser(currentUser);
      } else {
        // For other users, fetch their profile
        const response = await getUserById(targetUserId);
        setProfileUser(response);
      }
    } catch (error) {
      toast.error('Failed to load user profile');
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await addFeedback(targetUserId, feedbackData);
      // Refresh the profile to show new feedback
      await fetchUserProfile();
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error; // Re-throw to be handled by FeedbackModal
    }
  };

  const handleSendSwapRequest = async (swapData) => {
    try {
      setSubmitting(true);
      await createSwap({
        toUser: targetUserId,
        offeredSkill: swapData.offeredSkill,
        requestedSkill: swapData.requestedSkill,
        message: swapData.message,
        scheduledDate: swapData.scheduledDate,
        duration: swapData.duration,
        meetingType: swapData.meetingType,
        meetingDetails: swapData.meetingDetails
      });
      toast.success('Swap request sent successfully!');
      setShowSwapModal(false);
    } catch (error) {
      console.error('Error sending swap request:', error);
      toast.error(error.response?.data?.error || 'Failed to send swap request');
    } finally {
      setSubmitting(false);
    }
  };

  const canSendSwapRequest = () => {
    if (!currentUser || !profileUser) return false;
    if (currentUser._id === profileUser._id) return false;
    return currentUser.skillsOffered && currentUser.skillsOffered.length > 0;
  };

  const canLeaveFeedback = () => {
    if (!currentUser || !profileUser) return false;
    if (currentUser._id === profileUser._id) return false;
    
    // Check if user already left feedback
    const existingFeedback = profileUser.feedbacks?.find(
      feedback => feedback.from._id === currentUser._id
    );
    return !existingFeedback;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              User not found
            </h1>
            <p className="text-gray-600 mb-6">
              The user you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                {/* Profile Photo */}
                {profileUser.profilePhoto ? (
                  <img
                    src={profileUser.profilePhoto}
                    alt={profileUser.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-4xl">
                      {profileUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Name and Rating */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profileUser.name}
                </h1>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Rating value={profileUser.rating || 0} readonly size="sm" />
                  <span className="text-sm text-gray-600">
                    ({profileUser.feedbackCount || 0} reviews)
                  </span>
                </div>

                {/* Location */}
                {profileUser.location && (
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileUser.location}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {canSendSwapRequest() && (
                    <Button 
                      onClick={() => setShowSwapModal(true)}
                      disabled={submitting}
                      className="w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Send Swap Request
                    </Button>
                  )}
                  
                  {canLeaveFeedback() && (
                    <Button
                      variant="secondary"
                      onClick={() => setShowFeedbackModal(true)}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Leave Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Availability */}
            {profileUser.availability && profileUser.availability.length > 0 && (
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  {profileUser.availability.map((time, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Skills and Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Offered */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-blue-600 mr-2" />
                  Skills Offered
                </h3>
                {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                  <div className="space-y-2">
                    {profileUser.skillsOffered.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-medium"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed yet</p>
                )}
              </Card>

              {/* Skills Wanted */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-green-600 mr-2" />
                  Skills Wanted
                </h3>
                {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
                  <div className="space-y-2">
                    {profileUser.skillsWanted.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-green-50 text-green-800 px-3 py-2 rounded-lg font-medium"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed yet</p>
                )}
              </Card>
            </div>

            {/* Reviews Section */}
            <ReviewsList
              feedbacks={profileUser.feedbacks || []}
              userRating={profileUser.rating || 0}
              feedbackCount={profileUser.feedbackCount || 0}
            />
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          user={profileUser}
          onSubmit={handleSubmitFeedback}
        />
      </div>
    </div>
  );
};

export default UserProfileView;
