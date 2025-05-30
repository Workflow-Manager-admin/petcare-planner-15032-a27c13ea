import React from "react";

// PUBLIC_INTERFACE
/**
 * HealthLog displays health-related events for a pet in a timeline format.
 * @param {Object} props - { events: Array }
 */
function HealthLog({ events = [] }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 14px 0" }}>Health Events</h3>
      {events.length === 0 && (
        <div style={{ color: "var(--text-secondary)" }}>No health events logged.</div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map((event) => (
          <li
            key={event.id}
            style={{
              marginBottom: 12,
              borderRadius: 6,
              background: "#1f232a",
              color: "var(--text-color)",
              padding: "10px 12px"
            }}
          >
            <div style={{ fontWeight: "bold" }}>{event.eventType} <span style={{ fontWeight: "normal", color: "#888" }}>{event.date}</span></div>
            {event.notes && <div style={{ fontSize: "0.98em", marginTop: 4 }}>{event.notes}</div>}
            {event.attachmentUrl && (
              <a
                href={event.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FF9800", textDecoration: "underline", fontSize: "0.95em" }}
              >
                View Attachment
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HealthLog;
