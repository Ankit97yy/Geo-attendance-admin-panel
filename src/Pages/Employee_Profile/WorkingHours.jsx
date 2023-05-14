import React, { useEffect, useState } from "react";
import axios from "axios";
// import { VictoryChart, VictoryAxis, VictoryBar } from "victory";
import Chip from "@mui/material/Chip";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  // plugins: {
  //   legend: {
  //     position: 'top',
  //   },

  // },
};

const labels = [
  "12th mar",
  "13th mar",
  "15th mar",
  "16th mar",
  "17th May",
  "18th Jun",
  "19th Jul",
];

export default function WorkingHours({ emp_id }) {
  const [chartData, setchartData] = useState({ dates: [], hours: [] });
  console.log("🚀 ~ file: WorkingHours.jsx:51 ~ WorkingHours ~ chartData:", chartData)
  const [labels, setlabels] = useState([]);
  const [endDate, setendDate] = useState(DateTime.now().toFormat("yyyy-MM-dd"));
  const [startDate, setstartDate] = useState(
    DateTime.now().minus({ days: 6 }).toFormat("yyyy-MM-dd")
    );
    console.log("🚀 ~ file: WorkingHours.jsx:57 ~ WorkingHours ~ startDate:", startDate)
    console.log("🚀 ~ file: WorkingHours.jsx:54 ~ WorkingHours ~ endDate:", endDate)

  useEffect(() => {
    fetchWorkingHours();
  }, [startDate]);

  const fetchWorkingHours = () => {
    axios
      .get(`/attendance/getWorkingHours/${emp_id}`, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      })
      .then((res) => {
        console.log("🚀 ~ file: WorkingHours.jsx:68 ~ .then ~ res:", res.data);
        let hours = [];
        let dates = [];
        res.data.map((item) => {
          if (item.in_time === null || item.out_time === null) hour = 0;
          else {
            let in_time = DateTime.fromFormat(item.in_time, "HH:mm:ss");
            let out_time = DateTime.fromFormat(item.out_time, "HH:mm:ss");
            var hour = out_time.diff(in_time, "minutes").minutes / 60;
          }
          // console.log("🚀 ~ file: WorkingHours.jsx:74 ~ .then ~ hour:", hour);
          let date = DateTime.fromISO(item.date).plus({day:1}).toLocaleString({
            day: "numeric",
            month: "short",
          });
          dates.push(date);
          hours.push(hour);
        });
        console.log("🚀 ~ file: WorkingHours.jsx:70 ~ .then ~ dates:", dates);
        console.log("🚀 ~ file: WorkingHours.jsx:69 ~ .then ~ hours:", hours);

        setchartData({ dates, hours });
      })
      .catch((err) => console.log(err));
  };

  const handlePreviousWeek = () => {
    setendDate(startDate);
    setstartDate((prev) => {
      return DateTime.fromFormat(prev, "yyyy-MM-dd").minus({ days: 6 }).toFormat('yyyy-MM-dd');
    });
  };

  const handleNextWeek = () => {
    setstartDate(endDate);
    setendDate((prev) => {
      return DateTime.fromFormat(prev, "yyyy-MM-dd").plus({ days: 6 }).toFormat('yyyy-MM-dd');
    });
  };

  const data = {
    labels: chartData.dates,
    datasets: [
      {
        data: chartData.hours,
        backgroundColor: "dodgerblue",
      },
    ],
  };
  return (
    <Paper sx={{ height: "400px", borderRadius: 5 }}>
      <Typography variant="h5" sx={{}}>
        Working Hours
      </Typography>
      <Divider />

      <Stack direction="row" spacing={1}>
        <Chip
          label="Previous week"
          onClick={handlePreviousWeek}
          variant="outlined"
          color="primary"
          size="medium"
        />
        <Chip
          label="next week"
          variant="outlined"
          onClick={handleNextWeek}
          color="primary"
          size="medium"
          disabled={DateTime.now().toFormat('yyyy-MM-dd')===endDate?true:false}
        />
      </Stack>
      {
        chartData.dates.length === 0 ? (
          <Typography>No data to show</Typography>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "80%",
              position: "relative",
              left: 100,
            }}
          >
            <Bar options={options} data={data} />
          </Box>
        )
        //   <VictoryChart
        //   theme={VictoryTheme.material}
        //   domainPadding={35}
        // >
        //   <VictoryAxis
        //     style={{}}
        // set the name for the x-axis
        //   label="Days"
        //   />
        //   <VictoryAxis
        //     dependentAxis
        // set the name for the y-axis
        //     label="Hours"
        //   />
        //   <VictoryBar
        //     style={{ data: { fill: "dodgerblue" } }}
        //     data={[
        //       { x: "12 Mar", y: 5 },
        //       { x: "13 Mar", y: 4 },
        //       { x: "14 Mar", y: 5 },
        //       { x: "15 Mar", y: 6 },
        //       { x: "16 Mar", y: 2.5 },
        //       { x: "17 Mar", y: 5 },
        //     ]}
        // data={chartData}
        // animate={{
        //   duration: 2000,
        //   onLoad: { duration: 1000 },
        // }}
        //   />
        // </VictoryChart>
      }
    </Paper>
  );
}
