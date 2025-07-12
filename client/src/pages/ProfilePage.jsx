import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, uploadProfilePhoto } from '../api/user';
import { toast } from 'react-toastify';
import { 
  User, 
  Star, 
  MapPin, 
  Clock, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Camera,
  Mail,
  Calendar
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

const ProfilePage = () => {
  const { user: currentUser, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: []
  });

  // Skills input states
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const availabilityOptions = [
    'weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfileData(data);
      setFormData({
        name: data.name || '',
        location: data.location || '',
        bio: data.bio || '',
        skillsOffered: data.skillsOffered || [],
        skillsWanted: data.skillsWanted || [],
        availability: data.availability || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (type, skill) => {
    if (!skill.trim()) return;
    
    const skillsField = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[skillsField];
    
    if (currentSkills.includes(skill.trim())) {
      toast.warning('Skill already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [skillsField]: [...prev[skillsField], skill.trim()]
    }));

    if (type === 'offered') {
      setNewSkillOffered('');
    } else {
      setNewSkillWanted('');
    }
  };

  const removeSkill = (type, skillToRemove) => {
    const skillsField = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    setFormData(prev => ({
      ...prev,
      [skillsField]: prev[skillsField].filter(skill => skill !== skillToRemove)
    }));
  };

  const toggleAvailability = (option) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedUser = await updateProfile(formData);
      setProfileData(updatedUser);
      updateUserProfile(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData.name || '',
      location: profileData.location || '',
      bio: profileData.bio || '',
      skillsOffered: profileData.skillsOffered || [],
      skillsWanted: profileData.skillsWanted || [],
      availability: profileData.availability || []
    });
    setIsEditing(false);
    setNewSkillOffered('');
    setNewSkillWanted('');
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);
      
      const result = await uploadProfilePhoto(formData);
      const updatedUser = { ...profileData, profilePhoto: result.profilePhoto };
      setProfileData(updatedUser);
      updateUserProfile(updatedUser);
      toast.success('Profile photo updated!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-500">Failed to load profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with Edit Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            variant={isEditing ? "secondary" : "primary"}
            className="flex items-center"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                  {profileData.profilePhoto ? (
                    <img 
                      src={profileData.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <LoadingSpinner size="small" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell others about yourself..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                    {profileData.location && (
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profileData.location}
                      </p>
                    )}
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {profileData.email}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(profileData.createdAt).toLocaleDateString()}
                    </p>
                    {profileData.bio && (
                      <p className="text-gray-700 mt-2">{profileData.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills Offered */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-blue-600 mr-2" />
                Skills I Offer
              </h3>
              
              {isEditing && (
                <div className="mb-4 flex space-x-2">
                  <Input
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you offer"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill('offered', newSkillOffered);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addSkill('offered', newSkillOffered)}
                    size="sm"
                    disabled={!newSkillOffered.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                {formData.skillsOffered.length > 0 ? (
                  formData.skillsOffered.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-blue-50 text-blue-800 px-3 py-2 rounded-lg"
                    >
                      <span className="font-medium">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('offered', skill)}
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed yet</p>
                )}
              </div>
            </Card>

            {/* Skills Wanted */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-green-600 mr-2" />
                Skills I Want to Learn
              </h3>
              
              {isEditing && (
                <div className="mb-4 flex space-x-2">
                  <Input
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill('wanted', newSkillWanted);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addSkill('wanted', newSkillWanted)}
                    size="sm"
                    disabled={!newSkillWanted.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                {formData.skillsWanted.length > 0 ? (
                  formData.skillsWanted.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between bg-green-50 text-green-800 px-3 py-2 rounded-lg"
                    >
                      <span className="font-medium">{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill('wanted', skill)}
                          className="text-green-600 hover:text-green-800 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed yet</p>
                )}
              </div>
            </Card>
          </div>

          {/* Availability */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              Availability
            </h3>
            
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availabilityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option)}
                      onChange={() => toggleAvailability(option)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.availability.length > 0 ? (
                  formData.availability.map((item, index) => (
                    <Badge key={index} variant="purple" className="capitalize">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No availability set</p>
                )}
              </div>
            )}
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="px-6"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
