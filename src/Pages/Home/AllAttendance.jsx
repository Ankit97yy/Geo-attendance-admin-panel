import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { Box } from "@mui/system";
import { Paper, TextField, Typography } from "@mui/material";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import moment from "moment";
import { ContextForUser } from "../../Contexts/UserContext";
import axios from "axios";

export default function AllAttendance() {
  const gridRef = useRef(); // for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

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
      onCellValueChanged: (params) => {
        console.log(params, "PPPPPPP");
      },
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
      field: "in_time",
      filter: true,
      editable: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      valueFormatter:(params)=>{
        if(params.value==="" || params.value==null) return "--:--"
      }
    },
    {
      field: "out_time",
      editable: true,
      filter: true,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      valueFormatter:(params)=>{
        if(params.value==="" || params.value==null) return "--:--"
      }
    },
    {
      field: "date",
      editable: true,
      filter: "agDateColumnFilter",
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateAsString = moment(cellValue).format("DD/MM/YYYY");
          console.log("cellValue", dateAsString);
          console.log("filter", filterLocalDateAtMidnight);

          if (dateAsString == null) {
            return 0;
          }

          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = dateAsString.split("/");
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
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return moment(date).format("DD/MM/YYYY");
      },
    },
  ]);

  // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo(() => ({
      sortable: true,
      width: 220,
    }));

  // Update Function
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


 // Quick Search
  const quickfilter = useCallback((event) => {
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  useEffect(() => {
    axios
      .get("attendance/getAllAttendances")
      .then((res) => setRowData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
      <Paper
        sx={{ height: "62vh", borderRadius: 10, padding: 2 }}
        elevation={3}
      >
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
