import React from "react";

// PUBLIC_INTERFACE
/**
 * Reminder component displays a notification banner/reminder pill.
 * @param {Object} props - { reminder }
 */
function Reminder({ reminder, onDismiss }) {
  if (!reminder) return null;
  return (
    <div
      className="reminder-banner"
      style={{
        background: "linear-gradient(90deg, var(--background-card) 70%, var(--background-mid) 100%)",
        borderLeft: "6px solid var(--accent)",
        color: "var(--text-color)",
        padding: "11px 20px",
        margin: "13px 0",
        borderRadius: "0 10px 10px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 10px 0 rgba(0,0,0,0.17)"
      }}
    >
      <span>
        {reminder.type === "task" && <b style={{ color: "var(--primary)" }}>Task Due:&nbsp;</b>}
        {reminder.type === "healthEvent" && <b style={{ color: "var(--accent)" }}>Health Event:&nbsp;</b>}
        <span>
          <b>{reminder.summary || reminder.forId}</b> &mdash; <span style={{ color: "var(--text-secondary)" }}>{reminder.datetime}</span>
        </span>
      </span>
      <button
        className="btn"
        style={{
          marginLeft: 17,
          background: "var(--accent)",
          color: "#fff",
          padding: "4px 12px",
          fontWeight: 600,
          borderRadius: 4
        }}
        onClick={() => onDismiss?.(reminder.id)}
      >
        Dismiss
      </button>
    </div>
  );
}

export default Reminder;
