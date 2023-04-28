import React, { useEffect,useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Data } from 'victory';
import { object } from 'yup';

ChartJS.register(ArcElement, Tooltip, Legend);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
  
  },
};

export default function RemainingLeaves({emp_id}) {
  const [data, setdata] = useState([])
  const [labels, setlabels] = useState()

  useEffect(()=>{
    axios.get(`/leave/getRemainingLeaves/${emp_id}`)
    .then(res=>{
      let keys=Object.keys(res.data[0])
      let values=Object.values(res.data[0])
      setlabels(keys)
      setdata(values)
    })
  },[])

  const datas = {
    labels:labels,
    datasets: [
      {
        label: 'Remaining:',
        data: data,
        // backgroundColor: [
        //   'rgba(255, 99, 132, 0.2)',
        //   'rgba(54, 162, 235, 0.2)',
        //   'rgba(255, 206, 86, 0.2)',
        //   'rgba(75, 192, 192, 0.2)',
        //   'rgba(153, 102, 255, 0.2)',
        //   'rgba(255, 159, 64, 0.2)',
        // ],
        // borderColor: [
        //   'rgba(255, 99, 132, 1)',
        //   'rgba(54, 162, 235, 1)',
        //   'rgba(255, 206, 86, 1)',
        //   'rgba(75, 192, 192, 1)',
        //   'rgba(153, 102, 255, 1)',
        //   'rgba(255, 159, 64, 1)',
        // ],
        backgroundColor:['dodgerblue','tomato','green'],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Box sx={{width:'45%'}}>

  <Doughnut options={options} data={datas} />
    </Box>
  )
}
