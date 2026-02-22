// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import Table from "./Table";
import NewEntryForm from "./NewEntryForm";

function MyApp() {
  const [entries, setEntries] = useState([]);

  function updateList(entry) {
    postEntry(entry)
      .then((res) => {
        if (res.status === 201) return res.json();
      })
      .then((json) => setEntries([...entries, json]))
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
      <NewEntryForm handleSubmit={updateList} />
      <Table journalData={entries} />
    </div>
  );
}

export default MyApp;
