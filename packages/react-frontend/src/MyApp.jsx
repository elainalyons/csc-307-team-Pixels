// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Calendar from "./calendar";
import Table from "./Table";
import NewEntryForm from "./NewEntryForm";
import "./MyApp.css";

function MyApp() {
  const [entries, setEntries] = useState([]);

  function updateList(entry) {
    postEntry(entry)
      .then((res) => {
        if (res.status === 201) return res.json();
      })
      .then((json) => {
        setEntries((prevEntries) =>
          [...prevEntries, json].sort(
            (a, b) =>
              new Date(b.date || b.createdAt) -
              new Date(a.date || a.createdAt)
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchEntries() {
    const promise = fetch("http://localhost:8000/entries");
    return promise;
  }

  function postEntry(entry) {
    const promise = fetch("http://localhost:8000/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

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

  //FAKE Data for FAKE backend response Below since Mongo isnt working
  /*   useEffect(() => {
    setEntries([
      {
        _id: "test1",
        title: "Test Entry",
        body: "Hello from fake data",
        createdAt: "2026-02-18T00:00:00.000Z"
      },
      {
        _id: "test2",
        title: "Second Entry",
        body: "Another one",
        createdAt: new Date().toISOString()
      }
    ]);
  }, []); */
  //^^REMOVE once mongo connection works

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
      <div className="left-panel">
        <NewEntryForm handleSubmit={updateList} />
        <h1>Previous Journal Entries</h1>
        <Table journalData={entries} />
      </div>
      <div className="right-panel">
        {/* Optional later: stats, filters, mood chart, etc. */}
      </div>
    </div>
  );
}

export default MyApp;
