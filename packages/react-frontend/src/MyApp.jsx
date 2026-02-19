// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import Table from "./Table";
// import Form from "./Form";

function MyApp() {
  const [entries, setEntries] = useState([]);

  // function updateList(person) {
  //   postUser(person)
  //     .then((res) => {
  //       if (res.status === 201) return res.json();
  //     })
  //     .then((json) => setEntries([...entries, json]))
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  function fetchEntries() {
    const promise = fetch("http://localhost:8000/entries");
    return promise;
  }

  // function postUser(entry) {
  //   const promise = fetch("http://localhost:8000/entries", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(entry)
  //   });

  //   return promise;
  // }

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
      <Table journalData={entries} />
    </div>
  );
}

export default MyApp;
