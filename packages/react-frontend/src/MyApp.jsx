// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
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

  return (
    <div className="container">
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
