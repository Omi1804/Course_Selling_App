import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Box,
  Container,
  CardActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [course, setCourse] = useState(null);
  let flag = false;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/admin/course", {
      method: "GET",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      response.json().then((responseData) => {
        if (responseData.message != "Invalid token!") {
          setCourse(responseData);
        } else {
          flag = true;
        }
      });
    });
  }, []);

  const handleEditCourse = (e) => {
    navigate(`/courses/${e.target.id}`);
  };

  return (
    <Container maxWidth="lg">
      {course == null ? (
        <Typography align="center">loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          {course.map((item) => (
            <Grid item key={item._id} mt={4}>
              <Card style={{ width: "345px", height: "370px" }}>
                <CardMedia
                  component="img"
                  alt="Course Image"
                  height="140"
                  image={item.imageLink}
                />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description.substr(0, 150) + "..."}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button id={item._id} size="small" onClick={handleEditCourse}>
                    Edit Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Button
        size="large"
        style={{
          marginBlock: "2rem",
          backgroundColor: "#009688",
          color: "white",
          position: "relative",
          left: "50%",
          "&:hover": {
            backgroundColor: "#007965",
          },
        }}
        onClick={() => {
          navigate("/add-course");
        }}
      >
        Add Courses
      </Button>
    </Container>
  );
};

export default Courses;
