import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';
import Rating from './ui/Rating';
import Badge from './ui/Badge';

const UserCard = ({ user, onSwapRequest, showSwapButton = true }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/user/${user._id}`);
  };

  const handleSwapRequest = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking swap button
    onSwapRequest?.(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
        onClick={handleViewProfile}
      >
        <div className="flex items-start gap-4">
          {/* Profile Photo */}
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.name}
                </h3>
                
                {/* Location */}
                {user.location && (
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <Rating 
                    value={user.rating || 0} 
                    readonly 
                    size="sm" 
                  />
                  <span className="text-sm text-gray-600">
                    ({user.feedbackCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {showSwapButton && (
                <Button
                  size="sm"
                  onClick={handleSwapRequest}
                  className="ml-2"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Swap
                </Button>
              )}
            </div>

            {/* Skills Offered */}
            {user.skillsOffered && user.skillsOffered.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Skills Offered:
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="blue" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <Badge variant="gray" size="sm">
                      +{user.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Skills Wanted */}
            {user.skillsWanted && user.skillsWanted.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Skills Wanted:
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="green" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <Badge variant="gray" size="sm">
                      +{user.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Availability */}
            {user.availability && user.availability.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Available:
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.availability.map((time, index) => (
                    <Badge key={index} variant="orange" size="sm">
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserCard;
