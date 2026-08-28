import { SignIn } from "@clerk/react";
import React from "react";

const Signin = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn path="/login" routing="path"  signUpUrl="/signup" />
    </div>
  );
};

export default Signin;
