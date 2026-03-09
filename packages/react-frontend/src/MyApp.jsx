// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import Calendar from "./Calendar";
import Table from "./Table";
// import NewEntryForm from "./NewEntryForm";
import HomeEditor from "./HomeEditor";
import EntryModal from "./EntryModal";
import EntryDetailsPage from "./EntryDetailsPage";
import QuoteOfDay from "./QuoteOfDay";
import "./MyApp.css";
import Login from "./Login";

const INVALID_TOKEN = "INVALID_TOKEN";

function MyApp() {
  const [entries, setEntries] = useState([]);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  const API_PREFIX = "http://localhost:8000";
  // production
  // const API_PREFIX =
  //   "https://reflekt-journal-dgdpg9a7azgfhrd8.westus-01.azurewebsites.net";
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [selectedDateEntry, setSelectedDateEntry] = useState(null);

  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const selectedEntry = entries.find(
    (e) => e._id === selectedEntryId
  );

  function changeDateByDays(days) {
    const current = new Date(`${selectedDate}T12:00:00`);
    current.setDate(current.getDate() + days);

    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");

    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }

  const formattedSelectedDate = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const displayDateLabel =
    selectedDate === getTodayDate()
      ? "Today"
      : formattedSelectedDate;


  function updateList(entry) {
    postEntry(entry)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then((json) => {
        setEntries((prevEntries) => {
          const existingIndex = prevEntries.findIndex(
            (e) => e._id === json._id
          );

          if (existingIndex !== -1) {
            const updatedEntries = [...prevEntries];
            updatedEntries[existingIndex] = json;
            return updatedEntries.sort(
              (a, b) =>
                new Date(b.date || b.createdAt) -
                new Date(a.date || a.createdAt)
            );
          }

          return [...prevEntries, json].sort(
            (a, b) =>
              new Date(b.date || b.createdAt) -
              new Date(a.date || a.createdAt)
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function saveSelectedDateEntry(entry) {
    postEntry(entry)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then((savedEntry) => {
        setSelectedDateEntry(savedEntry);

        setEntries((prevEntries) => {
          const existingIndex = prevEntries.findIndex(
            (e) => e._id === savedEntry._id
          );

          if (existingIndex !== -1) {
            const updatedEntries = [...prevEntries];
            updatedEntries[existingIndex] = savedEntry;
            return updatedEntries.sort(
              (a, b) =>
                new Date(b.date || b.createdAt) -
                new Date(a.date || a.createdAt)
            );
          }

          return [...prevEntries, savedEntry].sort(
            (a, b) =>
              new Date(b.date || b.createdAt) -
              new Date(a.date || a.createdAt)
          );
        });
      })
      .catch((error) => {
        console.log(error);
        setMessage(`Save failed: ${error.message}`);
      });
  }


  function postEntry(entry) {
    return fetch(`${API_PREFIX}/entries`, {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(entry)
    });
  }

  function fetchEntryByDate(date) {
    return fetch(`${API_PREFIX}/entries/by-date/${date}`, {
      headers: addAuthHeader()
    });
  }

  function deleteEntry(id) {
    return fetch(`${API_PREFIX}/entries/${id}`, {
      method: "DELETE",
      headers: addAuthHeader()
    });
  }

  function putEntry(id, updates) {
    return fetch(`${API_PREFIX}/entries/${id}`, {
      method: "PUT",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(updates)
    });
  }

  function handleDelete(id) {
    const ok = window.confirm(
      "Delete this journal entry? This cannot be undone."
    );
    if (!ok) return;

    deleteEntry(id)
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setEntries((prev) => prev.filter((e) => e._id !== id));
      })
      .catch((error) => {
        console.log(error);
        setMessage("Delete failed");
      });
  }

  async function loginUser(creds) {
    try {
      const res = await fetch(`${API_PREFIX}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      });

      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        throw new Error(
          typeof body === "string" ? body : JSON.stringify(body)
        );
      }

      // expect { token: "..." }
      setToken(body.token);
      setMessage("Login successful; auth token saved");
      navigate("/home");
      return true;
    } catch (err) {
      setMessage(`Login Error: ${err.message}`);
      return false;
    }
  }

  async function signupUser(creds) {
    try {
      const res = await fetch(`${API_PREFIX}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      });

      const contentType = res.headers.get("content-type") || "";
      const body = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        throw new Error(
          typeof body === "string" ? body : JSON.stringify(body)
        );
      }

      setToken(body.token);
      setMessage(
        `Signup successful for user: ${creds.username}`
      );
      navigate("/home");
      return true;
    } catch (err) {
      setMessage(`Signup Error: ${err.message}`);
      return false;
    }
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
    if (token === INVALID_TOKEN) {
      setSelectedDateEntry(null);
      return;
    }

    fetchEntryByDate(selectedDate)
      .then(async (res) => {
        if (res.status === 401) {
          setToken(INVALID_TOKEN);
          setMessage("Session expired. Please log in again.");
          navigate("/login");
          return null;
        }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        setSelectedDateEntry(json.entry);
      })
      .catch((error) => {
        console.log(error);
        setSelectedDateEntry(null);
      });
  }, [selectedDate, token, navigate]);

  //only get entries when token is valid
  useEffect(() => {
    if (token === INVALID_TOKEN) {
      setEntries([]);
      return;
    }

    fetch(`${API_PREFIX}/entries`, {
      headers: addAuthHeader()
    })
      .then(async (res) => {
        if (res.status === 401) {
          setToken(INVALID_TOKEN);
          setMessage("Session expired. Please log in again.");
          navigate("/login");
          return null;
        }
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        setEntries(json.entries ?? json["entries"] ?? []);
      })
      .catch((error) =>
        setMessage(`Fetch entries failed: ${error.message}`)
      );
  }, [token, navigate]);

  return (
    <div className="app-shell">
      <nav>
        <div className="logo">Reflekt⭐️</div>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
          <Link to="/home">Home</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/entries">All Entries</Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/login"
          element={
            <Login handleSubmit={loginUser} message={message} />
          }
        />
        <Route
          path="/signup"
          element={
            <Login
              handleSubmit={signupUser}
              buttonLabel="Sign Up"
              message={message}
            />
          }
        />
        <Route
          path="/home"
          element={
            <div className="page-content">
              <div className="left-panel">
                <div className="date-navigation">
                  <button
                    type="button"
                    className="date-nav-button"
                    onClick={() => changeDateByDays(-1)}
                  >
                    ‹
                  </button>

                  <h1 className="date-navigation-label">
                    {displayDateLabel}
                  </h1>

                  <button
                    type="button"
                    className="date-nav-button"
                    onClick={() => changeDateByDays(1)}
                  >
                    ›
                  </button>

                  <button
                    type="button"
                    className="today-button"
                    onClick={() => setSelectedDate(getTodayDate())}
                  >
                    Today
                  </button>
                </div>

                <HomeEditor
                  entry={selectedDateEntry}
                  key={selectedDate}
                  handleSubmit={updateList}
                  selectedDate={selectedDate}
                  onSave={saveSelectedDateEntry}
                />

                <h1>Previous Journal Entries</h1>
                <Table
                  journalData={entries.slice(0, 3)}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onRowClick={(id) => setSelectedEntryId(id)}
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
                  }}>
                  View All Entries
                </Link>
                {selectedEntryId && (
                  <EntryModal
                    entry={selectedEntry}
                    onClose={() => setSelectedEntryId(null)}
                  />
                )}
              </div>
              <div className="right-panel">
                <QuoteOfDay />
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
                onRowClick={(id) => navigate(`/entries/${id}`)}
              />
            </div>
          }
        />
        <Route
          path="/entries/:id"
          element={<EntryDetailsPage />}
        />
      </Routes>
    </div>
  );
}

export default MyApp;
