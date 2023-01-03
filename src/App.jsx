import { useEffect, useState } from "react";

function App() {
  const [res, setRes] = useState("");

  useEffect(() => {
    (async () => {
      let data = await (await fetch("/api/")).json();
      console.log(data);
      setRes(data);
    })();
  }, []);

  return <div className='App'>Hello {res.name} </div>;
}

export default App;
