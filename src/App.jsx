/* istanbul ignore file */
import React from "react";
import "./App.css";
import Home from "./pages/Home/Home.jsx";

function App() {
  return (
    <>
      <div className="background"></div>
      <section className="main-page">
        <Home />
      </section>
    </>
  );
}

export default App;