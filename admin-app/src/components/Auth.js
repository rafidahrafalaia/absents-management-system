import React, { } from "react";
  
import {
    Navigate ,
    useLocation
  } from "react-router-dom";
export const setToken = (token) =>{
    // set token in localStorage
    console.log(token,'skdjkasdjal')
    localStorage.setItem('tokenAdmin', token)
}
export const fetchToken = () =>{
    // fetch the token
    return localStorage.getItem('tokenAdmin')
}
export function RequireToken({children}) {
      
    let auth = fetchToken()
    let location = useLocation();
    
    if (!auth) {
        
      return <Navigate to="/login" state={{ from: location }} />;
    }
    
    return children;
}