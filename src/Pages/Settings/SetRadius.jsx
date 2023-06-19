import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function SetRadius() {
  const [branch, setbranch] = useState("");
  console.log("🚀 ~ file: SetRadius.jsx:19 ~ SetRadius ~ branch:", branch)
  const [branches, setbranches] = useState([]);
  const [radius, setradius] = useState("")
  const handleBranchChange = (event) => {
    setbranch(event.target.value);
  };
  useEffect(() => {
    axios.get("branch/getBranches").then((res) => setbranches(res.data));
  }, []);
const handleSubmit=()=>{
  if(radius==="" || branch==="" || branch==="none") return toast.warn("fill all fields")
  axios.post('branch/setRadius',{radius,branch})
  .then(res=>toast.success("updated succesfully"))
  .catch(err=>toast.error("something went wrong"))
}
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
      }}
    >
      <Typography fontWeight={"bold"}>Set radius of the region</Typography>
      <TextField
        type="number"
        value={radius}
        onChange={(e)=>setradius(e.target.value)}
        error={radius<0?true:false}
        helperText={radius<0?"radius must me greater then 0":null}
        name="radius"
        InputProps={{
          endAdornment: <InputAdornment position="end">meters</InputAdornment>,
        }}
      />
      <FormControl sx={{ minWidth: 90 }}>
        <InputLabel id="demo-simple-select-autowidth-label">branch</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={branch}
          onChange={handleBranchChange}
          autoWidth
          label="branch"
        >
          <MenuItem value="None">
            <em>None</em>
          </MenuItem>
          {branches.map((item) => {
            return <MenuItem value={item.id}>{item.location_name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Button onClick={handleSubmit} variant="contained">Submit</Button>
    </Box>
  );
}
