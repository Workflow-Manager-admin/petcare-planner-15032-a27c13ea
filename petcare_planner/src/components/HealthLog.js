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
              marginBottom: 13,
              borderRadius: 7,
              background: "var(--background-card)",
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 1.5px 6px 0 rgba(0,0,0,0.12)",
              padding: "10px 13px"
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {event.eventType}
              <span style={{ fontWeight: "normal", color: "var(--accent)", marginLeft: 8 }}>
                {event.date}
              </span>
            </div>
            {event.notes && <div style={{ fontSize: "0.98em", marginTop: 3 }}>{event.notes}</div>}
            {event.attachmentUrl && (
              <a
                href={event.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", textDecoration: "underline", fontSize: "0.96em", fontWeight: 500 }}
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
