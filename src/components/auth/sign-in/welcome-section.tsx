export function WelcomeSection() {
  const users = [
    { id: 1, avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 4, avatar: "https://i.pravatar.cc/40?img=4" },
  ]

  return (
    <div className="hidden md:flex justify-center items-center w-1/2 bg-gray-50 p-8 rounded-lg">
      <div className="max-w-md mx-10px">
        <h1 className="text-4xl font-bold mb-6 ">Welcome to our community</h1>
        <p className="text-gray-600 mb-8">XYZ</p>

        <div className="flex -space-x-2 ">
          {users.map(user => (
            <img
              key={user.id}
              src={user.avatar}
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ))}
          <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-sm">
            ZYX
          </span>
        </div>
      </div>
    </div>
  )
}