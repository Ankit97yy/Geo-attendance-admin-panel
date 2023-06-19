import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  Button,
  IconButton,
  Paper,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { string, object, number } from "yup";
import { Formik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";

export default function AllBranches() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [modal, setmodal] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);
  const [branchToBeDeleted, setbranchToBeDeleted] = useState(null);

  const handleClickOpen = () => {
    setmodal(true);
  };

  const handleClose = () => {
    setmodal(false);
  };

  function AlertDialog() {
    const handleDeleteBranch = () => {
      axios
        .delete(`branch/deleteBranch/${branchToBeDeleted}`)
        .then((response) => {
          let temp = [];
          temp = rowData.filter((item) => item.id !== branchToBeDeleted);
          setRowData(temp);
          toast.success("deleted successfully");
        })
        .catch((err) => {
          console.log(err);
        });

      setdeleteDialog(false);
    };

    return (
      <div>
        <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete this Branch?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setdeleteDialog(false)}>Disagree</Button>
            <Button onClick={handleDeleteBranch} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  const Actions = (params) => {
    const handleDeleteBranch = () => {
      setbranchToBeDeleted(params.data.id);
      setdeleteDialog(true);
    };
    return (
      <IconButton onClick={handleDeleteBranch}>
        <DeleteForeverRoundedIcon fontSize="large" />
      </IconButton>
    );
  };

  //Add Branch modal dialog
  const AddBranch = () => {
    const formikRef = React.useRef(null);
    const [start_time, setstart_time] = useState(null);
    const [end_time, setend_time] = useState(null);
    // const handleSubmit = () => {
    //   if (
    //     formikRef.isValid &&
    //     start_time?.invalid === null &&
    //     end_time?.invalid === null
    //   ) {
    //     console.log(formikRef.current);
    //     formikRef.current.submitForm();
    //     handleClose();
    //   } else toast.warning("Fill all the field");
    // };

    const saveData = (val) => {
      if( start_time?.invalid === null &&
        end_time?.invalid === null)
      axios
        .post("branch/addBranch", {
          ...val,
          start: start_time.toFormat("HH:mm:ss"),
          end: end_time.toFormat("HH:mm:ss"),
        })
        .then((res) => {
          toast.success("Added successfully");
          axios
            .get("branch/getBranches")
            .then((res) => setRowData(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(()=>handleClose())
        else toast.warn("Fill all the fields")
    };


    const validationScheme = object({
      latitude: number().required(),
      longitude: number().required(),
      location_name: string().required(),
      radius: number().required().max(200).min(50),
    });
    return (
      <div>
        <Dialog open={modal} onClose={handleClose}>
          <DialogTitle>Add Branch</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={{
                latitude: "",
                longitude: "",
                location_name: "",
                radius: 0,
              }}
              onSubmit={(val) => saveData(val)}
              innerRef={formikRef}
              validationSchema={validationScheme}
            >
              {({ handleChange, errors,handleSubmit }) => (
                <>
                  <TextField
                    margin="dense"
                    id="latitude"
                    label="Latitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("latitude")}
                    helperText={errors.latitude}
                    error={Boolean(errors.latitude)}
                  />

                  <TextField
                    margin="dense"
                    id="longitude"
                    label="Longitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("longitude")}
                    helperText={errors.longitude}
                    error={Boolean(errors.longitude)}
                  />

                  <TextField
                    margin="dense"
                    id="location"
                    label="Location name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("location_name")}
                    helperText={errors.location_name}
                    error={Boolean(errors.location_name)}
                  />
                  <TextField
                    margin="dense"
                    id="radius"
                    label="Radius"
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("radius")}
                    helperText={errors.radius}
                    error={Boolean(errors.radius)}
                  />
                  
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <TimeField
                label="Start time"
                value={start_time}
                onChange={(newValue) => setstart_time(newValue)}
                format="HH:mm:ss"
              />
              <TimeField
                label="End time"
                value={end_time}
                onChange={(newValue) => setend_time(newValue)}
                format="HH:mm:ss"
              />
            </LocalizationProvider>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Branch</Button>
          </DialogActions>
                </>
              )}
            </Formik>
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Branch</Button>
          </DialogActions> */}
        </Dialog>
      </div>
    );
  };
  //
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
  // Each Column Definition results in one Column.
  // const [columnDefs, setColumnDefs] = useState();
  const columnDefs = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "Id",
        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        field: "location_name",
        headerName: "Location",
        editable: true,
        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        field: "latitude",
        headerName: "Latitude",
        editable: true,
        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        field: "longitude",
        headerName: "Longitude",
        editable: true,
        filter: true,
        resizable: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        field: "start_time",
        headerName: "Start Time",
        editable: true,
        filter: true,
        resizable: true,
        cellEditor: PickTime,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },

      {
        field: "end_time",
        headerName: "End Time",
        editable: true,
        filter: true,
        resizable: true,
        cellEditor: PickTime,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        field: "radius",
        headerName: "Radius",
        editable: true,
        filter: true,
        resizable: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
      },
      {
        headerName: "Delete branch",
        cellRenderer: Actions,
      },
    ];
  }, [rowData]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    width: 225,
  }));
  const [quickFilter, setquickfilter] = useState("");

  // Example of consuming Grid Event
  const cellEditStoppedListener = useCallback((event) => {
    console.log("cell", event);
    axios
      .put(`branch/updateBranch/${event.data.id}`, {
        [event.colDef.field]: event.newValue,
      })
      .then((res) => {
        toast.success("Updated Successfully");
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: AllBranches.jsx:327 ~ cellEditStoppedListener ~ err:",
          err
        );
      });
  }, []);
  const cellClickedListener = useCallback((event) => {
    console.log("cellClicked", event);
  }, []);
  const quickfilter = useCallback((event) => {
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  useEffect(() => {
    axios
      .get("branch/getBranches")
      .then((res) => setRowData(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    //  gridRef.current.api.deselectAll();
  }, []);
  return (
    <>
      {/* <FullScreenDialog form="branch" open={open} handleClose={handleClose} /> */}
      <AddBranch />
      <AlertDialog />
      <Paper
        sx={{ height: "85vh", borderRadius: 5, padding: 4, margin: 2 }}
        elevation={3}
      >
        <Box
          sx={{
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Typography
            sx={{ justifySelf: "flex-start", display: "flex" }}
            variant="h5"
          >
            All Branches
          </Typography>
          <Box>
            <Button
              sx={{ alignSelf: "center", marginRight: 2 }}
              onClick={handleClickOpen}
              variant="contained"
            >
              Add Branch
            </Button>
            <TextField
              variant="outlined"
              size="small"
              // sx={{ bottom: 10 }}
              placeholder="Search"
              onInput={quickfilter}
            />
          </Box>
        </Box>
        <Box className="ag-theme-alpine" sx={{ height: "83vh" }}>
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={rowData} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
            onCellClicked={cellClickedListener} // Optional - registering for Grid Event
            onCellEditingStopped={cellEditStoppedListener}
          />
        </Box>
      </Paper>
    </>
  );
}
