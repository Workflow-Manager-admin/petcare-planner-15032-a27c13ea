import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * ReminderContext manages reminders and notifications for tasks and health events.
 */
const ReminderContext = createContext();

// PUBLIC_INTERFACE
export const useReminders = () => useContext(ReminderContext);

// PUBLIC_INTERFACE
export function ReminderProvider({ children }) {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("reminders") || "[]";
    try {
      setReminders(JSON.parse(stored));
    } catch {
      setReminders([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  // PUBLIC_INTERFACE
  const addReminder = (rem) => setReminders((old) => [...old, rem]);
  // PUBLIC_INTERFACE
  const updateReminder = (id, updated) =>
    setReminders((old) => old.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  // PUBLIC_INTERFACE
  const dismissReminder = (id) =>
    setReminders((old) => old.map((r) => (r.id === id ? { ...r, dismissed: true } : r)));
  // PUBLIC_INTERFACE
  const deleteReminder = (id) =>
    setReminders((old) => old.filter((r) => r.id !== id));
  // PUBLIC_INTERFACE
  const snoozeReminder = (id, snoozeMinutes = 15) =>
    setReminders((old) =>
      old.map((r) =>
        r.id === id
          ? {
              ...r,
              snoozed: true,
              // For demo: add snooze offset to datetime as ISO string, but keep original as .origDatetime
              origDatetime: r.datetime || "",
              datetime: (() => {
                try {
                  // If r.datetime exists and is valid, add snoozeMinutes;
                  const dt = r.datetime
                    ? new Date(r.datetime)
                    : new Date();
                  dt.setMinutes(dt.getMinutes() + snoozeMinutes);
                  return dt.toISOString().slice(0,16).replace("T", " ");
                } catch {
                  return r.datetime;
                }
              })(),
              dismissed: false, // Snoozed reminders pop to top again!
            }
          : r
      )
    );

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        dismissReminder,
        deleteReminder,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}
