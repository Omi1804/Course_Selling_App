import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardMedia,
  CardActions,
  Button,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "../store/atom/courses";
import {
  courseTitle,
  coursePrice,
  courseImage,
  courseDescription,
} from "../store/selector/course";

const EditCourse = () => {
  const { courseId } = useParams();
  const setCourse = useSetRecoilState(courseState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCourse = async () => {
      try {
        const response = await axios
          .get(`${BASE_URL}courses/${courseId}`, {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            setCourse({ course: response.data.course });
            setLoading(false);
          });
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    updateCourse();
  }, [courseId, setCourse]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Snackbar open={true} message={`Error: ${error}`} />;
  }

  return (
    <>
      <GrayTopper />
      <Grid
        container
        spacing={4}
        style={{ padding: "2rem", display: "flex", justifyContent: "center" }}
      >
        <Grid
          item
          lg={6}
          md={12}
          sm={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <CourseCard />
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          sm={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <UpdateCourse />
        </Grid>
      </Grid>
      <Button
        size="large"
        style={{
          marginBlock: "2rem",
          backgroundColor: "#009688",
          color: "white",
          position: "relative",
          left: "45%",
          "&:hover": {
            backgroundColor: "#007965",
          },
        }}
        onClick={() => {
          navigate("/courses");
        }}
      >
        All Courses
      </Button>
    </>
  );
};

function GrayTopper() {
  const title = useRecoilValue(courseTitle);
  return (
    <div
      style={{
        height: 250,
        background: "#212121",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography style={{ color: "white", fontWeight: 600 }} variant="h3">
        {title}
      </Typography>
    </div>
  );
}

function CourseCard() {
  const navigate = useNavigate();
  const courseDetails = useRecoilValue(courseState);
  const title = useRecoilValue(courseTitle);
  const description = useRecoilValue(courseDescription);
  const imageLink = useRecoilValue(courseImage);

  const deleteCourse = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}admin/course/${courseDetails.course._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.message === "Course successfully deleted.") {
        navigate("/courses");
      } else {
        console.log("Course could not be deleted");
      }
    } catch (error) {
      console.error("There was a problem:", error);
    }
  };

  return (
    <Card elevation={3} style={{ maxWidth: "345px" }}>
      <CardMedia
        component="img"
        alt="Course Image"
        height="140"
        image={imageLink}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Price />
      </CardContent>

      <CardActions>
        <Button style={{ color: "red" }} onClick={deleteCourse}>
          Delete This Course
        </Button>
      </CardActions>
    </Card>
  );
}

function Price() {
  const price = useRecoilValue(coursePrice);
  return (
    <Typography variant="body2" pt={2} style={{ color: "#01B7FF" }}>
      For Just - {price}$
    </Typography>
  );
}

function UpdateCourse() {
  const [courseDetails, setCourseDetails] = useRecoilState(courseState);
  const [title, setTitle] = useState(courseDetails.course.title);
  const [description, setDescription] = useState(
    courseDetails.course.description
  );
  const [imageLink, setImageLink] = useState(courseDetails.course.imageLink);
  const [price, setPrice] = useState(courseDetails.course.price);

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
      default:
        break;
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}admin/course/${courseDetails.course._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            description,
            imageLink,
            price,
            published: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const data = await response.json();
      setCourseDetails({ course: data.course });
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <Card elevation={3} style={{ maxWidth: 500, padding: "1rem" }}>
      <Typography variant="h5" mb={3} gutterBottom>
        Update the Course
      </Typography>
      <TextField
        name="title"
        value={title}
        style={{ marginBottom: 10 }}
        fullWidth
        label="Title"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        name="description"
        value={description}
        style={{ marginBottom: 10 }}
        fullWidth
        label="Description"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        value={imageLink}
        name="imageLink"
        style={{ marginBottom: 10 }}
        fullWidth
        label="Image link"
        variant="outlined"
        onChange={handleChange}
      />
      <TextField
        value={price}
        name="price"
        style={{ marginBottom: 10 }}
        fullWidth
        label="Price"
        variant="outlined"
        onChange={handleChange}
      />
      <CardActions>
        <Button variant="outlined" onClick={handleUpdate}>
          Update Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default EditCourse;
