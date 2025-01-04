import React from "react";
import loginImage from "../images/bbc-login-image.png";
import logo from "../images/BBC-logo.png";
import { signInWithPopup } from "firebase/auth";
import { auth, GoogleProvider } from "../Firebase/Setup";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();

  const googleSignin = async () => {
    try {
      await signInWithPopup(auth, GoogleProvider);
      auth.currentUser && navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  console.log(auth);

  return (
    <div className="flex bg-black h-screen">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-1/2 space-y-6 scale-x-120">
        <img src={logo} alt="BBC Logo" className="h-14" />
        <h1 className="text-white text-3xl font-semibold">Sign in</h1>
        <button
          onClick={googleSignin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-64 h-14"
        >
          Sign in
        </button>
        <h3 className="text-blue-500 underline cursor-pointer">Sign in now</h3>
      </div>

      {/* Right Section */}
      <div className="w-1/2">
        <img src={loginImage} alt="Sign in visual" className="h-screen" />
      </div>
    </div>
  );
}

export default Signin;
