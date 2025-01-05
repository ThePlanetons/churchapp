const mockMembers = [
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
  { name: 'XYZ name', email: 'xyz@gmail.com', avatar: 'X' },
];

export function useMemberData() {
  return {
    members: mockMembers
  };
}