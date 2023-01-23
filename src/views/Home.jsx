import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useStates from "../utilities/useStates";

import "../../public/css/home.css";

function Home(props) {
  const { loggedIn, setLoggedIn } = props;
  let l = useStates("loggedIn");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/login")).json();
      if (data.message !== "No entries found" && !data.error) {
        // setLoggedIn({ data });
        // console.log(loggedIn);
        l = { ...data };
        console.log(l);
      }
    })();
  }, []);

  /*   useEffect(() => {
    if (l.id !== 0 && l !== undefined) {
      console.log("l");
      console.log(l);
      setTimeout(() => {
        navigate("/my-page");
      }, 3000);
    }
  }, [l]); */
  return (
    <div className='home'>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </div>
  );
}

export default Home;
