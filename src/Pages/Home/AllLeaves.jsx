import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
// import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import { Paper } from "@mui/material";
import axios from "axios";
import { DateTime } from "luxon";

export default function AllLeaves() {
  const [leaves, setleaves] = useState([]);

  useEffect(() => {
    let temp = [];
    axios
      .get("/leave/getAllLeaves")
      .then((res) => {
        res.data.map((leave) => {
          let start = DateTime.fromISO(leave.start).toFormat("yyyy-MM-dd");
          let end = DateTime.fromISO(leave.end).toFormat("yyyy-MM-dd");
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
            title: `Name: ${leave.name}, reason: ${leave.reason}`,
            start: start,
            end: end,
            backgroundColor: backgroundColor,
            textColor:color
          });
        });
        setleaves(temp);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Paper sx={{ borderRadius: 10, padding: 2 }} elevation={4}>
      <FullCalendar
        height={700}
        // themeSystem="Materia"
        // contentHeight={700}
        plugins={[listPlugin]}
        events={leaves}
        initialView="listWeek"
      />
    </Paper>
  );
}
