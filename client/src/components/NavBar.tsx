import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

const NavBar = () => {
  const { user, logout } = useUserStore();

  return (
    <nav className="block w-full max-w-screen-2xl px-4 py-2 mx-auto text-white bg-slate-900 shadow-md  sticky top-0 backdrop-saturate-150   lg:px-8 lg:py-3 mb-5">
      <div className="container flex flex-wrap items-center justify-between mx-auto text-gray-100">
        <Link
          to="/"
          className="mr-4 block cursor-pointer py-1.5 text-base text-gray-200 font-semibold font-poppins"
        >
          My Site
        </Link>
        <div className="hidden lg:block">
          <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200 hover:text-yellow-500">
              <Link to="/" className="flex items-center">
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200 hover:text-yellow-500">
                  <Link to="/profile" className="flex items-center">
                    Profile
                  </Link>
                </li>
                <li className="flex items-center p-1  text-sm gap-x-2 text-gray-200">
                  Welcome {user?.firstname} {user?.lastname}
                  <button
                    className="cursor-pointer transition-all ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 hover:bg-blue-600"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200 hover:text-yellow-500">
                <Link to="/login" className="flex items-center">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
        <button
          className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
          type="button"
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
