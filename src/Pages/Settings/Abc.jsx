import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import GenerateReport from "./GenerateReport";
import LeaveEditor from "./LeaveEditor";
import SetTimeForBranch from "./SetTimeForBranch";
import AddEmpFromSettings from "./AddEmpFromSettings";
import { Box, Container, Divider } from "@mui/material";
import SetRadius from "./SetRadius";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export default function Abc() {
  return (
    <Box sx={{padding:5}}>
      <Container>
        <Grid2 container spacing={5}>
          <Grid2 md={6}>
            <SetTimeForBranch />
            <Divider />
            <SetRadius />
            {/* <AddEmpFromSettings /> */}
          </Grid2>
          <Grid2 md={6}>
            <LeaveEditor />
            <Divider />
            <GenerateReport />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
