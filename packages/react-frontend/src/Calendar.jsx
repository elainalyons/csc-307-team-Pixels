import React, { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function monthLabel(date) {
  return date.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export default function Calendar() {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));

  const cells = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const totalDays = daysInMonth(monthCursor);
    const leadingBlanks = first.getDay();

    const result = [];
    const CELL_COUNT = 42; // keeps the grid stable

    for (let i = 0; i < leadingBlanks; i++) {
      result.push({ type: "blank", key: `blank-${i}` });
    }

    for (let day = 1; day <= totalDays; day++) {
      result.push({ type: "day", day, key: `day-${day}` });
    }

    while (result.length < CELL_COUNT) {
      result.push({ type: "blank", key: `blank-tail-${result.length}` });
    }

    return result;
  }, [monthCursor]);

  const goPrevMonth = () => {
    setMonthCursor((d) => startOfMonth(new Date(d.getFullYear(), d.getMonth() - 1, 1)));
  };

  const goNextMonth = () => {
    setMonthCursor((d) => startOfMonth(new Date(d.getFullYear(), d.getMonth() + 1, 1)));
  };

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={goPrevMonth}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goPrevMonth()}
          style={{ cursor: "pointer", userSelect: "none" }}
          aria-label="Previous month"
        >
          ←
        </div>

        <div style={{ fontWeight: 700 }}>{monthLabel(monthCursor)}</div>

        <div
          role="button"
          tabIndex={0}
          onClick={goNextMonth}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goNextMonth()}
          style={{ cursor: "pointer", userSelect: "none" }}
          aria-label="Next month"
        >
          →
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginBottom: 8,
          fontWeight: 600
        }}
      >
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center" }}>
            {w}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8
        }}
      >
        {cells.map((cell) => {
          if (cell.type === "blank") {
            return <div key={cell.key} style={{ height: 70 }} />;
          }

          return (
            <div
              key={cell.key}
              style={{
                height: 70,
                border: "1px solid #ccc",
                borderRadius: 10,
                padding: 10,
                fontWeight: 700
              }}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}