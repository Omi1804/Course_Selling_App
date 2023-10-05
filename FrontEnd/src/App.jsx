import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Header from "./Components/Header";
import Login from "./Components/Login";
import AddCourse from "./Components/AddCourse";
import Courses from "./Components/Courses";
import EditCourse from "./Components/EditCourse";
import HomePage from "./Components/HomePage";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

const App = () => {
  return (
    <RecoilRoot
      style={{ backgroundColor: "#E8F9F5", width: "100vw", minHeight: "100vh" }}
    >
      <BrowserRouter>
        <Header />
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
