import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/css/appStyles.css";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import MyPage from "./views/MyPage";
import NotFound from "./views/NotFound";

function App() {
  const [user, setUser] = useState({});

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login {...{ user, setUser }} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/my-page' element={<MyPage />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
