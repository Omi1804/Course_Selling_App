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
} from "@mui/material";

const EditCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/courses/${courseId}`, {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Snackbar open={true} message={`Error: ${error}`} />;
  }

  return (
    <>
      <GrayTopper title={course.title} />
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
          <CourseCard course={course} />
        </Grid>
        <Grid
          item
          lg={6}
          md={12}
          sm={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <UpdateCourse course={course} setCourse={setCourse} />
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

function GrayTopper({ title }) {
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

function CourseCard({ course }) {
  const navigate = useNavigate();
  const deleteCourse = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/admin/course/" + course._id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.message === "Course successfully deleted.") {
        window.location.href = "/courses";
      } else {
        console.log("Course could not be deleted");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <Card elevation={3} style={{ maxWidth: "345px" }}>
      <CardMedia
        component="img"
        alt="Course Image"
        height="140"
        image={course.imageLink}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.description}
        </Typography>
        <Typography variant="body2" pt={2} style={{ color: "#01B7FF" }}>
          For Just - {course.price}$
        </Typography>
      </CardContent>

      <CardActions>
        <Button style={{ color: "red" }} onClick={deleteCourse}>
          Delete This Course
        </Button>
      </CardActions>
    </Card>
  );
}

function UpdateCourse({ course, setCourse }) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [imageLink, setImageLink] = useState(course.imageLink);
  const [price, setPrice] = useState(course.price);

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
    }
  };

  const handleUpdate = () => {
    fetch("http://localhost:3000/admin/course/" + course._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title: title,
        description: description,
        imageLink: imageLink,
        price: price,
        published: true,
      }),
    }).then((response) => {
      response.json().then((data) => {
        setCourse(data.course);
      });
    });
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
