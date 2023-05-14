import {
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import axios from "axios";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function SetTimeForBranch() {
  const [inTime, setinTime] = useState(null);
  console.log("🚀 ~ file: SetTimeForBranch.jsx:19 ~ SetTimeForBranch ~ inTime:", inTime)
  const [outTime, setoutTime] = useState(null);
  console.log("🚀 ~ file: SetTimeForBranch.jsx:21 ~ SetTimeForBranch ~ outTime:", outTime)

  useEffect(() => {
    axios.get("branch/getBranches").then((res) => setbranches(res.data));
  }, []);
  const [branch, setbranch] = useState("");
  console.log("🚀 ~ file: SetTimeForBranch.jsx:28 ~ SetTimeForBranch ~ branch:", branch)
  const [branches, setbranches] = useState([]); 
  const handleBranchChange = (event) => {
    setbranch(event.target.value);
  };

const handleSubmit=()=>{
  if(inTime===null||outTime===null||branch==="") return toast.warn("Fill all fields")
  if(inTime?.invalid===null && outTime?.invalid===null)
    axios.post('/branch/setTime',{inTime:inTime.toFormat("HH:mm:ss"),outTime:outTime.toFormat("HH:mm:ss"),branch})
    .then(()=>toast.success("Updated Successfully"))
    .catch((err)=>{
        console.log(err)
        toast.error("something went wrong")
    })
  else return toast.warn("invalid time")
}
  return (
    <Box sx={{flexDirection:'column',display:'flex',alignItems:'flex-start',gap:1}}>
      <ToastContainer/>
      <Typography sx={{fontWeight:'bold'}}>Set Open and Close time of a branch</Typography>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
          <TimeField
          label="Set in time"
            value={inTime}
            onChange={(newValue) => setinTime(newValue)}
          />
          <TimeField
          label="Set out time"
            value={outTime}
            onChange={(newValue) => setoutTime(newValue)}
          />
      </LocalizationProvider>
      <FormControl sx={{minWidth:90}}>
        <InputLabel id="demo-simple-select-autowidth-label">branch</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={branch}
          onChange={handleBranchChange}
          // autoWidth
          
          label="branch"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {branches.map((item) => {
            return <MenuItem value={item.id}>{item.location_name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit}>submit</Button>
      </Box>
    

  );
}
