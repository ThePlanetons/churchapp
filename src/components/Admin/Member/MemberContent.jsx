import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenSquare } from "lucide-react";
import { MemberList } from "./MemberList";

export function MemberContent() {
  const [members, setMembers] = useState([]); // State for members list
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    phone: "",
    gender: "",
  });

  const [formStatus, setFormStatus] = useState({
    success: null,
    error: null,
  });
  const [showAddMember, setShowAddMember] = useState(false); // State to toggle form visibility
  const [loading, setLoading] = useState(true);

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/member/list/");
      setMembers(response.data); // Update members state with fetched data
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const toggleAddMember = () => {
    setShowAddMember((prev) => !prev); // Toggle state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      // Retrieve the access token from localStorage (or wherever it's stored)
      let accessToken = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post("http://127.0.0.1:8000/api/member/list/", formData, config);
      setFormStatus({
        success: "Member added successfully!",
        error: null,
      });
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        phone: "",
        gender: "",
      }); // Reset form

      // Refresh member list after adding a member
      fetchMembers();
    } catch (err) {
      console.error("Error adding member:", err.response ? err.response.data : err.message);
      setFormStatus({
        success: null,
        error: "Failed to add member. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-hidden bg-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow-md sticky top-0">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium">
            {showAddMember ? "Add Member" : "Member List"}
          </h3>
          <button
            className="flex items-center px-3 sm:px-4 py-2 bg-amber-200 text-amber-900 rounded-lg text-sm sm:text-base"
            onClick={toggleAddMember}
          >
            <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {showAddMember ? "Close" : "Add Member"}
          </button>
        </div>

        <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
          {showAddMember ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">Add New Member</h4>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* First Name and Last Name */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                />

                {/* Date of Birth */}
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                />

                {/* Phone Number */}
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                />

                {/* Gender */}
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  Submit
                </button>
              </form>

              {/* Form Status */}
              {formStatus.success && (
                <p className="text-green-500 mt-4">{formStatus.success}</p>
              )}
              {formStatus.error && (
                <p className="text-red-500 mt-4">{formStatus.error}</p>
              )}
            </div>
          ) : loading ? (
            <p>Loading members...</p>
          ) : (
            <MemberList members={members} />
          )}
        </div>
      </div>
    </div>
  );
}
