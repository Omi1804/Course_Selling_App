import React, { useState, useEffect } from "react";
import { Typography, AppBar, useTheme, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/fevicon.png";
import userState from "../store/atom/user.js";
import { useRecoilValue } from "recoil";

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // const [email, setEmail] = useState(null);
  const { email } = useRecoilValue(userState);

  // useEffect(() => {
  //   fetch("http://localhost:3000/admin/me", {
  //     method: "GET",
  //     headers: {
  //       authorization: "Bearer " + localStorage.getItem("token"),
  //     },
  //   }).then((response) => {
  //     response.json().then((responseData) => {
  //       console.log(responseData);
  //       if (responseData.message != "Invalid token!") {
  //         setEmail(responseData.email);
  //       } else {
  //         setEmail(null);
  //         console.log(responseData.message);
  //       }
  //     });
  //   });
  // }, [localStorage.getItem("token")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <AppBar
        position="static"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: ".5rem 1rem",
          background: "linear-gradient(45deg, #009688, #004d40)", // gradient background
          boxShadow: theme.shadows[5],
          transition: "all 0.3s", // smooth transition for hover effects
          "&:hover": {
            transform: "scale(1.02)", // subtle scale on hover
          },
        }}
      >
        <div
          className="companyLogo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem", // gap between items
          }}
        >
          <img
            src={logo}
            alt="Company Logo"
            style={{
              width: "3rem",
              height: "100%",
              objectFit: "contain",
              borderRadius: "20%", // circular logo
              boxShadow: theme.shadows[3], // add shadow
            }}
          />
          <Typography
            align="center"
            ml={1}
            variant="h5"
            color="white"
            style={{
              fontSize: "1.5rem",
              fontWeight: "500",
            }}
          >
            Course Lelo
          </Typography>
        </div>
        {email == null ? (
          <div className="signinButtons">
            <Link to="/signup">
              <Button
                size="large"
                variant="filled"
                style={{
                  backgroundColor: "#002D23",
                }}
              >
                SignUp
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="large"
                variant="filled"
                style={{
                  backgroundColor: "#002D23",
                  marginInline: "1rem 2rem",
                }}
              >
                Login
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className="logOutButtons"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              align="center"
              mr={1}
              variant="h5"
              color="white"
              style={{
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              {email}
            </Typography>
            <Button
              size="large"
              variant="filled"
              style={{
                backgroundColor: "#002D23",
              }}
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        )}
      </AppBar>
    </div>
  );
};

export default Header;
