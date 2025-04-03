import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header({isLoggedIn, setIsLoggedIn}:{isLoggedIn: boolean, setIsLoggedIn: (value: boolean) => void}) {
  const navigate = useNavigate();
  
 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/"); 
  };
  console.log('rendering header');
  return (
    <header className="sticky top-0 left-0 w-full bg-black bg-opacity-80 backdrop-blur-md shadow-md p-4 flex justify-between items-center z-50 text-white">
      <Link to="/">
        <h1 className="text-xl font-semibold whitespace-nowrap mr-10">NextGen Blog</h1>
      </Link>

      <div className="hidden md:flex items-center gap-20 w-full">
        <div className="relative flex items-center w-96">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <SearchIcon className="absolute right-3 text-white" />
        </div>
      </div>

      <div className="w-full flex justify-end items-center gap-4 mx-4">
        {isLoggedIn ? (
          <>
           
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-white hover:text-red-500 cursor-pointer"
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/signin" className="hidden md:block text-white hover:text-blue-500">
            Sign In
          </Link>
        )}

        <button
          onClick={() => navigate(isLoggedIn ? "/blog/create" : "/signin")}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 cursor-pointer transition duration-300 ease-in-out"
        >
          {isLoggedIn ? "Write" : "Get Started"}
        </button>
      </div>
    </header>
  );
}