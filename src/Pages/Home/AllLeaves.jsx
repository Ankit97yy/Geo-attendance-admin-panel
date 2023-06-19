import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
// import listPlugin from "@fullcalendar/list";
import { Paper } from "@mui/material";
import axios from "axios";
import { DateTime } from "luxon";
import { socket } from "../../App";

export default function AllLeaves() {
  const [leaves, setleaves] = useState([]);
  const [refresh, setrefresh] = useState(true)
  socket.on("REFRESH_LEAVE",()=>{
    setrefresh(!refresh)
  })
  useEffect(() => {
    let temp = [];
    axios
      .get("/leave/getAllLeaves")
      .then((res) => {
        res.data.map((leave) => {
          let start = DateTime.fromISO(leave.start).setZone('Asia/Kolkata').toFormat("yyyy-MM-dd");
          let end = DateTime.fromISO(leave.end).setZone('Asia/Kolkata').plus({day:1}).toFormat("yyyy-MM-dd");
          let backgroundColor = "";
          let color = "";
          if (leave.status === "pending") {
            backgroundColor = "yellow";
            color= "black";
          } else if (leave.status === "rejected") {
            backgroundColor = "red";
          } else {
            backgroundColor = "green";
          }
          temp.push({
            title: `Name: ${leave.full_name}, Type: ${leave.leave_type} leave`,
            start: start,
            end: end,
            backgroundColor: backgroundColor,
            textColor:color
          });
        });
        setleaves(temp);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  return (
    <Paper sx={{ borderRadius: 5, padding: 2 }} elevation={4}>
      <FullCalendar
        height={700}
        // themeSystem="Materia"
        // contentHeight={700}
        plugins={[dayGridPlugin]}
        events={leaves}
        // initialView="listWeek"
      />
    </Paper>
  );
}
