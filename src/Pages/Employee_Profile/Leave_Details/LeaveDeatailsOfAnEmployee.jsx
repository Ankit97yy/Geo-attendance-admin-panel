import React from 'react'
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import { Divider, Paper,Typography } from '@mui/material';
import RemainingLeaves from './RemainingLeaves';
import FullFilledRequests from './FullFilledRequests';
export default function LeaveDeatailsOfAnEmployee({emp_id}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


      function TabPanel(props) {
        const { children, value, index, ...other } = props;
    
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 1 }}>
                {/* <Typography>{children}</Typography> */}
                {children}
              </Box>
            )}
          </div>
        );
      }
      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };

      function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          "aria-controls": `simple-tabpanel-${index}`,
        };
      }
  return (
    <Paper sx={{borderRadius:5,height:'400px'}}>
      <Typography variant='h5' sx={{}}>Leave Details</Typography>
      <Divider/>  
                <Box sx={{ borderBottom: 0, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                  >
                    <Tab label="Remaining" />
                    <Tab label="Fullfilled " />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Box sx={{display:"flex",justifyContent:"center",alignItems:'center',height:'30vh'}}>
                 <RemainingLeaves emp_id={emp_id}/>
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <FullFilledRequests emp_id={emp_id}/>
                </TabPanel>
            </Paper>
  )
}
