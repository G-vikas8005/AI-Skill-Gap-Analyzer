import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  // Get User
  const user = JSON.parse(localStorage.getItem("user"));


  // If user not logged in
  if (!user) {

    return <Navigate to="/login" />;

  }


  // If logged in
  return children;

}

export default ProtectedRoute;