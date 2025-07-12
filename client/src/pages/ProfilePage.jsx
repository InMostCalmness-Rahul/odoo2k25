import React, { useState } from 'react';
import { Edit3, MapPin, Star, Plus, X, Save } from 'lucide-react';

export default function ProfilePage({ user, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    // Persist changes here (API call)
    setIsEditing(false);
  };

  const handleAddSkill = (type, skill, setSkill) => {
    if (skill.trim()) {
      setEditedUser((prev) => ({
        ...prev,
        [type]: [...prev[type], skill.trim()],
      }));
      setSkill('');
    }
  };

  const handleRemoveSkill = (type, index) => {
    setEditedUser((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const SkillSection = ({ title, skills, type, color, newSkill, setNewSkill }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>

      <div className="space-y-3">
        {(skills || []).map((skill, index) => (
          <div
            key={index}
            className={`flex items-center justify-between bg-${color}-50 px-4 py-2 rounded-lg`}
          >
            <span className={`text-${color}-800 font-medium`}>{skill}</span>
            {isEditing && (
              <button
                onClick={() => handleRemoveSkill(type, index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={`Add a skill`}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(type, newSkill, setNewSkill)}
              className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${color}-500 focus:border-transparent`}
            />
            <button
              onClick={() => handleAddSkill(type, newSkill, setNewSkill)}
              className={`bg-${color}-600 text-white px-3 py-2 rounded-lg hover:bg-${color}-700 transition-colors`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const mockReviews = [
    {
      id: '1',
      reviewer: 'Sarah Chen',
      rating: 5,
      comment: 'Excellent web development skills! Alex helped me build a beautiful website.',
      skill: 'Web Development',
      date: '2024-01-15',
    },
    {
      id: '2',
      reviewer: 'Mike Rodriguez',
      rating: 5,
      comment: 'Great UI/UX design expertise. Very professional and creative.',
      skill: 'UI/UX Design',
      date: '2024-01-10',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={editedUser.profilePhoto}
              alt={editedUser.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              {isEditing ? (
                <input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{editedUser.name}</h1>
              )}

              <div className="flex items-center space-x-1 text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    value={editedUser.location}
                    onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <span>{editedUser.location}</span>
                )}
              </div>

              <div className="flex items-center space-x-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-700">{editedUser.rating}</span>
                <span className="text-gray-500">({mockReviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            {isEditing ? <><Save className="w-4 h-4" /><span>Save</span></> : <><Edit3 className="w-4 h-4" /><span>Edit Profile</span></>}
          </button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkillSection
          title="Skills I Offer"
          skills={editedUser.skillsOffered}
          type="skillsOffered"
          color="blue"
          newSkill={newSkillOffered}
          setNewSkill={setNewSkillOffered}
        />
        <SkillSection
          title="Skills I Want to Learn"
          skills={editedUser.skillsWanted}
          type="skillsWanted"
          color="emerald"
          newSkill={newSkillWanted}
          setNewSkill={setNewSkillWanted}
        />
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews & Feedback</h2>
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-none">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.reviewer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.reviewer}</h4>
                    <p className="text-sm text-gray-500">{review.skill}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-2">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
