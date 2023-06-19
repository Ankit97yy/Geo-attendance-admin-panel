import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { number, object } from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ErrorSharp } from "@mui/icons-material";

export default function LeaveEditor() {
  const [initialValues, setinitialValues] = useState([
    { annual: 1, casual: 2, sick: 3 },
  ]);
  console.log(
    "🚀 ~ file: LeaveEditor.jsx:14 ~ LeaveEditor ~ initialValues:",
    initialValues
  );
  useEffect(() => {
    // axios.get("leave/getTotalAllowedLeaves")
    // .then(res=>setinitialValues(res.data[0]))
    // .catch(err=>console.log(err))
  }, []);
  const validationScheme = object({
    annual: number().positive().integer().required(),
    sick: number().positive().integer().required(),
    casual: number().positive().integer().required(),
  });

  const saveData = (val,actions) => {
    console.log(val);
    axios
      .post("leave/setTotalAllowedLeaves", val)
      .then(() => {
        actions.resetForm()
        toast.success("Updated succesffuly")})
      .catch((err) => {
        console.log(err);
        toast.error("something went wrong!");
      });
  };

  const { handleChange, handleBlur, handleSubmit, errors, touched } = useFormik(
    {
      initialValues: {
        annual: "",
        sick: "",
        casual: "",
      },
      onSubmit: (val,actions) => saveData(val,actions),
      validationSchema: validationScheme,
    }
  );
  return (
    <form onSubmit={handleSubmit}>
      <Box 
         sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap:1
        }}
      >
        <Typography fontWeight={"bold"}>Update allowed leaves</Typography>
        {console.log(errors.annual, "0000999")}
        {console.log(Boolean(errors.annual) && touched.annual)}
        {console.log(touched.annual, "touch")}
        <TextField
          helperText={
            Boolean(errors.annual) && touched.annual ? errors.annual : null
          }
          error={Boolean(errors.annual) && touched.annual}
          name="annual"
          onChange={handleChange}
          type="number"
          label="annual leave"
          onBlur={handleBlur}
        />
        <TextField
          helperText={Boolean(errors.sick) && touched.sick ? errors.sick : null}
          error={Boolean(errors.sick) && touched.sick}
          name="sick"
          onChange={handleChange}
          type="number"
          label="sick leave"
          onBlur={handleBlur}
        />
        <TextField
          helperText={
            Boolean(errors.casual) && touched.casual ? errors.casual : null
          }
          error={Boolean(errors.casual) && touched.casual}
          onChange={handleChange}
          name="casual"
          type="number"
          label="casual leave"
          onBlur={handleBlur}
        />
      <Button variant="contained" type="submit">
        Submit
      </Button>
      </Box>

    </form>
  );
}
