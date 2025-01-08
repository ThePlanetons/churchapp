import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MemberCard } from './MemberCard';

export function MemberList() {
  const [members, setMembers] = useState([]); // State to store API data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/member/list/');
        setMembers(response.data); // Assuming API response is an array of members
      } catch (err) {
        setError(err.message || 'Failed to fetch member data');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="">
      
      {members.map((member, index) => (
        <MemberCard key={index} member={member} />
      ))}
    </div>
  );
}
