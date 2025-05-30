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
        background: "#242730",
        borderLeft: "6px solid #FF9800",
        color: "#fff",
        padding: "10px 18px",
        margin: "12px 0",
        borderRadius: "0 8px 8px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        {reminder.type === "task" && "Task Due: "}
        {reminder.type === "healthEvent" && "Health Event: "}
        <b>{reminder.summary || reminder.forId}</b> &ndash; {reminder.datetime}
      </span>
      <button
        className="btn"
        style={{
          marginLeft: 16,
          background: "#FF9800",
          color: "#fff",
          padding: "4px 12px",
        }}
        onClick={() => onDismiss?.(reminder.id)}
      >
        Dismiss
      </button>
    </div>
  );
}

export default Reminder;
