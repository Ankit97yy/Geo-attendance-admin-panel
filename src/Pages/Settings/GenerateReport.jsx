import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GenerateReport() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [start, setstart] = useState(null);
  console.log("🚀 ~ file: GenerateReport.jsx:20 ~ GenerateReport ~ start:", start)
  const [end, setend] = useState(null);
  const [radio, setradio] = useState("no");
  const timeref=useRef();

  const handleChange = (event) => {
    setradio(event.target.value);
  };
  console.log(
    "🚀 ~ file: GenerateReport.jsx:18 ~ GenerateReport ~ options:",
    options
  );
  const [value, setvalue] = useState(null);
  console.log(
    "🚀 ~ file: GenerateReport.jsx:20 ~ GenerateReport ~ value:",
    value
  );
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    // (async () => {
    //   await sleep(1e3); // For demo purposes.

    //   if (active) {
    //     setOptions([...topFilms]);
    //   }
    // })();
    if (active) {
      axios
        .get("employee/getEmployees")
        .then((res) => setOptions(res.data))
        .catch((err) => console.log(err));
    }

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const generateReport = () => {
    if(start===null || end===null){
      toast.warning("Enter all fields")
      return
    }
    if(start?.invalid!==null || end?.invalid!==null){
      toast.warning("invalid date")
      return
    }
    axios
      .post(
        "/employee/getReport",
        { id:value?.id,start: start.toFormat('yyyy-MM-dd'), end: end.toFormat('yyyy-MM-dd') },
        { responseType: "blob" }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "hello.pdf");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap:1
      }}
    >
      <ToastContainer theme="dark" position="bottom-left"/>
      <Typography fontWeight={"bold"}>Generate attendance report</Typography>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Do you want to export report for a specific employee?</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={radio}
          onChange={handleChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="yes" />
          <FormControlLabel value="no" control={<Radio />} label="no" />
        </RadioGroup>
      </FormControl>
      <Autocomplete
      disabled={radio==='yes'?false:true}
        id="asynchronous-demo"
        sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        value={value}
        onChange={(event, newValue) => {
          setvalue(newValue);
        }}
        getOptionLabel={(option) => option.full_name}
        options={options}
        loading={loading}
        renderOption={(props, option) => (
          <div {...props}>
            <Avatar
              sx={{ mr: 2 }}
              src={`http://localhost:3001/${option.profile_picture}`}
              alt="NA"
            />
            {option.full_name}
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select an employee"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          label="Select start date"
          value={start}
          onChange={(newValue) => setstart(newValue)}
        />
        <DatePicker
        
          label="Select end date"
          value={end}
          onChange={(newValue) => setend(newValue)}
        />
      </LocalizationProvider>
      <Button variant="contained" onClick={generateReport}>
        Generate
      </Button>
    </Box>
  );
}
