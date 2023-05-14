import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Box } from "@mui/material";
import React,{useState,useEffect, useMemo} from "react";
import axios from "axios";
import moment from "moment";

export default function FullFilledRequests({emp_id}) {
const [rowData, setrowData] = useState()
console.log("🚀 ~ file: FullFilledRequests.jsx:10 ~ FullFilledRequests ~ rowData:", rowData)

useEffect(() => {
  axios.get(`leave/getFulfilledRequests/${emp_id}`)
  .then(res=>setrowData(res.data))
  .catch(err=>console.error(err))
}, [])

  const column = [
    {
      field: "leave_type",
      headerName: "Leave type",
    },
    {
      field: "reason",
      headerName: "Reason",
    },
    {
      field: "start",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      field: "end",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      field: "status",
      headerName: "Status",
    },
  ];

  const defaultColDef = useMemo(() => ({
    width: 180,
  }));
  return (
    <Box className="ag-theme-alpine" sx={{ height: "30vh" }}>
      <AgGridReact
        // ref={gridRef} // Ref for accessing Grid's API
        rowData={rowData} // Row Data for Rows
        columnDefs={column} // Column Defs for Columns
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        defaultColDef={defaultColDef}
      />
    </Box>
  );
}
