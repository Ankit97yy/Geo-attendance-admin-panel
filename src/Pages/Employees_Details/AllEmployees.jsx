import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Box } from "@mui/system";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import axios from "axios";
import AddEmployee from "./AddEmployee";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function AllEmployees() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row
  const [branches, setbranches] = useState([]);

  const [open, setOpen] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);
  const [employeToBeDeleted, setemployeToBeDeleted] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("employee/getEmployees")
      .then((res) => setRowData(res.data))
      .catch((err) => console.log(err));

    axios
      .get("branch/getBranches")
      .then((res) => {
        let temp = [];
        res.data.map((item) => {
          temp.push(item.id);
        });
        setbranches(temp);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function AlertDialog() {

    const handleDeleteEmployee = () => {
      axios
        .delete(`employee/deleteEmployee/${employeToBeDeleted}`)
        .then((response) => {
          let temp = [];
          temp = rowData.filter((item) => item.id !== employeToBeDeleted);
          setRowData(temp);
          toast.success("Deleted Successfully")
        })
        .catch((error) => {
          toast.error("something went wrong")
          console.log(error);
        });
     
      
      setdeleteDialog(false);
    };

    return (
      <div>
        <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete this employee?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setdeleteDialog(false)}>Disagree</Button>
            <Button onClick={handleDeleteEmployee} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  const Actions = (params) => {
    const handleDelete = () => {
      setemployeToBeDeleted(params.data.id);
      setdeleteDialog(true);
    };
    return (
      <>
        <Button
          variant="outlined"
          onClick={() => navigate(`/ankit/${params.data.id}`)}
        >
          View Profile
        </Button>
        <IconButton onClick={handleDelete}>
          <DeleteForeverRoundedIcon fontSize="large" />
        </IconButton>
      </>
    );
  };
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
        field: "branch_location_id",
        headerName: "Branch Id",
        editable: true,
        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: branches,
        },
      },
      {
        field: "full_name",
        headerName: "Name",
        editable: true,
        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
        width: 350,
      },
      {
        field: "email",
        headerName: "Email id",
        editable: true,
        filter: true,
        resizable: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
        width: 350,
      },
      {
        field: "location_name",
        headerName: "Branch name",

        filter: true,
        filterParams: {
          buttons: ["apply", "reset"],
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["present", "absent"],
        },
        width: 350,
      },
      {
        headerName: "Actions",
        cellRenderer: Actions,
        width: 350,
      },
    ];
  }, [branches, rowData]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // Update function
  const cellEditStoppedListener = useCallback((event) => {
    console.log("cell", event);
    axios
      .put(`employee/updateEmployee/${event.data.id}`, {
        [event.colDef.field]: event.newValue,
      })
      .then((res) => {
        console.log("done");
      });
  }, []);

  const quickfilter = useCallback((event) => {
    gridRef.current.api.setQuickFilter(event.target.value);
  }, []);

  return (
    <>
      <AddEmployee open={open} handleClose={handleClose} />
      <AlertDialog />
    <ToastContainer position="bottom-left"/>

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
            All Employees
          </Typography>
          <Box>
            <Button
              sx={{ alignSelf: "center", marginRight: 2 }}
              onClick={handleClickOpen}
              variant="contained"
            >
              Add employee
            </Button>
            <TextField
              variant="outlined"
              size="small"
              // sx={{ bottom: 10 }}
              placeholder="Search anything"
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
            onCellEditingStopped={cellEditStoppedListener}
            rowHeight={50}
          />
        </Box>
      </Paper>
    </>
  );
}
