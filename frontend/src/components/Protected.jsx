import { useUser } from "@clerk/react";
import { Navigate } from "react-router";
import Loader from "./Loader";


const Protected = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <Loader/>;

  if (!isSignedIn) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default Protected;