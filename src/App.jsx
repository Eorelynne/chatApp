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
import ConversationPit from "./views/ConversationPit";

function App() {
  const [loggedIn, setLoggedIn] = useState({
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
          <Route path='/' element={<Home {...{ loggedIn, setLoggedIn }} />} />
          <Route
            path='/login'
            element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path='/register'
            element={<Register {...{ loggedIn, setLoggedIn }} />}
          />
          <Route
            path='/my-page'
            element={<MyPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path='/conversation-pit'
            element={<ConversationPit {...{ loggedIn, setLoggedIn }} />}
          />
          <Route
            path='/*'
            element={<NotFound {...{ loggedIn, setLoggedIn }} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
