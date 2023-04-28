import { Avatar, Icon, Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Groups2Icon from "@mui/icons-material/Groups2";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { DateTime } from "luxon";
export default function Fourcards() {
  const gradientColor = "linear-gradient(60deg, #eb4886 30%, #bc539d 100%)";
  const gradientColor2 = "linear-gradient(60deg, #875ec0 30%, #614db7 100%)";
  const gradientColor3 = "linear-gradient(60deg, #46c5f0 30%, #6299dd 100%)";
  const gradientColor4 = "linear-gradient(60deg, #feb82c 30%, #f5805a 100%)";

  const paperstyle = {
    height: "165px",
    justifyContent: "space-around",
    display: "flex",
    alignItems: "center",
    borderRadius: 5,
    color: "white",
    flexDirection: { xs: "column", sm: "row" },
  };
  const [data, setdata] = useState({total:0,present:0,absent:0,leave:0})
  console.log("🚀 ~ file: Fourcards.jsx:29 ~ Fourcards ~ data:", data)

  const fetchData = async () => {
    try {
      const empDetailsPromise = axios.get("employee/getEmployees");
      const attendancePromise = axios.get("attendance/getAllAttendanceOfToday");
      const leavesPromise = axios.get("leave/getPendingLeaves");
      const [empDetails,attendanceDetails, leaves] = await Promise.all([
        empDetailsPromise,
        attendancePromise,
        leavesPromise,
      ]);
      setdata({
        total:empDetails.data.length,
        present:attendanceDetails.data.filter((emp) => emp.status === "present").length,
        absent:attendanceDetails.data.filter((emp) => emp.status === "absent").length,
        leave:leaves.data.filter((leave) => leave.status === "approved").length,
      })
    
     
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={6} sm={6} md={3}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          <Paper
            // onClick={() => Navigate("/allemployees")}
            elevation={3}
            sx={{
              backgroundImage: gradientColor,
              ...paperstyle,
            }}
          >
            <Box>
              <Avatar sx={{ bgcolor: "black", width: 53, height: 53 }}>
                <Groups2Icon fontSize="large" />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h4">{data.total}</Typography>
              <Typography variant="h6">Total employees</Typography>
            </Box>
          </Paper>
        </motion.div>
      </Grid2>

      <Grid2 xs={6} sm={6} md={3}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          <Paper
            elevation={3}
            sx={{
              backgroundImage: gradientColor2,
              ...paperstyle,
            }}
          >
            <Box>
              <Avatar sx={{ bgcolor: "black", width: 53, height: 53 }}>
                <EmojiPeopleIcon fontSize="large" />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h4">{data.present}</Typography>
              <Typography variant="h6">Present</Typography>
            </Box>
          </Paper>
        </motion.div>
      </Grid2>
      <Grid2 xs={6} sm={6} md={3}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          <Paper
            elevation={3}
            sx={{
              backgroundImage: gradientColor3,
              ...paperstyle,
            }}
          >
            <Box>
              <Avatar sx={{ bgcolor: "black", width: 53, height: 53 }}>
                <PersonOffIcon fontSize="large" />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h4">{data.absent}</Typography>
              <Typography variant="h6">Absent</Typography>
            </Box>
          </Paper>
        </motion.div>
      </Grid2>
      <Grid2 xs={6} sm={6} md={3}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
          <Paper
            elevation={3}
            sx={{
              backgroundImage: gradientColor4,
              ...paperstyle,
            }}
          >
            <Box>
              <Avatar sx={{ bgcolor: "black", width: 53, height: 53 }}>
                <EventBusyIcon fontSize="large" />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="h4">{data.leave}</Typography>
              <Typography variant="h6">On leave</Typography>
            </Box>
          </Paper>
        </motion.div>
      </Grid2>
    </Grid2>
  );
}
