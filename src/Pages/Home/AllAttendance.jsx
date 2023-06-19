import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import { Box } from "@mui/system";
import { Paper, TextField, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import axios from "axios";
import { DateTime } from "luxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { socket } from "../../App";
import { toast } from "react-toastify";

export default function AllAttendance() {
  const gridRef = useRef(); // for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [refresh, setrefresh] = useState(false)
  socket.on("ATTENDANCE_RECIEVED",()=>setrefresh(!refresh))

  const PickTime = memo(
    forwardRef((props, ref) => {
      const [value, setValue] = useState(
        props.value !== null
          ? DateTime.fromFormat(props.value, "HH:mm:ss")
          : null
      );
      console.log("🚀 ~ file: AllAttendance.jsx:32 ~ PickTime ~ value:", value);
      const refInput = useRef(null);

      // useEffect(() => {
      // focus on the input
      //     refInput.current.focus();
      // }, []);

      /* Component Editor Lifecycle methods */
      useImperativeHandle(ref, () => {
        return {
          // the final value to send to the grid, on completion of editing
          getValue() {
            // this simple editor doubles any value entered into the input
            if (value !== null) {
              if (value.toFormat("HH:mm:ss") === "00:00:00") return null;
              return value.toFormat("HH:mm:ss");
            } else return null;
          },

          // Gets called once before editing starts, to give editor a chance to
          // cancel the editing before it even starts.
          isCancelBeforeStart() {
            return false;
          },

          // Gets called once when editing is finished (eg if Enter is pressed).
          // If you return true, then the result of the edit will be ignored.
          // isCancelAfterEnd() {
          // our editor will reject any value greater than 1000
          //     return value > 1000;
          // }
        };
      });

      // const handleChange = (date) => {
      //   setValue(date);
      // };

      return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <TimeField
            value={value}
            onChange={(newValue) => setValue(newValue)}
            format="HH:mm:ss"
          />
        </LocalizationProvider>
      );
    })
  );
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
      headerName: "Status",
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
      headerName: "In Time",
      filter: true,
      editable: true,
      cellEditor: PickTime,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      valueFormatter: (params) => {
        if (params.value === "" || params.value == null) return "--:--";
      },
    },
    {
      field: "out_time",
      headerName: "Out Time",
      editable: true,
      filter: true,
      cellEditor: PickTime,
      filterParams: {
        buttons: ["apply", "reset"],
      },
      valueFormatter: (params) => {
        if (params.value === "" || params.value == null) return "--:--";
      },
    },
    {
      headerName: "Late Arrival",
      field: "late_arrival",
      // cellStyle: (params) => {
      //   if (params.value === null) return;
      //   if (params.value > 0) {
      //     return {
      //       backgroundColor: "#ffff0030",
      //       borderRadius: 10,
      //       "text-shadow": "0.5px 0px 1px ",
      //     };
      //   } else return { color: "green" };
      // },
      valueFormatter: (params) => {
        if (params.value === null) return "--";
        else return `${params.value}`;
      },
    },
    {
      headerName: "Early Departure",
      field: "early_departure",
      // cellStyle: (params) => {
      //   if (params.value === null) return;
      //   if (params.value > 0) {
      //     return {
      //       backgroundColor: "#ffff0030",
      //       borderRadius: 10,
      //       "text-shadow": "0.5px 0px 1px ",
      //     };
      //   } else if (params.value <= 0)
      //     return {
      //       backgroundColor: "#b3ffb360",
      //     };
      // },
      valueFormatter: (params) => {
        if (params.value === null) return "--";
        else return `${params.value}`;
      },
    },
    {
      field: "date",
      headerName: "Date",
      filter: "agDateColumnFilter",
      // cellEditor:PickDate,
      // cellEditorPopup:true,
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // const dateAsString = DateTime.fromISO(cellValue).setZone('Asia/Kolkata').toFormat("dd-MM-yyyy");
          // console.log("cellValue", dateAsString);
          console.log("filter", filterLocalDateAtMidnight);

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
      // const date = new Date(params.value);
      // return moment(date).format("DD/MM/YYYY");
      //   return DateTime.fromISO(params.value).setZone('Asia/Kolkata').toFormat("dd-MM-yyyy")
      // },
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
        toast.success("Updated Successfully");
      })
      .catch((err) => console.log(err));
  }, []);

  // Quick Search
  const quickfilter = useCallback((event) => {
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  useEffect(() => {
    console.log("all attendance rendered")
    axios
      .get("attendance/getAllAttendances")
      .then((res) => {
        let temp = [];
        res.data.map((item) => {
          temp.push({
            ...item,
            date: DateTime.fromISO(item.date)
              .setZone("Asia/Kolkata")
              .toFormat("dd-MM-yyyy"),
          });
        });
        setRowData(temp);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  return (
    <Paper sx={{ height: "62vh", borderRadius: 5, padding: 2 }} elevation={3}>
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
          placeholder="Search"
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
