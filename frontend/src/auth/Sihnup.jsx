import React from "react";
import { SignUp } from "@clerk/react";


const Signup = () => {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <SignUp path="/signup" routing="path" signInUrl="/login" />
      </div>
    </>
  );
};

export default Signup;
