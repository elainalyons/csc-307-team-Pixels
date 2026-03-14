import React, { useMemo, useState, useEffect } from "react";
import "./Calendar.css";

function Calendar({ CalendarData = [] }) {
  const today = new Date();

  const entriesByDate = useMemo(() => {
    const map = {};

    for (const entry of CalendarData) {
      if (!entry?.date) continue;

      const normalizedDate = normalizeDateString(entry.date);
      if (!normalizedDate) continue;

      if (!map[normalizedDate]) {
        map[normalizedDate] = [];
      }

      map[normalizedDate].push(entry);
    }

    return map;
  }, [CalendarData]);

  const sortedEntries = useMemo(() => {
    return [...CalendarData]
      .filter((entry) => entry?.date)
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt) -
          new Date(a.date || a.createdAt)
      );
  }, [CalendarData]);

  const latestEntryDate =
    sortedEntries.length > 0
      ? normalizeDateString(sortedEntries[0].date)
      : formatDateLocal(today);

  const [currentMonth, setCurrentMonth] = useState(() => {
    if (sortedEntries.length > 0) {
      const latest = new Date(sortedEntries[0].date);
      return new Date(latest.getFullYear(), latest.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(latestEntryDate);

  useEffect(() => {
    if (sortedEntries.length > 0) {
      const newestDate = normalizeDateString(sortedEntries[0].date);
      setSelectedDate(newestDate);

      const newest = new Date(sortedEntries[0].date);
      setCurrentMonth(
        new Date(newest.getFullYear(), newest.getMonth(), 1)
      );
    }
  }, [sortedEntries]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];

    for (let i = 0; i < startDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateString = formatDateLocal(dateObj);

      cells.push({
        day,
        dateString,
        entries: entriesByDate[dateString] || []
      });
    }

    return cells;
  }, [currentMonth, entriesByDate]);

  const selectedEntries = entriesByDate[selectedDate] || [];
  const selectedEntry = selectedEntries[0] || null;

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  function previousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  }

  function handleSelectDate(dateString) {
    setSelectedDate(dateString);
  }

  return (
    <div className="calendar-page">
      <div className="calendar-main">
        <div className="calendar-topbar">
          <button
            type="button"
            className="calendar-arrow"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            ←
          </button>

          <h1 className="calendar-month">{monthLabel}</h1>

          <button
            type="button"
            className="calendar-arrow"
            onClick={nextMonth}
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="calendar-grid">
          {calendarDays.map((cell, index) =>
            cell ? (
              <button
                key={cell.dateString}
                type="button"
                className={`calendar-day-box ${
                  selectedDate === cell.dateString ? "selected" : ""
                }`}
                onClick={() => handleSelectDate(cell.dateString)}
              >
                <div className="calendar-day-number">{cell.day}</div>

                {cell.entries.length > 0 && (
                  <div className="calendar-entry-title">
                    {cell.entries[0].title}
                  </div>
                )}
              </button>
            ) : (
              <div
                key={`blank-${index}`}
                className="calendar-day-box empty"
              />
            )
          )}
        </div>
      </div>

      <aside className="calendar-details">
        <h2 className="calendar-details-date">
          {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric"
            }
          )}
        </h2>

        {!selectedEntry ? (
          <div className="calendar-entry-card">
            <p className="calendar-no-entry">
              No journal entry for this day yet.
            </p>
          </div>
        ) : (
          <div className="calendar-entry-card">
            <h3>{selectedEntry.title}</h3>
            <p>{selectedEntry.body}</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function formatDateLocal(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeDateString(dateValue) {
  if (!dateValue) return null;

  if (
    typeof dateValue === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
  ) {
    return dateValue;
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return formatDateLocal(parsed);
}

export default Calendar;