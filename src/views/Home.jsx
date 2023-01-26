import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useStates from "../utilities/useStates";

import "../../public/css/home.css";

function Home() {
  let l = useStates("loggedIn");
  const navigate = useNavigate();
  console.log("l i home");
  console.log(l);
  useEffect(() => {
    if (l.id === 0 || !l.id) {
      (async () => {
        let data = await (await fetch("/api/login")).json();
        if (data.message !== "No entries found" && !data.error) {
          Object.assign(l, data);
          console.log(l);
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
