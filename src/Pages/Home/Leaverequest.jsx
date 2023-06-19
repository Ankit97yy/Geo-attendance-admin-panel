import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import IconButton from "@mui/material/IconButton";
import { Paper, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { ContextForUser } from "../../Contexts/UserContext";
import moment from "moment";
import { socket } from "../../App";
import { DateTime } from "luxon";
export default function Leaverequest() {
  const [leaves, setleaves] = useState([]);
  const [refresh, setrefresh] = useState(false)
  const { userData } = useContext(ContextForUser);
  useEffect(() => {
    axios
      .get("leave/getPendingLeaves")
      .then((res) => setleaves(res.data))
      .catch((err) => console.log(err));
  }, [refresh]);


  const handleRejection = (id) => {
    axios
      .put(`leave/rejectLeave/${id}`)
      .then((res) => {
        let temp = leaves.filter((item) => item.id !== id);
        setleaves(temp);
      })
      .catch((err) => console.log(err));
  };


  const handleApproval = (id) => {
    axios
      .put(`leave/approveLeave/${id}`)
      .then((res) => {
        let temp = leaves.filter((item) => item.id !== id);
        setleaves(temp);
      })
      .catch((err) => console.log(err));
  };
  socket.on("REFRESH_LEAVE",()=>{
    console.log("client fired")
    setrefresh(!refresh)
  })


  return (
    <Box>
      <Paper
        elevation={3}
        sx={{ height: "72vh", borderRadius: 5, padding: 2 }}
      >
        <Typography
          sx={{ display: "flex", marginLeft: 2 }}
          variant="h5"
        >
          Leave requests
        </Typography>
        {leaves.length === 0 && <Typography sx={{justifySelf:'center',alignSelf:'center'}}>No pending leaves</Typography>}
        <List sx={{ height: "55vh", overflowY: "auto" }} dense={false}>
          {leaves.map((item) => {
            return (
              <ListItem key={item.id.toString()} divider>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    display={"flex"}
                    flexDirection="row"
                    sx={{ alignItems: "center" }}
                  >
                    <ListItemAvatar sx={{ alignSelf: "center" }}>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primaryTypographyProps={{ variant: "h6" }}
                      primary={item.full_name}
                      secondary={`${item.leave_type} leave from ${DateTime.fromISO(item.start).setZone('Asia/Kolkata').toLocaleString({day:'2-digit',month:'short',year:'numeric'})} to ${DateTime.fromISO(item.end).setZone('Asia/Kolkata').toLocaleString({day:'2-digit',month:'short',year:'numeric'})}`}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      // flexDirection: "column",
                      // backgroundColor:'red',
                      justifyContent: "space-between",
                      // marginLeft: 5,
                    }}
                  >
                    <IconButton
                      sx={{ marginRight: 0 }}
                      // edge="end"
                      aria-label="check"
                      size="large"
                      onClick={()=>handleApproval(item.id)}
                    >
                      <CheckCircleIcon color="success" fontSize="large" />
                    </IconButton>
                    <IconButton
                      // edge="end"
                      aria-label="check"
                      onClick={() => handleRejection(item.id)}
                    >
                      <CancelIcon color="error" fontSize="large" />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
