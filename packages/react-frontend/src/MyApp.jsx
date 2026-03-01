// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Calendar from "./calendar";
import Table from "./Table";
import NewEntryForm from "./NewEntryForm";
import "./MyApp.css";
import Login from "./Login";



function MyApp() {
  const [entries, setEntries] = useState([]);
  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  const API_PREFIX = "http://localhost:8000";

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
    return fetch(`${API_PREFIX}/entries`, {
      headers: addAuthHeader(),
    });
  }

  function postEntry(entry) {
    return fetch(`${API_PREFIX}/entries`, {
      method: "POST",
      headers: addAuthHeader({ "Content-Type": "application/json" }),
      body: JSON.stringify(entry),
    });
  }

  function deleteEntry(id) {
    return fetch(`${API_PREFIX}/entries/${id}`, {
      method: "DELETE",
      headers: addAuthHeader(),
    });
  }

  function putEntry(id, updates) {
    return fetch(`${API_PREFIX}/entries/${id}`, {
      method: "PUT",
      headers: addAuthHeader({ "Content-Type": "application/json" }),
      body: JSON.stringify(updates),
    });
  }

  function handleDelete(id) {
    // optional confirm pop-up
    const ok = window.confirm(
      "Delete this journal entry? This cannot be undone."
    );
    if (!ok) return;

    deleteEntry(id)
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        // Remove from state so UI updates instantly
        setEntries((prev) => prev.filter((e) => e._id !== id));
      })
      .catch((error) => console.log(error));
  }


  function loginUser(creds) {
    const promise = fetch(`${API_PREFIX}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((payload) => setToken(payload.token));
          setMessage(`Login successful; auth token saved`);
        } else {
          setMessage(
            `Login Error ${response.status}: ${response.data}`
          );
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
      });

    return promise;
  }

  function signupUser(creds) {
    return fetch(`${API_PREFIX}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    })
      .then(async (response) => {
        if (response.status === 201) {
          const payload = await response.json();
          setToken(payload.token);
          setMessage(`Signup successful; auth token saved`);
        } else {
          const txt = await response.text();
          setMessage(`Signup Error ${response.status}: ${txt}`);
        }
      })
      .catch((error) => setMessage(`Signup Error: ${error}`));
  }

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`
      };
    }
  }

  function fetchUsers() {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader()
    });

    return promise;
  }



  function handleUpdate(id, updates) {
    putEntry(id, updates)
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg);
        }
        return res.json();
      })
      .then((updated) => {
        setEntries((prev) =>
          prev
            .map((e) => (e._id === id ? updated : e))
            .sort(
              (a, b) =>
                new Date(b.date || b.createdAt) -
                new Date(a.date || a.createdAt)
            )
        );
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    fetchEntries()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) setEntries(json.entries);
        else setEntries(null); // optional: show "Data Unavailable"
      })
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div className="container">
      <nav>
        <div className="logo">Reflekt⭐️</div>

        <div className="nav-links">
          <Link to="/">Login</Link>
          <Link to="/home">Home</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/entries">All Entries</Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Login handleSubmit={loginUser} />}
        />
        <Route path="/signup" element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />} />
        <Route
          path="/home"
          element={
            <div>
              <div className="left-panel">
                <NewEntryForm handleSubmit={updateList} />
                <h1>Previous Journal Entries</h1>
                <Table
                  journalData={entries.slice(0, 3)}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
                <Link
                  to="/entries"
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    padding: "10px 16px",
                    background: "#ff4fa3",
                    color: "white",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  View All Entries
                </Link>
              </div>
              <div className="right-panel">
                {/* Optional later: stats, filters, mood chart, etc. */}
              </div>
            </div>
          }
        />
        <Route
          path="/calendar"
          element={<Calendar CalendarData={entries} />}
        />
        <Route
          path="/entries"
          element={
            <div className="left-panel">
              <h1>All Journal Entries</h1>
              <Table
                journalData={entries}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          }
        />
      </Routes>

    </div>
  );
}

export default MyApp;
