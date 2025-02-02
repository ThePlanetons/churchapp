import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const memberdata = [
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
    first_name: "Jane",
    last_name: "Doe",
    email: "janedoe@gmail.com",
    date_of_birth: "1992-08-25",
    phone: "555-234-5678",
    gender: "Female",
  },
  {
    id: 3,
    first_name: "Alice",
    last_name: "Johnson",
    email: "alicejohnson@gmail.com",
    date_of_birth: "1988-03-12",
    phone: "555-345-6789",
    gender: "Female",
  },
  {
    id: 4,
    first_name: "Bob",
    last_name: "Brown",
    email: "bobbrown@gmail.com",
    date_of_birth: "1985-11-09",
    phone: "555-456-7890",
    gender: "Male",
  },
  {
    id: 5,
    first_name: "Charlie",
    last_name: "Davis",
    email: "charliedavis@gmail.com",
    date_of_birth: "1993-07-21",
    phone: "555-567-8901",
    gender: "Male",
  },
];

const AdminDashboard = () => {
  return (
    <Table>
      <TableCaption>A list of your members.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date of Birth</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Gender</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberdata.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.id}</TableCell>
            <TableCell>{member.first_name}</TableCell>
            <TableCell>{member.last_name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.date_of_birth}</TableCell>
            <TableCell>{member.phone}</TableCell>
            <TableCell>{member.gender}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminDashboard;
