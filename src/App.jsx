import { useEffect, useState } from "react";

function App() {
  const [res, setRes] = useState("");

  return <div className='App'>Hello {res.name} </div>;
}

export default App;
