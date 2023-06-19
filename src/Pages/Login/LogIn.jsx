import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment, Paper, Typography } from "@mui/material";
// import AppDrawer from "../../AppDrawer";
import MapImg from "../../assets/ankit.png";
import { ContextForUser } from "../../Contexts/UserContext";
import axios from "axios";
import { Formik } from "formik";
import { object, string } from "yup";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
export default function LogIn() {
  const { setuserData } = React.useContext(ContextForUser);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const logIn = (val) => {
    axios
      .post("http://localhost:3001/auth/logIn", {
        email: val.email,
        password: val.password,
      })
      .then((res) => {
        if (res.data.admin === "yes") {
          localStorage.setItem("accessToken", res.data.accessToken);
          setuserData((prev) => {
            return {
              ...prev,
              id:res.data.id,
              name: res.data.name,
              signedIn: true,
              accessToken: res.data.accessToken,
              profilePicture:res.data.profile_picture
            };
          });
        } else if (res.data.admin === "no") toast.error("not an admin");
      })
      .catch((err) => {
        if (!err.response.data?.user || !err.response.data?.password)
          toast.error("inavalid credentials");
        console.log(err);
      });
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
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "70vh",
          width: "70vw",
          borderRadius: 10,
          padding:10
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
          <Typography variant="h4">Geo Attendance App</Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(val) => logIn(val)}
            validationSchema={validationScheme}
          >
            {({ handleSubmit, handleChange, errors, touched }) => (
              <>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Enter email"
                  name="email"
                  variant="outlined"
                  onChange={handleChange("email")}
                  helperText={touched.email ? errors.email : null}
                  error={touched.email ? Boolean(errors.email) : false}
                 
                />

                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  label="Enter Password"
                  name="password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange("password")}
                  helperText={touched.password ? errors.password : null}
                  error={touched.password ? Boolean(errors.password) : false}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button fullWidth sx={{fontSize:15}} onClick={handleSubmit} variant="contained">
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
