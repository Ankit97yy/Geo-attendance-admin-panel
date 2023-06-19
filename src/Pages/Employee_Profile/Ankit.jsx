import React, { useState, useEffect } from "react";
import { Avatar, Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import EmpAttendance from "./EmpAttendance";
import WorkingHours from "./WorkingHours";
import LeaveDeatailsOfAnEmployee from "./Leave_Details/LeaveDeatailsOfAnEmployee";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Ankit() {
  const { EmpId } = useParams();
  const [employeeInfo, setemployeeInfo] = useState(null);
  console.log("🚀 ~ file: Ankit.jsx:14 ~ Ankit ~ employeeInfo:", employeeInfo)
  useEffect(() => {
    axios
      .get(`employee/getEmployee/${EmpId}`)
      .then((res) => {
        setemployeeInfo(res.data)
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{backgroundColor:"#f4f4f4"}}>
      <Paper
        sx={{
          width: "370px",
          padding: 1,
          // marginTop: 2,
          top:5,
          position: "relative",
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          backgroundColor:'white'
        }}
      >
        <Avatar
          sx={{ width: "100px", height: "100px" }}
          src={employeeInfo?`http://localhost:3001/${employeeInfo[0].profile_picture}`:null}
        />
        <Box>
          <Typography variant="h5" >{employeeInfo?employeeInfo[0].full_name:""}</Typography>
          <Typography variant="subtitle1" >
            {employeeInfo?employeeInfo[0].location_name:""} Branch
          </Typography>
        </Box>
      </Paper>  
      <Box m={2}>
        <Grid2 columnSpacing={3} rowSpacing={3} container>
          <Grid2 md={6}>
            <WorkingHours emp_id={EmpId} />
          </Grid2>
          <Grid2 md={6}>
            <LeaveDeatailsOfAnEmployee emp_id={EmpId} />
          </Grid2>
          <Grid2 md={12}>
              <EmpAttendance emp_id={EmpId} />
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
