// src/MyApp.jsx
// can start frontend by running npm start from root directory of project
import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import Calendar from "./Calendar";
import Table from "./Table";
// import NewEntryForm from "./NewEntryForm";
import HomeEditor from "./HomeEditor";
import EntryModal from "./EntryModal";
import EntryDetailsPage from "./EntryDetailsPage";
import "./MyApp.css";
import Login from "./Login";
import MoodSelector from "./MoodSelector";
import DailyPhotos from "./DailyPhotos";
import QuoteOfDay from "./QuoteOfDay";
import settingIcon from "./assets/icons/settingIcon.svg";
import logoLight from "./assets/logo/Reflekt-logo-yellow-bold.png";
import logoDark from "./assets/logo/Reflekt-logo-darkmode.png";

const INVALID_TOKEN = "INVALID_TOKEN";
const LS_KEY = "reflekt_widgets_v1";

function loadWidgetState() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveWidgetState(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function MyApp() {
  const [entries, setEntries] = useState([]);
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  const API_PREFIX = //"http://localhost:8000";
    "https://reflekt-journal-dgdpg9a7azgfhrd8.westus-01.azurewebsites.net";
  const navigate = useNavigate();

  const [showNavLinks, setShowNavLinks] = useState(false);
  /*   -------- Date Section  --------- */

  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(
      today.getTime() - offset * 60 * 1000
    );
    return localDate.toISOString().split("T")[0];
  };

  const [selectedDateEntry, setSelectedDateEntry] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState(getTodayDate());

  const todayDate = getTodayDate();
  const isToday = selectedDate === todayDate;

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

  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const selectedEntry = entries.find(
    (e) => e._id === selectedEntryId
  );

  /* -------  Widgets Save per Day--------  */
  const initial = useMemo(() => loadWidgetState(), []);
  /*   -------- logout  --------- */

  const [moodByDate, setMoodByDate] = useState(
    () => initial.moodByDate || {}
  );
  const [quoteByDate, setQuoteByDate] = useState(
    () => initial.quoteByDate || {}
  );
  const [photosByDate, setPhotosByDate] = useState(
    () => initial.photosByDate || {}
  );
  const [templatesByDate, setTemplatesByDate] = useState(
    () => initial.templatesByDate || {}
  );

  useEffect(() => {
    saveWidgetState({
      moodByDate,
      quoteByDate,
      photosByDate,
      templatesByDate
    });
  }, [moodByDate, quoteByDate, photosByDate, templatesByDate]);

  //mood
  const selectedMood = moodByDate[selectedDate] ?? null;
  const setSelectedMood = (newMoodId) => {
    setMoodByDate((prev) => ({
      ...prev,
      [selectedDate]: newMoodId
    }));
  };

  // photos
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingEntry, setPendingEntry] = useState(null);

  const uploadPhotos = photosByDate[selectedDate] || [];
  const selectedTemplates = templatesByDate[selectedDate] || [];

  /*   -------- logout  --------- */

  function logoutUser() {
    setToken(INVALID_TOKEN);
    setEntries([]);
    setSelectedDateEntry(null);
    navigate("/login");
  }

  /*   -------- End of Date Section  --------- */

  /*   -------- Photos Section  --------- */ //UI only for right now

  async function addPhotosForSelectedDate(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const dataUrls = await Promise.all(
      files.map(fileToDataURL)
    );

    setPhotosByDate((prev) => {
      const currentUploads = prev[selectedDate] || [];
      const templateCount = (
        templatesByDate[selectedDate] || []
      ).length;

      const roomLeft = Math.max(0, 4 - templateCount);
      const next = [...currentUploads, ...dataUrls].slice(
        0,
        roomLeft
      );

      return { ...prev, [selectedDate]: next };
    });

    e.target.value = "";
  }

  function removePhotoForSelectedDate(index) {
    setPhotosByDate((prev) => {
      const current = prev[selectedDate] || [];
      const toRemove = current[index];

      if (toRemove && toRemove.startsWith("blob:")) {
        URL.revokeObjectURL(toRemove);
      }

      const next = current.filter((_, i) => i !== index);

      return { ...prev, [selectedDate]: next };
    });
  }

  function toggleTemplateForSelectedDate(templateUrl) {
    setTemplatesByDate((prev) => {
      const current = prev[selectedDate] || [];
      const exists = current.includes(templateUrl);

      if (exists)
        return {
          ...prev,
          [selectedDate]: current.filter(
            (u) => u !== templateUrl
          )
        };

      const uploadCount = (photosByDate[selectedDate] || [])
        .length;
      const total = current.length + uploadCount;

      if (total >= 4) return prev;

      return {
        ...prev,
        [selectedDate]: [...current, templateUrl]
      };
    });
  }

  function clearAllPhotosForSelectedDate() {
    setPhotosByDate((prev) => {
      (prev[selectedDate] || []).forEach((u) =>
        URL.revokeObjectURL(u)
      );
      return { ...prev, [selectedDate]: [] };
    });
    setTemplatesByDate((prev) => ({
      ...prev,
      [selectedDate]: []
    }));
  }

  function goToLogin() {
    setShowLoginPrompt(false);
    navigate("/login");
  }

  function continueEditing() {
    setShowLoginPrompt(false);
  }

  function saveSelectedDateEntry(entry) {
    if (token === INVALID_TOKEN) {
      setPendingEntry(entry);
      setShowLoginPrompt(true);
      return;
    }

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
  /*   -------- End of Photos Section  --------- */

  /*   -------- Authentication Section  --------- */
  function postEntry(entry) {
    return fetch(`${API_PREFIX}/entries`, {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(entry)
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
      setMessage("Login successful;");
      setShowNavLinks(true);
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

    fetch(`${API_PREFIX}/entries/by-date/${selectedDate}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
      headers: {
        Authorization: `Bearer ${token}`
      }
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

  /* -------- AUTO SAVE AFTER LOGIN -------- */

  useEffect(() => {
    if (token !== INVALID_TOKEN && pendingEntry) {
      saveSelectedDateEntry(pendingEntry);
      setPendingEntry(null);
    }
  }, [token, pendingEntry]);

  /*   -------- End of Authentication Section  --------- */

  /*   -------- Right Panel Customization Section  --------- */

  const [customizeOpen, setCustomizeOpen] = useState(false);

  const [widgetsEnabled, setWidgetsEnabled] = useState({
    quote: true,
    mood: true,
    photos: true
  });

  const [widgetOrder, setWidgetOrder] = useState([
    "quote",
    "mood",
    "photos"
  ]);

  const toggleWidget = (key) =>
    setWidgetsEnabled((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

  const moveWidget = (key, dir) => {
    setWidgetOrder((prev) => {
      const i = prev.indexOf(key);
      if (i === -1) return prev;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const widgetMap = useMemo(
    () => ({
      quote: (
        <QuoteOfDay
          apiPrefix={API_PREFIX}
          savedQuote={quoteByDate[selectedDate] ?? null}
          onSaveQuote={(q) =>
            setQuoteByDate((prev) => ({
              ...prev,
              [selectedDate]: q
            }))
          }
          dateKey={selectedDate}
        />
      ),
      mood: (
        <MoodSelector
          value={selectedMood}
          onChange={setSelectedMood}
        />
      ),
      photos: (
        <DailyPhotos
          uploadPhotos={uploadPhotos}
          selectedTemplates={selectedTemplates}
          onAddFiles={addPhotosForSelectedDate}
          onRemoveUploadAtIndex={removePhotoForSelectedDate}
          onToggleTemplate={toggleTemplateForSelectedDate}
          onClearAll={clearAllPhotosForSelectedDate}
        />
      )
    }),
    [API_PREFIX, selectedMood, uploadPhotos, selectedTemplates]
  );

  /*   -------- End of Right Panel Customization Section  --------- */

  return (
    <div className="app-shell">
      <nav>
        <div className="logo">
          <picture>
            <source
              srcSet={logoDark}
              media="(prefers-color-scheme: dark)"
            />
            <img
              src={logoLight}
              alt="Reflekt"
              className="logoImg"
            />
          </picture>
        </div>
        {/* ------------- NAVIGATION TOP BAR  */}
        {showNavLinks && (
          <div className="nav-links">
            <Link data-cy="nav-home" to="/home">
              Today
            </Link>
            <Link data-cy="nav-all-entries" to="/entries">
              History
            </Link>
            <Link data-cy="nav-calendar" to="/calendar">
              Calendar
            </Link>
            {token === INVALID_TOKEN ? (
              <Link
                data-cy="nav-login"
                to="/login"
                className="authNavBtn">
                Login
              </Link>
            ) : (
              <button
                className="authNavBtn"
                onClick={logoutUser}>
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={
            <Login
              handleSubmit={loginUser}
              message={message}
              setShowNavLinks={setShowNavLinks}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Login
              handleSubmit={signupUser}
              buttonLabel="Sign Up"
              message={message}
              setShowNavLinks={setShowNavLinks}
            />
          }
        />
        <Route
          path="/home"
          element={
            <div className="page-content">
              <div className="left-panel">
                <div className="date-navigation">
                  <div className="date-nav-group">
                    <button
                      type="button"
                      className="date-nav-button"
                      onClick={() => changeDateByDays(-1)}
                      aria-label="Previous day">
                      ‹
                    </button>

                    <h1 className="date-navigation-label">
                      {displayDateLabel}
                    </h1>

                    {!isToday && (
                      <>
                        <button
                          type="button"
                          className="date-nav-button"
                          onClick={() => changeDateByDays(1)}
                          aria-label="Next day">
                          ›
                        </button>

                        <button
                          type="button"
                          className="today-button"
                          onClick={() =>
                            setSelectedDate(todayDate)
                          }>
                          Today
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <HomeEditor
                  entry={selectedDateEntry}
                  key={`${selectedDate}-${selectedDateEntry?._id ?? "empty"}`}
                  selectedDate={selectedDate}
                  onSave={saveSelectedDateEntry}
                />

                {showLoginPrompt && (
                  <div className="loginPromptOverlay">
                    <div className="loginPromptModal">
                      <h2>Login to Save</h2>
                      <p>
                        You need an account to save your journal
                        entry.
                      </p>

                      <div className="loginPromptButtons">
                        <button
                          onClick={() => {
                            goToLogin();
                            setShowNavLinks(false);
                          }}>
                          Login
                        </button>
                        <button onClick={continueEditing}>
                          Continue Editing
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                    marginTop: 15,
                    padding: "10px 16px",
                    background:
                      "linear-gradient(135deg, #008080, #20b2aa)",
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
                <div className="rightPanelHeader">
                  <button
                    type="button"
                    className="customizeBtn"
                    onClick={() => setCustomizeOpen((v) => !v)}
                    aria-label="Customize sidebar"
                    title="Customize">
                    <img
                      src={settingIcon}
                      alt=""
                      aria-hidden="true"
                      className="customizeIcon"
                    />
                  </button>

                  {customizeOpen && (
                    <div
                      className="customizePanel"
                      onClick={(e) => e.stopPropagation()}>
                      <h4 className="customizeTitle">
                        Customize
                      </h4>

                      {widgetOrder.map((key, idx) => (
                        <div className="customizeRow" key={key}>
                          <label className="customizeLabel">
                            <input
                              type="checkbox"
                              className="customizeCheckbox"
                              checked={!!widgetsEnabled[key]}
                              onChange={() => toggleWidget(key)}
                            />
                            {key === "quote"
                              ? "Quotes"
                              : key === "mood"
                                ? "Mood"
                                : "Pictures"}
                          </label>

                          <div className="orderBtns">
                            <button
                              type="button"
                              className="orderBtn"
                              onClick={() =>
                                moveWidget(key, "up")
                              }
                              disabled={idx === 0}
                              title="Move up">
                              ↑
                            </button>
                            <button
                              type="button"
                              className="orderBtn"
                              onClick={() =>
                                moveWidget(key, "down")
                              }
                              disabled={
                                idx === widgetOrder.length - 1
                              }
                              title="Move down">
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {widgetOrder.map((key) =>
                  widgetsEnabled[key] ? (
                    <div key={key} className="widgetBlock">
                      {widgetMap[key]}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          }
        />
        <Route path="/calendar"
          element={
            <Calendar
              CalendarData={entries}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedDateEntry={selectedDateEntry}
              onSaveEntry={saveSelectedDateEntry}
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              uploadPhotos={uploadPhotos}
              selectedTemplates={selectedTemplates}
              onAddFiles={addPhotosForSelectedDate}
              onRemoveUploadAtIndex={removePhotoForSelectedDate}
              onToggleTemplate={toggleTemplateForSelectedDate}
              onClearAll={clearAllPhotosForSelectedDate}
            />
          }
        />
        <Route
          path="/entries"
          element={
            <div className="left-panel">
              <h1>All Journal Entries</h1>

              <div className="tablePage">
                <Table
                  journalData={entries}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onRowClick={(id) =>
                    navigate(`/entries/${id}`)
                  }
                  quoteByDate={quoteByDate}
                  photosByDate={photosByDate}
                  templatesByDate={templatesByDate}
                />
              </div>
            </div>
          }
        />
        <Route
          path="/entries/:id"
          element={
            <EntryDetailsPage
              apiPrefix={API_PREFIX}
              token={token}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default MyApp;
