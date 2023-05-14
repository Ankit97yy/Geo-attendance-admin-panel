import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Box } from "@mui/system";
import { Paper, TextField, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import axios from "axios";
import { DateTime } from "luxon";

export default function EmpAttendance({ emp_id }) {
  const [rowData, setrowData] = useState([]);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  // const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  // Each Column Definition results in one Column.
  useEffect(() => {
    axios
      .get(`attendance/getAttendanceOfAnEmployee/${emp_id}`)
      .then((res) => {
        let temp=[]
        res.data.map(item=>{
          temp.push({...item,date:DateTime.fromISO(item.date).setZone('Asia/Kolkata').toFormat('dd-MM-yyyy')})
        })
        setrowData(temp)
      })
      .catch((err) => console.log(err));
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "full_name",
      headerName: "Name",
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
    },
    {
      field: "location_name",
      headerName: "Location Name",
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      onCellValueChanged: (params) => {},
    },
    {
      field: "status",
      filter: true,
      editable: true,
      cellStyle: (params) => {
        if (params.value === "absent") {
          return {
            color: "red",
            backgroundColor: "#ff000010",
            borderRadius: 10,
            "text-shadow": "0.5px 0px 1px red",
          };
        } else {
          return {
            color: "black",
          };
        }
      },
      filterParams: {
        buttons: ["apply", "reset"],
      },
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        // values: ["present", "absent"],
        values: ["present", "absent"],
      },
    },
    {
      headerName: "In time",
      field: "in_time",
      filter: true,
      editable: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
    },
    {
      headerName: "Out time",
      field: "out_time",
      editable: true,
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
    },
    {
      headerName: "Late arrival",
      field: "late_arrival",
      editable: true,
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      cellStyle: (params) => {
        if (params.value === null) return;
        if (params.value > 0) {
          return {
            backgroundColor: "#ffff0030",
            borderRadius: 10,
            // "text-shadow": "0.5px 0px 1px ",
          };
        } else return { color: "green" };
      },
      valueFormatter: (params) => {
        if (params.value === null) return "--";
        else if (params.value <= 0) return "On time";
        else return `${params.value} min`;
      },
    },
    {
      headerName: "Early departure",
      field: "early_departure",
      cellStyle: (params) => {
        if (params.value === null) return;
        if (params.value > 0) {
          return {
            backgroundColor: "#ffff0030",
            borderRadius: 10,
            // "text-shadow": "0.5px 0px 1px ",
          };
        } else if (params.value <= 0)
          return {
            backgroundColor: "#b3ffb360",
          };
      },
      valueFormatter: (params) => {
        if (params.value === null) return "--";
        else if (params.value <= 0) return "On time";
        else return `${params.value} min`;
      },
      editable: true,
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
    },

    {
      headerName: "Date",
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {

          if (cellValue == null) {
            return 0;
          }

          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = cellValue.split("-");
          const year = Number(dateParts[2]);
          const month = Number(dateParts[1]) - 1;
          const day = Number(dateParts[0]);
          const cellDate = new Date(year, month, day);
          console.log("celldate", cellDate);

          // Now that both parameters are Date objects, we can compare
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
        buttons: ["apply", "reset"],
      },
      // valueFormatter: (params) => {
      //   const date = new Date(params.value);
      //   return moment(date).format("DD/MM/YYYY");
      // },
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    width: 220,
  }));

  // Example of consuming Grid Event
  const cellEditStoppedListener = useCallback((event) => {
    console.log("cell", event);
    axios
      .put(`attendance/updateAttendance/${event.data.id}`, {
        [event.colDef.field]: event.newValue,
      })
      .then((res) => {
        console.log("done");
      })
      .catch((err) => console.log(err));
  }, []);

  const quickfilter = useCallback((event) => {
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  return (
    <Paper sx={{ height: "62vh", borderRadius: 10, padding: 2 }} elevation={3}>
      <Box sx={{ justifyContent: "space-between", display: "flex" }}>
        <Typography
          sx={{ justifySelf: "flex-start", display: "flex" }}
          variant="h5"
        >
          Attendance
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          sx={{}}
          placeholder="Search anything"
          onInput={quickfilter}
        />
      </Box>

      <Box className="ag-theme-alpine" sx={{ height: "57vh" }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellEditingStopped={cellEditStoppedListener}
        />
      </Box>
    </Paper>
  );
}
