
import { Navigate } from "react-router-dom";


/**
 * The ProtectedRoute component ensures that the user has the appropriate role to access a specific page.
 * If the user doesn't have a valid role or their role is "supplier", they are redirected back to the home page.
 */
const ProtectedRoute = ({ children }) => {
  let user = localStorage.getItem('currentUser');


  if (!user || JSON.parse(user).role === "supplier") {
    return <Navigate to='/' />
  }
  return children;

}

export default ProtectedRoute;