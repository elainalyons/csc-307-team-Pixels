import React from "react";
import "./MoodSelector.css";

import frown from "./assets/moods/frown.svg";
import laugh from "./assets/moods/laugh.svg";
import meh from "./assets/moods/meh.svg";
import smile from "./assets/moods/smile.svg";

const MOODS = [
  { id: 1, label: "Bad", icon: frown, color: "#d66a6a" },
  { id: 2, label: "Meh", icon: meh, color: "#e3b565" },
  { id: 3, label: "Okay", icon: smile, color: "#6FA8DC" },
  { id: 4, label: "Good", icon: laugh, color: "#73c18a" }
];

export default function MoodSelector({ value, onChange }) {
  const handleClick = (id) =>
    onChange(value === id ? null : id);

  return (
    <section className="moodBlock">
      {/*       <h2 className="moodTitle">I'm feeling ___ today</h2>
       */}
      <div
        className="moodRow"
        role="radiogroup"
        aria-label="Select mood">
        {MOODS.map((m) => {
          const selected = value === m.id;

          return (
            <button
              key={m.id}
              type="button"
              className="moodCircle"
              onClick={() => handleClick(m.id)}
              aria-pressed={selected}
              aria-label={m.label}
              title={m.label}
              style={{
                backgroundColor: selected
                  ? m.color
                  : "var(--mood-bg)"
              }}>
              <img
                className="moodIcon"
                src={m.icon}
                alt=""
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
