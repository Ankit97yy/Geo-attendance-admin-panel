import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Paper, Typography } from "@mui/material";
// import AppDrawer from "../../AppDrawer";
import MapImg from "../../assets/ankit.png";
import { ContextForUser } from "../../Contexts/UserContext";
import axios from "axios";
import { Formik } from "formik";
import { object, string } from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function LogIn() {
  const { setuserData } = React.useContext(ContextForUser);

  const logIn = (val) => {
    axios
      .post("http://localhost:3001/auth/logIn", {
        email: val.email,
        password: val.password,
      })
      .then((res) => {
       
        if(res.data.admin==='yes'){
        localStorage.setItem("accessToken", res.data.accessToken);
        setuserData((prev) => {
          return {
            ...prev,
            name: res.data.name,
            signedIn: true,
            accessToken: res.data.accessToken,
          };
        });
      }
      else if(res.data.admin==='no') toast.error("not an admin")
      })
      .catch(err=>{
        if(!err.response.data?.user || !err.response.data?.password) toast.error("inavalid credentials")
        console.log(err)
      })
      
  };
  const validationScheme = object({
    email: string().email().required(),
    password: string().required(),
  });
  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100vh",
        backgroundColor: "#1976d2",
      }}
    >
      <ToastContainer/>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "70vh",
          width: "70vw",
          borderRadius: 10,
        }}
      >
        <img width={"800px"} src={MapImg} alt="lllll" />
        <Box
          component="form"
          sx={{
            gap: 2,
            height: "100vh",
            width: "650px",
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
        >
          <div style={{}}>
            {/* <Lottie
            width="100px"
            height="100px"
            animationData={anime}
            loop={true}
          /> */}
          </div>
          <Typography>lalalal</Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(val) => logIn(val)}
            validationSchema={validationScheme}
          >
            {({ handleSubmit, handleChange, errors,touched }) => (
              <>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Enter email"
                  name="email"
                  variant="outlined"
                  onChange={handleChange("email")}
                  helperText={touched.email?errors.email:null}
                  error={touched.email?Boolean(errors.email):false}
                />
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Enter Password"
                  name="password"
                  variant="outlined"
                  onChange={handleChange("password")}
                  helperText={touched.password?errors.password:null}
                  error={touched.password?Boolean(errors.password):false}
                />
                <Button onClick={handleSubmit} variant="contained">
                  Log In
                </Button>
              </>
            )}
          </Formik>
          {/* <AppDrawer /> */}
        </Box>
      </Paper>
    </Box>
  );
}
