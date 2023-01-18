import React from "react";
import { useEffect, useState } from "react";
import Header from "../components/Header";

import "../../public/css/home.css";

function Home() {
  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/")).json();
      console.log(data);
      setRes(data);
    })();
  }, []);

  return (
    <div className='home'>
      <Header />
    </div>
  );
}

export default Home;
