import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Mail, Calendar, Clock, User, Award } from 'lucide-react';
import { getUserDetails } from '../../api/admin';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function UserProfileModal({ userId, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await getUserDetails(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile Details">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start space-x-6 pb-6 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <Badge 
                    color={user.role === 'admin' ? 'purple' : 'blue'}
                    text={user.role}
                  />
                  <Badge 
                    color={user.isActive ? 'green' : 'red'}
                    text={user.isActive ? 'Active' : 'Banned'}
                  />
                </div>
                <div className="flex items-center text-gray-600 space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && user.location.trim() ? (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>No location provided</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{user.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {user.feedbackCount || 0} review{(user.feedbackCount || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              {user.bio && user.bio.trim() ? (
                <p className="text-gray-700">{user.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Skills Offered */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span>Skills Offered</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered?.length > 0 ? (
                    user.skillsOffered.map((skill, index) => (
                      <Badge key={index} color="green" text={skill} />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills offered</p>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Skills Wanted</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted?.length > 0 ? (
                    user.skillsWanted.map((skill, index) => (
                      <Badge key={index} color="blue" text={skill} />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No skills wanted</p>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {user.availability?.length > 0 ? (
                  user.availability.map((time, index) => (
                    <Badge key={index} color="purple" text={time} />
                  ))
                ) : (
                  <p className="text-gray-500 italic">No availability specified</p>
                )}
              </div>
            </div>

            {/* Recent Feedback */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Feedback</h3>
              {user.feedbacks?.length > 0 ? (
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {user.feedbacks.slice(0, 5).map((feedback, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{feedback.from?.name || 'Anonymous'}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < feedback.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {feedback.comment && (
                        <p className="text-gray-700 text-sm">{feedback.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No feedback received yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">User profile not found</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
