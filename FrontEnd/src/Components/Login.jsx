import React, { useState } from "react";
import {
  Typography,
  AppBar,
  Container,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import userState from "../store/atom/user";
import axios from "axios";
import { BASE_URL } from "../config";

const Login = () => {
  //------------------------------VARIABLES------------------------------//
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  //------------------------------HANDLERS------------------------------//
  const handleChange = (e) => {
    e.target.name == "email"
      ? setEmail(e.target.value)
      : setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}admin/login`, {
        email: email,
        password: password,
      });

      const responseData = response.data;
      if (responseData.message === "Logged in successfully") {
        const token = responseData.token;
        localStorage.setItem("token", token);
        setUser({ email: email });
        navigate("/courses");
      }
    } catch (error) {
      if (error.response.data.message === "Please Signup First!") {
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate("/signup");
        }, 2000);
      }
    }
  };

  //------------------------------COMPONENTS------------------------------//
  return (
    <Container
      maxWidth="sm"
      component={Box}
      boxShadow={3}
      bgcolor="white"
      mt={8}
      p={3}
      borderRadius={2}
    >
      <CssBaseline />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          style: {
            backgroundColor: "#004d40",
            color: "white",
            borderRadius: "8px",
          },
        }}
        message="Please Sign in first !!!"
        action={
          <Button
            size="small"
            style={{ color: "#009688" }}
            onClick={() => setOpenSnackbar(false)}
          >
            Close
          </Button>
        }
      />
      <AppBar
        position="relative"
        elevation={0}
        style={{
          background: "linear-gradient(45deg, #009688, #004d40)",
          marginBottom: "2rem",
          borderRadius: "8px 8px 0 0",
          boxShadow: "none",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", py: 1, px: 2 }}
        >
          Log In
        </Typography>
      </AppBar>

      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Enter your Email
        </Typography>
        <TextField
          name="email"
          id="email-input"
          label="Email"
          fullWidth
          variant="outlined"
          mb={2}
          onChange={handleChange}
        />
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Enter your Password
        </Typography>
        <TextField
          name="password"
          id="password-input"
          label="Password"
          fullWidth
          variant="outlined"
          type="password"
          onChange={handleChange}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Remember Me"
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        style={{
          backgroundColor: "#009688",
          color: "white",
          "&:hover": {
            backgroundColor: "#007965",
          },
        }}
        onClick={handleSubmit}
      >
        Log In
      </Button>
    </Container>
  );
};

export default Login;
