import React, { useState } from 'react'
import axios from "axios";
// import { VictoryChart, VictoryAxis, VictoryBar } from "victory";
import Chip from "@mui/material/Chip";
import {Box, Divider, Paper, Typography} from '@mui/material';
import { Stack } from '@mui/material';
import { DateTime } from 'luxon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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

const labels = ['12th mar', '13th mar', '15th mar', '16th mar', '17th May', '18th Jun', '19th Jul'];

export const data = {
  labels,
  datasets: [
    {
      data: [1,4,3,2,5,6,7],
      backgroundColor: 'dodgerblue',
    },
   
  ],
};



export default function WorkingHours({emp_id}) {
    const [chartData, setchartData] = useState([1])
    const [endDate, setendDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
    console.log("🚀 ~ file: WorkingHours.jsx:56 ~ WorkingHours ~ endDate:", endDate)
    const [startDate, setstartDate] = useState(DateTime.now().minus({days:6}).toFormat('yyyy-MM-dd'));
    console.log("🚀 ~ file: WorkingHours.jsx:58 ~ WorkingHours ~ startDate:", startDate)
    
    const fetchWorkingHours = () => {
        axios
          .get(`/attendance/getWorkingHours/${emp_id}`, {
            params: {
              startDate: startDate,
              endDate: endDate,
            },
          })
          .then((res) => {
            let temp=[];
            res.data.map(item=>{
              let in_time=DateTime.fromFormat(item.in_time,'HH:mm:SS')
              let out_time=DateTime.fromFormat(item.out_time,'HH:mm:SS')
              let hours=(out_time.diff(in_time,'minutes'))/60
              let date=DateTime.fromSQL(item.date).toLocaleString({day:'numeric',month:'short'})
              temp.push({x:date,y:hours})
            })
            setchartData(temp)
          })
          .catch((err) => console.log(err))
      };


      const handlePreviousWeek = () => {
        setendDate(startDate);
        setstartDate((prev) => {
          return DateTime.fromFormat(prev, "yyyy-MM-dd").minus({days:6});
        });
        fetchWorkingHours();
      };
    
      const handleNextWeek = () => {
        setstartDate(endDate);
        setendDate((prev) => {
          return DateTime.fromFormat(prev, "yyyy-MM-dd").plus({days:6});

        });
        fetchWorkingHours();
      
      };
  return (
    <Paper sx={{ height: "400px",borderRadius:5 }}>
              <Typography variant='h5' sx={{}}>Working Hours</Typography>
              <Divider/>

              <Stack direction="row" spacing={1}>
                <Chip
                  label="Previous week"
                  onClick={handlePreviousWeek}
                  variant="outlined"
                  color='primary'
                  size='medium'
                />
                <Chip
                  label="next week"
                  variant="outlined"
                  onClick={handleNextWeek}
                  color='primary'
                  size='medium'
                  
                  />
              </Stack>
              {chartData.length===0?<Typography>No data to show</Typography>:
              <Box sx={{width:'100%',height:'80%',position:'relative',left:100}}>

              <Bar
               options={options}
               data={data} />
               </Box>
            //   <VictoryChart
            //   //   theme={VictoryTheme.material}
            //   domainPadding={35}
            // >
            //   <VictoryAxis
            //     style={{}}
            //     // set the name for the x-axis
            //     //   label="Days"
            //   />
            //   <VictoryAxis
            //     dependentAxis
            //     // set the name for the y-axis
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
            //     // data={chartData}
            //     // animate={{
            //     //   duration: 2000,
            //     //   onLoad: { duration: 1000 },
            //     // }}
            //   />
            // </VictoryChart>
              }
              
            </Paper>
  )
}
