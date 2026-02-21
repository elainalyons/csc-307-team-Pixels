// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Calendar from "./calendar";
import Table from "./Table";

function MyApp() {
  const [entries, setEntries] = useState([]);

  function fetchEntries() {
    const promise = fetch("http://localhost:8000/entries");
    return promise;
  }

  useEffect(() => {
    fetchEntries()
      .then((res) => res.json())
      .then((json) => setEntries(json["entries"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/calendar">Calendar</Link>
      </nav>

      <Routes>
        <Route
          path="/" element={<Table journalData={entries} />}
        />
        <Route path="/calendar" element={<Calendar CalendarData = {entries} />} />
      </Routes>
    </div>
  );
}

export default MyApp;
