import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function Dashboard() {
  const [data, setData] = useState([]);  // State to store API data
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);  // State to manage error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/member/list/');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Member ID</TableCell>
            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Email Address</TableCell>
            <TableCell align="right">Date of Birth</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Gender</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.first_name}</TableCell>
              <TableCell align="right">{row.last_name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.date_of_birth}</TableCell>
              <TableCell align="right">{row.phone}</TableCell>
              <TableCell align="right">{row.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Dashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data when the component mounts
//   useEffect(() => {
//     // Make the API call using axios
//     axios.get('https://jsonplaceholder.typicode.com/users')
//       .then(response => {
//         setUsers(response.data);  // Save data to the state
//         setLoading(false);         // Set loading to false
//       })
//       .catch(error => {
//         setError('An error occurred while fetching data');
//         setLoading(false);
//       });
//   }, []);  // Empty dependency array means it runs only once when the component mounts

//   // Display a loading message or the users data
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Handle any errors
//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h1>User List</h1>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;