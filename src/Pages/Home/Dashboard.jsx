import { Box } from "@mui/system";
import React from "react";
import AllAttendance from "./AllAttendance";
import Leaverequest from "./Leaverequest";
import Fourcards from "./Fourcards";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
// import EmployeeWorkingHours from "../Employees_Details/EmployeeWorkingHours";
import AllLeaves from "./AllLeaves";

function Dashboard() {
  return (
    <Box sx={{ backgroundColor: "#f4f4f4" }}>
      <Box mt={2} marginX={2}>
        <Fourcards />
      </Box>
      <Grid2 marginX={1} mt={2} container spacing={3}>
        <Grid2 xs={12} md={12}>
          <AllAttendance />
        </Grid2>
        <Grid2 xs={12} md={3}>
          <Leaverequest />
        </Grid2>
        <Grid2 md={9}>
          <AllLeaves />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Dashboard;
