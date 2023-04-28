import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { string, object, number } from "yup";

import { Formik } from "formik";
import axios from "axios";

export default function AddBranch({ open, handleClose }) {
  const handleSubmit = () => {
    if (formikRef.current) {
      console.log(formikRef.current);
      formikRef.current.submitForm();
        handleClose();
    }
  };

  const saveData=(val)=>{
    axios.post("branch/addBranch",{...val})
    .then(res=>{
        console.log(res);
      })
      .catch(err=>{console.log(err)});
  }

  const formikRef = React.useRef(null);

  const validationScheme = object({
    latitude: number().required(),
    longitude: number().required(),
    location_name: string().required(),
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Branch</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              latitude: "",
              longitude: "",
              location_name: "",
            }}
            onSubmit={(val) => saveData(val)}
            innerRef={formikRef}
            validationSchema={validationScheme}
          >
            {({ handleChange, errors }) => (
              <>
                <>
                  <TextField
                    margin="dense"
                    id="latitude"
                    label="latitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("latitude")}
                  />
                {errors.latitude && errors.latitude}

                  <TextField
                    margin="dense"
                    id="longitude"
                    label="longitude"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("longitude")}

                  />
                {errors.longitude && errors.longitude}

                  <TextField
                    margin="dense"
                    id="location"
                    label="location name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={handleChange("location_name")}

                  />
                {errors.location && errors.location}

                </>
              </>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Branch</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
