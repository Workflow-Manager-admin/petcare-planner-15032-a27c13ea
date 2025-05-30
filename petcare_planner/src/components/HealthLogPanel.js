import React from "react";
import HealthLog from "./HealthLog";

/**
 * HealthLogPanel - Wrapper UI for detailed per-pet health event timeline/log + CRUD entry points.
 * @param {Object} props
 *  - events: array of health log events for a pet
 *  - onAddEvent: function to add event
 *  - onEditEvent: function to edit event
 *  - onDeleteEvent: function to delete event
 */
 // PUBLIC_INTERFACE
function HealthLogPanel({ events = [], onAddEvent, onEditEvent, onDeleteEvent }) {
  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Health Log</h3>
        <button className="btn" onClick={onAddEvent}>+ New Health Event</button>
      </div>
      <HealthLog events={events} />
      {/* Could add edit/delete per event: this is a simple extension point */}
    </section>
  );
}

export default HealthLogPanel;
