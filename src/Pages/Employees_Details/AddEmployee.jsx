import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import { string, object } from "yup";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Randomstring from "randomstring";
import { Formik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function AddEmployee({ open, handleClose, setdata }) {
  const formikRef = React.useRef(null);
  const [password, setpassword] = useState("");
  console.log(
    "🚀 ~ file: AddEmployee.jsx:27 ~ AddEmployee ~ password:",
    password
  );
  const [admin, setadmin] = useState("no");
  const [branch, setbranch] = React.useState("");
  console.log("🚀 ~ file: AddEmployee.jsx:30 ~ AddEmployee ~ branch:", branch);
  const [branches, setbranches] = useState([]);
  const [picture, setpicture] = useState(null);
  console.log(
    "🚀 ~ file: AddEmployee.jsx:31 ~ AddEmployee ~ picture:",
    picture
  );
  const handleSubmit = () => {
    if (password !== "" && branch !== "" && picture !== null) {
      formikRef.current.submitForm();
      handleClose();
    } else toast.warn("Fill all the fields");
  };
  const handleDialogClose = () => {
    setpassword("");
    handleClose();
  };
  const handleAdminChange = (event) => {
    setadmin(event.target.value);
  };

  const generatePassword = () => {
    const password = Randomstring.generate();
    setpassword(password);
  };

  const handlePicture = (event) => {
    setpicture(event.target.files[0]);
  };

  const validationScheme = object({
    full_name: string()
      .matches(
        /^[A-Z][a-z]*(?: [A-Z][a-z]*)+(?: [A-Z][a-z]*)?$/,
        "Invalid Name"
      )
      .required("Name is required"),
    email: string().email().required("email is required"),
  });

  const handleBranchChange = (event) => {
    setbranch(event.target.value);
  };

  const saveData = (val) => {
    console.log("🚀 ~ file: AddEmployee.jsx:69 ~ saveData ~ val:", val);
    const formdata = new FormData();
    formdata.append("email", val.email);
    formdata.append("full_name", val.full_name);
    formdata.append("branch_location_id", branch);
    formdata.append("password", password);
    formdata.append("is_admin", admin);
    formdata.append("profilePicture", picture);
    console.log(
      "🚀 ~ file: AddEmployee.jsx:71 ~ saveData ~ formdata:",
      formdata
    );
    axios
      .post("employee/addEmployee", formdata)
      .then((res) => {
        toast.success("Employee added successfully");
        axios
          .get("employee/getEmployees")
          .then((res) => setdata(res.data))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios.get("branch/getBranches").then((res) => setbranches(res.data));
  }, []);

  return (
    <div>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Add Employee</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              email: "",
              full_name: "",
            }}
            onSubmit={(val) => {
              saveData(val);
              setpassword("");
              setbranch("");
            }}
            innerRef={formikRef}
            validationSchema={validationScheme}
          >
            {({ handleChange, handleSubmit, errors }) => (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="fullName"
                  name="fullName"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={handleChange("full_name")}
                />
                <Typography sx={{ color: "red" }}>
                  {errors.full_name && errors.full_name}
                </Typography>
                <TextField
                  margin="dense"
                  name="email"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={handleChange("email")}
                />
                  {errors.email && errors.email}
              
                {/* <input type="file" onChange={handlePicture}/> */}
                <TextField
                  margin="dense"
                  name="picture"
                  id="email"
                  type="file"
                  fullWidth
                  variant="standard"
                  onChange={handlePicture}
                />
              </>
            )}
          </Formik>
          <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
            <FormControl>
              <Box>
                <FormLabel>Make admin</FormLabel>
                <RadioGroup row value={admin} onChange={handleAdminChange}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="yes"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="no"
                    labelPlacement="top"
                  />
                </RadioGroup>
              </Box>
            </FormControl>
            <FormControl sx={{ mt: 1, minWidth: 100, justifySelf: "flex-end" }}>
              <InputLabel id="demo-simple-select-autowidth-label">
                branch
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={branch}
                onChange={handleBranchChange}
                autoWidth
                label="branch"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {branches.map((item) => {
                  return (
                    <MenuItem value={item.id}>{item.location_name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flexDirection: "column" }}>
            <Button onClick={generatePassword}>Generate password</Button>
            <Typography>{password}</Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Employee</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
