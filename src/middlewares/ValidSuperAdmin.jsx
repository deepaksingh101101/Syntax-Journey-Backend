import React from "react";
import { Navigate } from "react-router-dom";


export const ValidSuperAdmin = ({ children }) => {
  

 let authUserData= JSON.parse(localStorage.getItem('user'))?.user?.isSuperAdmin
  

  if (!authUserData) {
    return <Navigate to="/das" />;
  }

  console.log("User is a super admin, allowing access...");
  // Render child components if the user is a super admin
  return <>
   <div> {children}</div>
   </>
};

