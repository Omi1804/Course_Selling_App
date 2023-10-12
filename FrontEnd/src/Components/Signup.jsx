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
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import userState from "../store/atom/user.js";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

const Signup = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const { email } = useRecoilValue(userState);
  // const { password } = useRecoilValue(userState);

  const [user, setUser] = useRecoilState(userState);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   e.target.name == "email"
  //     ? setEmail(e.target.value)
  //     : setPassword(e.target.value);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((responseData) => {
        if (responseData.message == "Admin already exists!") {
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      });
    });
  };

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
        message="Signed up successfully! Now login."
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
          Sign In
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
        onClick={() => handleSubmit()}
      >
        Sign In
      </Button>
    </Container>
  );
};

export default Signup;
