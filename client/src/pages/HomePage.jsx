import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HomePage({ currentUser, onNavigate, onSwapRequest }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 3;

  const mockUsers = [
    {
      id: "1",
      name: "Marc Demo",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["JavaScript", "Python"],
      skillsWanted: ["Photoshop", "Graphic designer"],
      rating: 3.9,
    },
    {
      id: "2",
      name: "Michell",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["JavaScript", "Python"],
      skillsWanted: ["Photoshop", "Graphic designer"],
      rating: 2.5,
    },
    {
      id: "3",
      name: "Joe Wills",
      profilePhoto: "https://via.placeholder.com/80",
      skillsOffered: ["JavaScript", "Python"],
      skillsWanted: ["Photoshop", "Graphic designer"],
      rating: 4.0,
    },
  ];

  const filteredUsers = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleSwapRequest = (user) => {
    if (!currentUser) {
      onNavigate("login");
      return;
    }
    onSwapRequest(user);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Skill Swap Platform</h1>
        <button className="px-4 py-1 border rounded">Login</button>
      </div> */}

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
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
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
      </div>

      {/* User cards */}
      <div className="space-y-4">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-green-600 text-sm">
                  Skills Offered =&gt;{" "}
                  {user.skillsOffered.map((s) => (
                    <span
                      key={s}
                      className="inline-block border px-2 py-0.5 rounded text-xs mx-1"
                    >
                      {s}
                    </span>
                  ))}
                </p>
                <p className="text-blue-600 text-sm">
                  Skills Wanted =&gt;{" "}
                  {user.skillsWanted.map((s) => (
                    <span
                      key={s}
                      className="inline-block border px-2 py-0.5 rounded text-xs mx-1"
                    >
                      {s}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleSwapRequest(user)}
                className="bg-teal-600 text-white px-4 py-1 rounded-full hover:bg-teal-700"
              >
                Request
              </button>
              <p className="text-sm text-gray-600">{user.rating}/5</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 border rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
