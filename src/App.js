import "./App.css";
import LogIn from "./Pages/Login/LogIn";
import MiniDrawer from "./Components/MiniDrawer";
import { useContext } from "react";
import { ContextForUser } from "./Contexts/UserContext";
import { useState,useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
function App() {
  const { userData, setuserData } = useContext(ContextForUser);
  const [loading, setloading] = useState(true)
  axios.defaults.baseURL = "http://localhost:3001/";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== null)
      setuserData((prev) => {
        return {
          ...prev,
          accessToken: token,
          signedIn: true,
        };
      });
      setloading(false);
  }, []);

  {if(loading) return <Box></Box>}
  

  return (
    <div className="App">{userData.signedIn ? <MiniDrawer/> : <LogIn />}</div>
  );
}

export default App;
