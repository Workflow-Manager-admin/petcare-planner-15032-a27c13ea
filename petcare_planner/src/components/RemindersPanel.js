import React from "react";
import Reminder from "./Reminder";

/**
 * RemindersPanel - Displays all active reminders and provides full actions.
 * @param {Object} props
 *  - reminders: Array of reminders
 *  - onDismiss: function(reminderId)
 *  - onSnooze: function(reminderId, minutes)
 *  - onMarkDone: function(reminderId)
 *  - onDelete: function(reminderId)
 *  - onClose: function() (for closing modal)
 *  - asModal: bool (if true, shows in overlay)
 */
 // PUBLIC_INTERFACE
function RemindersPanel({
  reminders = [],
  onDismiss,
  onSnooze,
  onMarkDone,
  onDelete,
  onClose,
  asModal = false
}) {
  const activeReminders = reminders.filter(r => !r.dismissed);
  // Modal overlay if requested
  if (asModal) {
    return (
      <div className="reminders-modal-overlay" tabIndex={-1} aria-modal="true" role="dialog" aria-label="Reminders Panel" onMouseDown={e => { if (e.target === e.currentTarget && onClose) onClose(); }}>
        <div className="reminders-modal-content" tabIndex={0}>
          <button className="reminders-modal-close" aria-label="Close reminders panel" onClick={onClose} autoFocus>×</button>
          <RemindersPanel
            reminders={reminders}
            onDismiss={onDismiss}
            onSnooze={onSnooze}
            onMarkDone={onMarkDone}
            onDelete={onDelete}
            asModal={false}
          />
        </div>
      </div>
    );
  }

  return (
    <section>
      <h3 style={{ margin: "10px 0", fontWeight: 700 }}>Reminders & Notifications</h3>
      {activeReminders.length === 0 &&
        <div style={{ color: "var(--text-secondary)" }}>You're all caught up!</div>
      }
      {activeReminders.map(reminder => (
        <Reminder
          key={reminder.id}
          reminder={reminder}
          onDismiss={onDismiss}
          onSnooze={onSnooze}
          onMarkDone={onMarkDone}
          onDelete={onDelete}
          panelMode
        />
      ))}
    </section>
  );
}

export default RemindersPanel;
