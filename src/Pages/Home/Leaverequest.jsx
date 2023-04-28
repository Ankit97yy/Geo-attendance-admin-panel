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
export default function Leaverequest() {
  const [leaves, setleaves] = useState([]);
  const { userData } = useContext(ContextForUser);
  useEffect(() => {
    axios
      .get("leave/getPendingLeaves")
      .then((res) => setleaves(res.data))
      .catch((err) => console.log(err));
  }, []);


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


  return (
    <Box>
      <Paper
        elevation={3}
        sx={{ height: "62vh", borderRadius: 10, padding: 2 }}
      >
        <Typography
          sx={{ display: "flex", marginTop: 2, marginLeft: 2 }}
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
                      secondary={`sick leave from ${moment(item.start).format(
                        "Do MMMM"
                      )} to ${moment(item.end).format("Do MMMM")} `}
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
