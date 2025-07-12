import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, Users } from "lucide-react";
import { usePagination, useDebounce } from '../hooks/useForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Input';
import { EmptyState } from '../components/ui/Alert';
import { CardSkeleton } from '../components/ui/LoadingSpinner';

export function HomePage({ currentUser, onNavigate, onSwapRequest }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const usersPerPage = 6;

  const mockUsers = [
    {
      id: "1",
      name: "Marc Demo",
      profilePhoto: "https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["JavaScript", "Python", "React"],
      skillsWanted: ["Photoshop", "Graphic Design", "UI/UX"],
      rating: 4.2,
      location: "San Francisco, CA",
      availability: "Weekends",
      isOnline: true,
    },
    {
      id: "2",
      name: "Michelle Rodriguez",
      profilePhoto: "https://images.pexels.com/photos/3783830/pexels-photo-3783830.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["Digital Marketing", "Content Writing"],
      skillsWanted: ["Web Development", "Database Design"],
      rating: 4.7,
      location: "New York, NY",
      availability: "Evenings",
      isOnline: false,
    },
    {
      id: "3",
      name: "Joe Williams",
      profilePhoto: "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["Photography", "Video Editing"],
      skillsWanted: ["React", "Node.js"],
      rating: 4.9,
      location: "Austin, TX",
      availability: "Flexible",
      isOnline: true,
    },
    {
      id: "4",
      name: "Sarah Chen",
      profilePhoto: "https://images.pexels.com/photos/3783830/pexels-photo-3783830.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["Data Science", "Machine Learning"],
      skillsWanted: ["Frontend Development", "Design"],
      rating: 4.5,
      location: "Seattle, WA",
      availability: "Weekdays",
      isOnline: true,
    },
    {
      id: "5",
      name: "David Kim",
      profilePhoto: "https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["Mobile Development", "Flutter"],
      skillsWanted: ["DevOps", "Cloud Computing"],
      rating: 4.3,
      location: "Los Angeles, CA",
      availability: "Weekends",
      isOnline: false,
    },
    {
      id: "6",
      name: "Emily Foster",
      profilePhoto: "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg?auto=compress&cs=tinysrgb&w=150",
      skillsOffered: ["Graphic Design", "UI/UX Design"],
      skillsWanted: ["Marketing", "Business Strategy"],
      rating: 4.8,
      location: "Miami, FL",
      availability: "Flexible",
      isOnline: true,
    },
  ];

  // Get all unique skills for filter dropdown
  const allSkills = useMemo(() => {
    const skills = new Set();
    mockUsers.forEach(user => {
      user.skillsOffered.forEach(skill => skills.add(skill));
      user.skillsWanted.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, []);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           user.skillsOffered.some(skill => skill.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
                           user.skillsWanted.some(skill => skill.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      const matchesAvailability = !availability || user.availability === availability;
      const matchesSkill = !skillFilter || 
                          user.skillsOffered.includes(skillFilter) || 
                          user.skillsWanted.includes(skillFilter);
      
      return matchesSearch && matchesAvailability && matchesSkill;
    });
  }, [debouncedSearch, availability, skillFilter]);

  const pagination = usePagination(filteredUsers, usersPerPage);

  const handleSwapRequest = (user) => {
    console.log('handleSwapRequest called with user:', user);
    console.log('currentUser:', currentUser);
    console.log('onSwapRequest function:', onSwapRequest);
    
    if (!currentUser) {
      onNavigate("login");
      return;
    }
    onSwapRequest(user);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAvailability("");
    setSkillFilter("");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Skill Exchange Partners
        </h1>
        <p className="text-gray-600">
          Find people to learn from and share your expertise with
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search people or skills..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">All Availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
            <option value="Flexible">Flexible</option>
          </Select>

          <Select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </Select>

          <Button
            variant="outline"
            onClick={clearFilters}
            icon={Filter}
            className="md:col-span-1"
          >
            Clear Filters
          </Button>
        </div>
        
        {(searchTerm || availability || skillFilter) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredUsers.length} results</span>
            {searchTerm && <Badge variant="outline">Search: {searchTerm}</Badge>}
            {availability && <Badge variant="outline">Availability: {availability}</Badge>}
            {skillFilter && <Badge variant="outline">Skill: {skillFilter}</Badge>}
          </div>
        )}
      </Card>

      {/* User cards */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try adjusting your search filters to find more skill exchange partners."
          action={
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pagination.currentData.map((user) => (
              <Card
                key={user.id}
                className="p-6 hover:shadow-lg transition-shadow"
                hover={true}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-medium text-gray-700">
                          {user.rating}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{user.location}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1">
                          Skills Offered
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {user.skillsOffered.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="success" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {user.skillsOffered.length > 2 && (
                            <Badge variant="outline" size="sm">
                              +{user.skillsOffered.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-blue-600 mb-1">
                          Skills Wanted
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {user.skillsWanted.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="primary" size="sm">
                              {skill}
                            </Badge>
                          ))}
                          {user.skillsWanted.length > 2 && (
                            <Badge variant="outline" size="sm">
                              +{user.skillsWanted.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" size="sm">
                        {user.availability}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleSwapRequest(user)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                      >
                        Request Swap
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={pagination.prevPage}
                icon={ChevronLeft}
              />
              
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={pagination.currentPage === i + 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => pagination.goToPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={pagination.nextPage}
                icon={ChevronRight}
                iconPosition="right"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
