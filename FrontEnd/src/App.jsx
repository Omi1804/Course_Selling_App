import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Header from "./Components/Header";
import Login from "./Components/Login";
import AddCourse from "./Components/AddCourse";
import Courses from "./Components/Courses";
import EditCourse from "./Components/EditCourse";
import HomePage from "./Components/HomePage";
import { BASE_URL } from "./config.js";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import userState from "./store/atom/user";

const App = () => {
  return (
    <RecoilRoot
      style={{ backgroundColor: "#E8F9F5", width: "100vw", minHeight: "100vh" }}
    >
      <BrowserRouter>
        <Header />
        <InitUser />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<EditCourse />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;

function InitUser() {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`${BASE_URL}admin/me`, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = response.data;

      if (data.email) {
        setUser(data.email);
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return <></>;
}
