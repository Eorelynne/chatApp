import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useStates from "../utilities/useStates";
import "../../public/css/home.css";

function Home() {
  let l = useStates("appState");

  useEffect(() => {
    if (l.loggedIn.id === 0 || !l.loggedIn.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (!data.error) {
          l.loggedIn.id = data.id;
          l.loggedIn.firstName = data.firstName;
          l.loggedIn.lastName = data.lastName;
          l.loggedIn.userName = data.userName;
          l.loggedIn.email = data.email;
          l.loggedIn.role = data.role;
        }
      })();
    }
  }, []);

  return (
    <div className='home'>
      <Header />
    </div>
  );
}

export default Home;
