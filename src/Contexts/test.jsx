import { TextField } from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";

export default function test() {
  const [first, setfirst] = useState(true);
  return (
    <Formik initialValues={{ email: "" }} onSubmit={(val) => console.log(val)}>
      {({ handleChange, handleSubmit, errors }) => (
        <>
          <TextField
            autoFocus
            margin="dense"
            id="fullName"
            name="FullName"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleInputChange}
          />
          {form === "branch" ? (
            <>
              <TextField
                margin="dense"
                id="latitude"
                label="latitude"
                type="text"
                fullWidth
                variant="standard"
              />

              <TextField
                margin="dense"
                id="longitude"
                label="longitude"
                type="text"
                fullWidth
                variant="standard"
              />
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                name="email"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={handleInputChange}
              />

              <TextField
                margin="dense"
                id="contact"
                name="contactNumber"
                label="contact number "
                fullWidth
                variant="standard"
                onChange={handleInputChange}
              />
            </>
          )}
        </>
      )}
    </Formik>
  );
}
