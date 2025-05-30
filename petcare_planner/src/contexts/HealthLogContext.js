import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * HealthLogContext manages health event logs for all pets.
 */
const HealthLogContext = createContext();

// PUBLIC_INTERFACE
export const useHealthLogs = () => useContext(HealthLogContext);

// PUBLIC_INTERFACE
export function HealthLogProvider({ children }) {
  const [healthEvents, setHealthEvents] = useState([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("healthEvents") || "[]";
    try {
      setHealthEvents(JSON.parse(stored));
    } catch {
      setHealthEvents([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("healthEvents", JSON.stringify(healthEvents));
  }, [healthEvents]);

  // PUBLIC_INTERFACE
  const addHealthEvent = (event) => setHealthEvents((old) => [...old, event]);
  // PUBLIC_INTERFACE
  const updateHealthEvent = (id, updated) =>
    setHealthEvents((old) => old.map((ev) => (ev.id === id ? { ...ev, ...updated } : ev)));
  // PUBLIC_INTERFACE
  const deleteHealthEvent = (id) =>
    setHealthEvents((old) => old.filter((ev) => ev.id !== id));

  return (
    <HealthLogContext.Provider
      value={{
        healthEvents,
        addHealthEvent,
        updateHealthEvent,
        deleteHealthEvent,
      }}
    >
      {children}
    </HealthLogContext.Provider>
  );
}
