import React, { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export default function Calendar() {
  //show the current month
  const [monthCursor] = useState(() => startOfMonth(new Date()));

  const cells = useMemo(() => {
    const first = startOfMonth(monthCursor);
    const totalDays = daysInMonth(monthCursor);
    const leadingBlanks = first.getDay(); // 0-6

    const result = [];

    // blanks before day 1
    for (let i = 0; i < leadingBlanks; i++) {
      result.push({ type: "blank", key: `blank-${i}` });
    }

    // day cells
    for (let day = 1; day <= totalDays; day++) {
      result.push({ type: "day", day, key: `day-${day}` });
    }

    return result;
  }, [monthCursor]);

  return (
    <div style={{ padding: 16 }}>
      {/* weekday labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center" }}>
            {w}
          </div>
        ))}
      </div>

      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
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
                fontWeight: 700,
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