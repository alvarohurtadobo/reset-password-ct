import React, { useState } from "react";
import "./App.css";
import ctLogo from "./assets/ct.png";
import { Grid, TextField, AppBar, Typography, Button } from "@material-ui/core";

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let token = urlParams.get("token");
  let id = urlParams.get("id");

  const [error, setError] = useState({ password: "", confirmPassword: "" });
  const [response, setResponse] = useState({ success: "", failure: "" });
  let newPassword = "";
  let confirmPassword = "";

  const resetPasswordAttempt = () => {
    if (newPassword.length < 8) {
      // console.log("Password is too short", newPassword);
      setError({ password: "Password is too short", confirmPassword: "" });
    } else {
      if (newPassword !== confirmPassword) {
        // console.log("Passwords do not match", confirmPassword);
        setError({ password: "", confirmPassword: "Passwords do not match" });
      } else {
        let bodyPayload = JSON.stringify({ password: newPassword });
        // let url = `http://localhost:3000/api/v1/user/resetPassword/${id}`;
        let url = `http://ct.otfpos.com:3000/api/v1/user/resetPassword/${id}`;
        // console.log("URL", url);
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: bodyPayload,
        };
        fetch(
          // `http://ct.otfpos.com:3000/api/v1/user/resetPassword/${id}`,
          url,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log("data", data);
            // {
            //   "error": false,
            //   "status": 201,
            //   "body": {
            //     "success": true
            //   }
            // }
            if (data && data.body && data.body.success) {
              console.log("Success");
              setResponse({ success: "Password updated successfully" });
            }
          })
          .catch((error) => {
            console.log("Unable to update, try again later");
            setResponse({
              failure: "Unable to update, try again later",
            });
          });
      }
    }
  };
  return (
    <div className="App">
      <AppBar
        position="static"
        style={{
          backgroundColor: "black",
          justifyContent: "left",
          display: "flex",
          paddingLeft: "20px",
        }}
      >
        <img
          src={ctLogo}
          alt="OTF Control Tower Logo"
          height="100px"
          width="100px"
        ></img>
      </AppBar>
      {id && token && (
        <Grid container xs={12} justify="center">
          <Grid container item xs={12} justify="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h6" style={{ marginTop: "100px" }}>
                Enter your new password
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="New password"
                type="password"
                style={{ marginTop: "20px" }}
                error={error.password}
                helperText={error.password}
                onChange={(event) => {
                  if (error.password !== "") {
                    setError({ ...error, password: "" });
                  }
                  // console.log("New password", event.target.value);
                  newPassword = event.target.value;
                }}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="Confirm new password"
                type="password"
                style={{ marginTop: "10px" }}
                error={error.confirmPassword}
                helperText={error.confirmPassword}
                onChange={(event) => {
                  if (error.confirmPassword !== "") {
                    setError({ ...error, confirmPassword: "" });
                  }
                  // console.log("Confirm password", event.target.value);
                  confirmPassword = event.target.value;
                }}
              ></TextField>
            </Grid>
          </Grid>
          {response.success && (
            <Typography
              variant="caption"
              color="primary"
              style={{ margin: "10px" }}
            >
              {response.success}
            </Typography>
          )}
          {response.failure && (
            <Typography
              variant="caption"
              color="error"
              style={{ margin: "10px" }}
            >
              {response.failure}
            </Typography>
          )}
          <Grid container item xs={12} justify="center">
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                style={{ marginTop: "50px" }}
                color="primary"
                onClick={resetPasswordAttempt}
              >
                Update password
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default App;
