import { Navigate } from "react-router-dom";

// function ProtectedRoute({children}){
//     const user = JSON.parse(localStorage.getItem("user"));
//     if(!user || !user.token){
//         return <Navigate to="/login" />;
//     }
//     return children;
// }

// export default ProtectedRoute; 
// for testing purpose use following
// ProtectedRoute.jsx
function ProtectedRoute({ children }) {
    // Temporarily bypass the auth check during development:
    //return children;
  
    // In production, you would normally do:
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    return user ? children : <Navigate to="/login" />;
  }
  
  export default ProtectedRoute;