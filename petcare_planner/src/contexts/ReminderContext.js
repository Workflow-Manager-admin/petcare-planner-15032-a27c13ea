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
