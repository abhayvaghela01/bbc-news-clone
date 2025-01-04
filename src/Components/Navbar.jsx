import React from "react";
import logo from "../images/BBC-logo.png";
import user from "../images/user-logo.png";
import search from "../images/search.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Setup";
import { signOut } from "firebase/auth";

function Navbar(props) {
  const navigate = useNavigate();

  const logout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Logout Error: ", error);
      }
    }
  };

  const menuItems = [
    "Home",
    "News",
    "Sports",
    "Movies",
    "Worklife",
    "Reel",
    "Travel",
    "Future",
    "Culture"
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_3fr_1.5fr] md:grid-cols-3 items-center bg-black px-4 py-2 fixed w-full gap-4 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-4 w-50 sm:justify-normal xs:justify-between">
        <img src={logo} alt="BBC Logo" className="h-11" />
        {auth.currentUser
          ? <button
              onClick={logout}
              className="text-white flex items-center gap-2 border border-transparent hover:border-white py-1 px-3 rounded"
            >
              Logout
            </button>
          : <Link to="/signin">
              <button className="text-white flex items-center gap-2 border border-transparent hover:border-white py-1 px-3 rounded ">
                <img
                  src={user}
                  alt="User Avatar"
                  className="h-7 rounded-full"
                />
                Sign in
              </button>
            </Link>}
      </div>

      {/* Middle Section */}
      <div className="flex justify-center items-center gap-6 text-white text-sm flex-wrap md:gap-4">
        {menuItems.map(item =>
          <button
            key={item}
            onClick={() => props.setMenu(item)}
            className="hover:underline active:underline focus:underline"
          >
            {item}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className=" sm:flex xs:hidden items-center p-1 bg-white rounded-full max-w-sm  mx-auto   ">
        <img
          src={search}
          alt="Search Icon"
          className="h-5 mr-2 bg-white ml-1 mt-0.5"
        />
        <input
          onChange={e => props.setSearch(e.target.value)}
          type="text"
          className="flex-1 bg-white border-none outline-none ml-1 text-sm px-2"
          placeholder="Search BBC"
        />
      </div>
    </div>
  );
}

export default Navbar;
