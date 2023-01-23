import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useStates from "../assets/helpers/useStates";

import "../../public/css/home.css";

function Home(props) {
  const { loggedIn, setLoggedIn } = props;
  // let l = useStates("loggedIn");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/login")).json();
      if (data.message !== "No entries found") {
        setLoggedIn({ loggedIn, ...data });
        /*  console.log(l);
        console.log(data);
        l = { ...data }; */
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
      <Header {...{ loggedIn, setLoggedIn }} />
    </div>
  );
}

export default Home;
