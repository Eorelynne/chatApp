import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import useStates from "../src/utilities/useStates.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/css/appStyles.css";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import MyPage from "./views/MyPage";
import NotFound from "./views/NotFound";
import ConversationPit from "./views/ConversationPit";
import Admin from "./views/Admin";

function App() {
  let l = useStates("appState", {
    loggedIn: {
      id: 0,
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      role: ""
    },
    newMessage: {
      content: "",
      time: 0,
      usersConversationsId: 0,
      conversationId: 0,
      senderUserId: 0,
      userName: "",
      senderUserRole: ""
    }
  });

  let a = useStates("activeUsers", []);

  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/my-page' element={<MyPage />} />
          <Route path='/conversation-pit' element={<ConversationPit />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
