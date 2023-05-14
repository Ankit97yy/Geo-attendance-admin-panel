import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import AddEmployee from "../Employees_Details/AddEmployee";

export default function AddEmpFromSettings() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
      <AddEmployee open={open} handleClose={handleClose} />
      Add employee
      <Button variant="contained" onClick={() => setOpen(true)}>Add employee</Button>
    </Box>
  );
}
