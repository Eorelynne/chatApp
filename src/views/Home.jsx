import React from "react";
import { useEffect, useState } from "react";
import Header from "../components/Header";

import styles from "../../public/css/home.css";

function Home() {
  const [res, setRes] = useState("");

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
      <div>
        <p>{res.name}</p>
      </div>
    </div>
  );
}

export default Home;
