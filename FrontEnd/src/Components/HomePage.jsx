import React from "react";
import { Grid, Box, Button, Typography, Container } from "@mui/material";
import { Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        style={{ height: "80vh" }}
      >
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Sign up and start your journey with us.
          </Typography>
          <Buttons />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <img
              src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=2942&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Aesthetic workspace"
              style={{ width: "100%", maxWidth: "50rem", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const Buttons = () => {
  return (
    <Box mt={3}>
      <Link to="/signup">
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          style={{
            backgroundColor: "#009688",
            color: "white",
            "&:hover": {
              backgroundColor: "#007965",
            },
          }}
        >
          Signup
        </Button>
      </Link>
      <Link to="/login">
        <Button
          variant="outlined"
          color="primary"
          style={{
            border: " 1px solid #009688",
            color: "#009688",
            "&:hover": {
              backgroundColor: "#007965",
            },
          }}
        >
          Login
        </Button>
      </Link>
    </Box>
  );
};

export default HomePage;
