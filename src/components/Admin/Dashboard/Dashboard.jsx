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
import { styled } from "@mui/system";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  "& th": {
    color: "white",
    fontWeight: "semibold",
  },
}));

function Dashboard() {
  // const classes = useStyles();
  const [data, setData] = useState([]);  // State to store API data
  const [loading, setLoading] = useState(true);  // State to manage loading state
  const [error, setError] = useState(null);  // State to manage error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('http://127.0.0.1:8000/api/member/list/');
        // setData(response.data);

        const jsonData = [
          {
            id: 1,
            first_name: "John",
            last_name: "Smith",
            email: "johnsmith@gmail.com",
            date_of_birth: "1990-05-15",
            phone: "555-123-4567",
            gender: "Male",
          },
          {
            id: 2,
            first_name: "Emily",
            last_name: "Johnson",
            email: "emilyjohnson@gmail.com",
            date_of_birth: "1985-11-22",
            phone: "555-987-6543",
            gender: "Female",
          },
          {
            id: 3,
            first_name: "Michael",
            last_name: "Williams",
            email: "michaelwilliams@gmail.com",
            date_of_birth: "1992-03-10",
            phone: "555-555-1212",
            gender: "Male",
          },
          {
            id: 4,
            first_name: "Jessica",
            last_name: "Brown",
            email: "jessicabrown@gmail.com",
            date_of_birth: "1988-07-04",
            phone: "555-321-7890",
            gender: "Female",
          },
          {
            id: 5,
            first_name: "David",
            last_name: "Jones",
            email: "davidjones@gmail.com",
            date_of_birth: "1995-09-18",
            phone: "555-789-4561",
            gender: "Male",
          },
        ];

        // Set data using JSON
        setData(jsonData);
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
      <Table>
        <StyledTableHead>
          <TableRow>
            <TableCell>Member ID</TableCell>
            <TableCell align="left">First Name</TableCell>
            <TableCell align="left">Last Name</TableCell>
            <TableCell align="left">Email Address</TableCell>
            <TableCell align="left">Date of Birth</TableCell>
            <TableCell align="left">Phone</TableCell>
            <TableCell align="left">Gender</TableCell>
          </TableRow>
        </StyledTableHead>

        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="left">{row.first_name}</TableCell>
              <TableCell align="left">{row.last_name}</TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.date_of_birth}</TableCell>
              <TableCell align="left">{row.phone}</TableCell>
              <TableCell align="left">{row.gender}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Dashboard;

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