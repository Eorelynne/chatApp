import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import useStates from "../src/assets/helpers/useStates.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/css/appStyles.css";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import MyPage from "./views/MyPage";
import NotFound from "./views/NotFound";

function App() {
  let l = useStates("loggedIn", {
    id: 0,
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    role: ""
  });

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/my-page' element={<MyPage />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
