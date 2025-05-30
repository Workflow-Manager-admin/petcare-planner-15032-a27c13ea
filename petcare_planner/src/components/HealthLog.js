import React from "react";

/**
 * HealthLog displays health-related events for a pet in an accessible timeline/list.
 * No direct CRUD or context: this is display-only, to be wrapped by HealthLogPanel for full interactivity.
 * 
 * @param {Object} props - { events: Array, onEdit: fn(id), onDelete: fn(id) }
 */
// PUBLIC_INTERFACE
function HealthLog({ events = [], onEdit, onDelete }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 14px 0", fontWeight: 600 }}>Health Events</h3>
      {events.length === 0 && (
        <div style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
          No health events logged.
        </div>
      )}
      <ol
        style={{ listStyle: "none", padding: 0, margin: 0 }}
        aria-label="Pet Health Event Timeline"
      >
        {events.map((event, idx) => (
          <li
            key={event.id}
            tabIndex={0}
            style={{
              marginBottom: 13,
              borderRadius: 7,
              background: "var(--background-mid, #232533)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 1.5px 6px 0 rgba(0,0,0,0.14)",
              padding: "12px 15px",
              position: "relative",
              outline: "none"
            }}
            aria-label={`Health event: ${event.eventType}, date: ${event.date}.${event.notes ? " " + event.notes : ""}`}
            onKeyDown={e => {
              // Enter/E triggers edit, Delete/Backspace triggers delete
              if (onEdit && ["Enter", "e", "E"].includes(e.key)) { e.preventDefault(); onEdit(event.id); }
              if (onDelete && ["Delete", "Backspace"].includes(e.key)) { e.preventDefault(); onDelete(event.id); }
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
              <span>
                <span style={{ fontWeight: "bold" }}>{event.eventType}</span>
                <span style={{ fontWeight: "normal", color: "var(--accent)", marginLeft: 10, fontSize: "0.98em" }}>
                  {event.date}
                </span>
              </span>
              {(onEdit || onDelete) && (
                <span style={{ display: "flex", gap: 8 }}>
                  {onEdit &&
                    <button
                      className="btn btn-small"
                      style={{ background: "#273f26", color: "#8de88d" }}
                      title="Edit health event"
                      aria-label={`Edit health event: ${event.eventType}`}
                      onClick={() => onEdit(event.id)}
                      tabIndex={0}
                    >✎</button>
                  }
                  {onDelete &&
                    <button
                      className="btn btn-small"
                      style={{ background: "#402727", color: "#ffc1c1" }}
                      title="Delete health event"
                      aria-label={`Delete health event: ${event.eventType}`}
                      onClick={() => onDelete(event.id)}
                      tabIndex={0}
                    >🗑</button>
                  }
                </span>
              )}
            </div>
            {event.notes && <div style={{ fontSize: "0.98em", marginTop: 4 }}>{event.notes}</div>}
            {event.attachmentUrl && event.attachmentUrl.trim() && (
              <a
                href={event.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  fontSize: "0.96em", fontWeight: 500,
                  marginTop: 4,
                  display: "inline-block"
                }}
              >
                View Attachment
              </a>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default HealthLog;
