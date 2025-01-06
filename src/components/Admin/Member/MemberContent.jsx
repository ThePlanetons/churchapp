import React, { useState } from 'react';
import { PenSquare } from 'lucide-react';
import { MemberList } from './MemberList';
import { useMemberData } from '../hooks/useMemberData';

export function MemberContent() {
  const { members } = useMemberData();
  const [showAddMember, setShowAddMember] = useState(false); // State to toggle form visibility

  const toggleAddMember = () => {
    setShowAddMember((prev) => !prev); // Toggle state
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          {/* Dynamic Heading */}
          <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-0">
            {showAddMember ? 'Add Member' : 'Member List'}
          </h3>
          {/* Dynamic Button */}
          <button
            className="flex items-center px-3 sm:px-4 py-2 bg-amber-100 text-amber-900 rounded-lg text-sm sm:text-base"
            onClick={toggleAddMember}
          >
            <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {showAddMember ? 'Close' : 'Add Member'}
          </button>
        </div>

        {/* Conditional Rendering */}
        {showAddMember ? (
          // Add Member Form
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h4 className="text-lg font-semibold mb-4">Add New Member</h4>
            <form className="space-y-4">
              {/* Name and Surname */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Date of Birth */}
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              {/* Email and Phone */}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email ID"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Gender and Attend Church */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Attend Church</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Referral ID */}
              <input
                type="text"
                placeholder="Referral ID"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              {/* Message */}
              <textarea
                placeholder="Enter Your Message"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          // Member List
          <MemberList members={members} />
        )}
      </div>
    </div>
  );
}
