import { useEffect, useState } from "react";

function App() {
  const [res, setRes] = useState("");

  const startSSE = () => {
    let sse = new EventSource("/api/sse");

    sse.addEventListener("connect", message => {
      let data = JSON.parse(message.data);
      console.log("[connect]", data);
    });

    sse.addEventListener("disconnect", message => {
      let data = JSON.parse(message.data);
      console.log("[disconnect]", data);
    });

    sse.addEventListener("new-message", message => {
      let data = JSON.parse(message.data);
      console.log("[new-message]", data);
    });
  };

  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/")).json();
      console.log(data);
      setRes(data);
    })();
  }, []);

  useEffect(() => {
    startSSE();
  }, []);

  return <div className='App'>Hello {res.name} </div>;
}

export default App;
