import React, { useMemo, useState, useEffect } from "react";
import "./Calendar.css";
import HomeEditor from "./HomeEditor";
import MoodSelector from "./MoodSelector";
import DailyPhotos from "./DailyPhotos";

function Calendar({
  CalendarData = [],
  selectedDate,
  setSelectedDate,
  selectedDateEntry,
  onSaveEntry,
  selectedMood,
  setSelectedMood,
  uploadPhotos,
  selectedTemplates,
  onAddFiles,
  onRemoveUploadAtIndex,
  onToggleTemplate,
  onClearAll
}) {
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

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(latestEntryDate);
    }
  }, [selectedDate, setSelectedDate, latestEntryDate]);

  useEffect(() => {
    if (selectedDate) {
      const picked = new Date(`${selectedDate}T12:00:00`);
      setCurrentMonth(
        new Date(picked.getFullYear(), picked.getMonth(), 1)
      );
    }
  }, [selectedDate]);

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

  // ✅ Fixed: monthLabel was referenced but never defined
  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const formattedSelectedDate = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      )
    : "";

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
      {/* LEFT SIDE — entry, mood, photos */}
      <aside className="calendar-details">
        <h2 className="calendar-details-date">
          {formattedSelectedDate}
        </h2>

        <HomeEditor
          entry={selectedDateEntry}
          key={`${selectedDate}-${selectedDateEntry?._id ?? "empty"}`}
          selectedDate={selectedDate}
          onSave={onSaveEntry}
        />

        <div style={{ marginTop: 18 }}>
          <MoodSelector
            value={selectedMood}
            onChange={setSelectedMood}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <DailyPhotos
            uploadPhotos={uploadPhotos}
            selectedTemplates={selectedTemplates}
            onAddFiles={onAddFiles}
            onRemoveUploadAtIndex={onRemoveUploadAtIndex}
            onToggleTemplate={onToggleTemplate}
            onClearAll={onClearAll}
          />
        </div>
      </aside>

      {/* RIGHT SIDE — calendar */}
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