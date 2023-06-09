import React, { createContext,useState } from "react";
export const ContextForUser = createContext({});

export default function UserContext({ children }) {
  const [userData, setuserData] = useState({
    name:"",
    id:"",
    signedIn:false,
    accessToken:"",
    profilePicture:""
  });
  return (
    <ContextForUser.Provider value={{ userData, setuserData }}>
      {children}
    </ContextForUser.Provider>
  );
}
