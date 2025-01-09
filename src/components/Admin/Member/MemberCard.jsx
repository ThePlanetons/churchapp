import React, { useState } from 'react';

export function MemberCard({ member }) {
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedMember, setUpdatedMember] = useState({ ...member }); 

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedMember({ ...updatedMember, [name]: value });
  };

  const handleEditSave = () => {
    // Handle form submission or data update logic here (consider using a callback or state management)
    console.log('Updated member data:', updatedMember); 

    // Optionally, close edit mode and hover menu after saving
    setEditMode(false);
    setIsHovered(false);
  };

  const handleEditCancel = () => {
    setEditMode(false); 
    setUpdatedMember({ ...member }); // Reset to original data
  };

  return (
    <div
      className={`flex items-center px-6 py-4 border-b last:border-b-0 cursor-pointer relative ${isHovered ? 'hover:bg-gray-300' : ''}`}
      onClick={() => setIsHovered(!isHovered)}
    >
      {/* Dynamic avatar */}
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
        {member.name?.charAt(0) || 'A'}
      </div>
      <div className="flex-1">
        {editMode ? (
          // Edit mode form
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="first_name"
              defaultValue={updatedMember.first_name}
              className="border rounded px-2 py-1 mr-2"
              placeholder="First Name"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="last_name"
              defaultValue={updatedMember.last_name}
              className="border rounded px-2 py-1 mr-2"
              placeholder="Last Name"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              defaultValue={updatedMember.email}
              className="border rounded px-2 py-1 mr-2"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date_of_birth"
              defaultValue={updatedMember.date_of_birth}
              className="border rounded px-2 py-1 mr-2"
              placeholder="Date of Birth"
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              defaultValue={updatedMember.phone}
              className="border rounded px-2 py-1 mr-2"
              placeholder="Phone"
              onChange={handleInputChange}
            />
            <select
              name="gender"
              defaultValue={updatedMember.gender}
              className="border rounded px-2 py-1 mr-2"
              onChange={handleInputChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="button" className="px-4 py-1 mx-1 bg-amber-200 rounded hover:bg-amber-300" onClick={handleEditSave}>
              Save
            </button>
            <button type="button" className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={handleEditCancel}>
              Cancel
            </button>
          </form>
        ) : (
          // Display member details
          <>
            <h4 className="text-sm font-medium">{member.first_name}</h4>
            <p className="text-sm text-gray-500">{member.email}</p>
          </>
        )}
      </div>
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="px-5 py-3 my-2 bg-amber-200 text-bg-amber-900 rounded hover:bg-amber-300" onClick={handleEditClick}>
            Edit
          </button>
          <button className="px-3 py-3 my-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}