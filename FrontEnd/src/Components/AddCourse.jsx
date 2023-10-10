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

const AddCourse = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "price":
        setPrice(e.target.value);
        break;
      case "imageLink":
        setImageLink(e.target.value);
        break;
      case "published":
        setPublished(e.target.value);
        break;
    }
  };

  const handleSubmit = () => {
    fetch("http://localhost:3000/admin/course", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink,
        published: published,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      response.json().then((responseData) => {
        if (responseData.message == "Course Created successfully") {
          console.log("Course Created successfully");
          navigate("/courses");
        } else {
          console.log("Course created error");
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
      mt={2}
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
          marginBottom: "1rem",
          borderRadius: "8px 8px 0 0",
          boxShadow: "none",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", py: 1, px: 2 }}
        >
          Add Courses
        </Typography>
      </AppBar>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Title Of Course
        </Typography>
        <TextField
          name="title"
          id="title-input"
          label="Title"
          fullWidth
          variant="outlined"
          mb={2}
          onChange={handleChange}
        />
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Description Of Course
        </Typography>
        <TextField
          name="description"
          id="description-input"
          label="Description"
          fullWidth
          variant="outlined"
          type="text"
          onChange={handleChange}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Price Of Course
        </Typography>
        <TextField
          name="price"
          id="price-input"
          label="Price"
          fullWidth
          variant="outlined"
          type="number"
          onChange={handleChange}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Image Link Of Course
        </Typography>
        <TextField
          name="imageLink"
          id="imageLink-input"
          label="Image Link"
          fullWidth
          variant="outlined"
          type="text"
          onChange={handleChange}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="medium" mb={1}>
          Published
        </Typography>
        <TextField
          name="published"
          id="published-input"
          label="Published"
          fullWidth
          variant="outlined"
          type="boolean"
          onChange={handleChange}
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
        Add Course
      </Button>
    </Container>
  );
};

export default AddCourse;
