import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, Filter, Users } from "lucide-react";
import { usePagination, useDebounce } from '../hooks/useForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Input';
import { EmptyState } from '../components/ui/Alert';
import { CardSkeleton } from '../components/ui/LoadingSpinner';

export default function HomePage({ currentUser, onNavigate, onSwapRequest }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const usersPerPage = 6;

  // TODO: Replace with real API call
  const mockUsers = [
    {
      id: "1",
      name: "Marc Demo",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["JavaScript", "Python"],
      skillsWanted: ["Photoshop", "Graphic Designer"],
      rating: 3.9,
    },
    {
      id: "2",
      name: "Michell",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["Java", "C++"],
      skillsWanted: ["UI/UX Design", "Motion Graphics"],
      rating: 2.5,
    },
    {
      id: "3",
      name: "Joe Wills",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["HTML", "CSS"],
      skillsWanted: ["Animation", "Video Editing"],
      rating: 4.0,
    },
  ];

  // Filter and paginate
  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleSwapRequest = (user) => {
    if (!currentUser) return onNavigate("login");
    onSwapRequest(user);
  };

  const SkillTags = ({ skills, color = "gray" }) => (
    <span className="flex flex-wrap gap-1">
      {skills.map((s, idx) => (
        <span
          key={idx}
          className={`inline-block border px-2 py-0.5 rounded text-xs text-${color}-700 border-${color}-300 bg-${color}-50`}
        >
          {s}
        </span>
      ))}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
      </div>

      {/* User Cards */}
      <div className="space-y-4">
        {paginatedUsers.length === 0 ? (
          <p className="text-gray-500 text-center">No users found</p>
        ) : (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-green-700 text-sm">
                    Skills Offered: <SkillTags skills={user.skillsOffered} color="green" />
                  </p>
                  <p className="text-blue-700 text-sm">
                    Skills Wanted: <SkillTags skills={user.skillsWanted} color="blue" />
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleSwapRequest(user)}
                  className="bg-teal-600 text-white px-4 py-1 rounded-full hover:bg-teal-700 transition-colors"
                >
                  Request
                </button>
                <p className="text-sm text-gray-600">{user.rating}/5</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 border rounded disabled:opacity-50"
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 border rounded disabled:opacity-50"
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
