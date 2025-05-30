import React from "react";
import Reminder from "./Reminder";

/**
 * RemindersPanel - Displays all active reminders/notifications and provides dismiss/acknowledge logic.
 * @param {Object} props
 *  - reminders: Array of reminder objects
 *  - onDismiss: function to dismiss reminder
 */
 // PUBLIC_INTERFACE
function RemindersPanel({ reminders = [], onDismiss }) {
  const activeReminders = reminders.filter(r => !r.dismissed);
  return (
    <section>
      <h3 style={{ margin: "10px 0" }}>Reminders & Notifications</h3>
      {activeReminders.length === 0 &&
        <div style={{ color: "var(--text-secondary)" }}>You're all caught up!</div>
      }
      {activeReminders.map(reminder =>
        <Reminder key={reminder.id} reminder={reminder} onDismiss={onDismiss} />
      )}
    </section>
  );
}

export default RemindersPanel;
