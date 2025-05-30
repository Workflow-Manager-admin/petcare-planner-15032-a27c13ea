import React from "react";

// PUBLIC_INTERFACE
/**
 * Reminder component displays a notification banner/reminder pill.
 * @param {Object} props - {
 *   reminder, onDismiss, onSnooze, onMarkDone, onDelete, panelMode
 * }
 */
function Reminder({
  reminder,
  onDismiss,
  onSnooze,
  onMarkDone,
  onDelete,
  panelMode
}) {
  if (!reminder) return null;

  const snoozeOpts = [10, 30, 60]; // mins

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
      tabIndex={0}
      aria-label={`Reminder: ${reminder.summary || reminder.forId || ""} at ${reminder.datetime || ""}`}
    >
      <span style={{flex: 1, minWidth: 0}}>
        {reminder.type === "task" && <b style={{ color: "var(--primary)" }}>Task Due:&nbsp;</b>}
        {reminder.type === "healthEvent" && <b style={{ color: "var(--accent)" }}>Health Event:&nbsp;</b>}
        <span>
          <b>{reminder.summary || reminder.forId}</b>
          &nbsp;—{" "}
          <span style={{
            color: reminder.snoozed ? "#8ea6f1" : "var(--text-secondary)",
            fontStyle: reminder.snoozed ? "italic" : "normal"
          }}>
            {reminder.datetime}
            {reminder.snoozed && " (Snoozed)"}
          </span>
        </span>
      </span>
      {panelMode ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <button
            className="btn btn-small"
            style={{ background: "#4CAF50", color: "#fff", minWidth: 0, padding: "2px 11px" }}
            aria-label="Mark done"
            onClick={() => onMarkDone?.(reminder.id)}
            tabIndex={0}
          >✓</button>
          <button
            className="btn btn-small"
            style={{ background: "#444960", color: "#fff", minWidth: 0, padding: "2px 7px" }}
            aria-label="Delete reminder"
            onClick={() => { if (window.confirm("Delete this reminder?")) onDelete?.(reminder.id); }}
            tabIndex={0}
          >🗑</button>
          <div style={{ display: "inline-block", position: "relative" }}>
            <button
              className="btn btn-small"
              style={{ background: "#313980", color: "#fff", minWidth: 0, padding: "2px 11px" }}
              aria-label="Snooze reminder"
              tabIndex={0}
              onClick={(e) => {
                // Simple snooze: use first option
                onSnooze?.(reminder.id, snoozeOpts[0]);
              }}
              title="Snooze (default 10m)."
            >⏰</button>
          </div>
          <button
            className="btn btn-small"
            style={{ background: "var(--accent)", color: "#fff", minWidth: 0, padding: "2.5px 11px" }}
            aria-label="Dismiss reminder"
            tabIndex={0}
            onClick={() => onDismiss?.(reminder.id)}
          >×</button>
        </span>
      ) : (
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
      )}
    </div>
  );
}

export default Reminder;
