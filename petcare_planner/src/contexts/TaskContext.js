import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * TaskContext manages care tasks state and operations.
 */
const TaskContext = createContext();

// PUBLIC_INTERFACE
export const useTasks = () => useContext(TaskContext);

// PUBLIC_INTERFACE
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("tasks") || "[]";
    try {
      setTasks(JSON.parse(stored));
    } catch {
      setTasks([]);
    }
  }, []);

  // Sync tasks to localStorage
  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // PUBLIC_INTERFACE
  const addTask = (task) => setTasks((old) => [...old, task]);
  // PUBLIC_INTERFACE
  const updateTask = (id, updated) =>
    setTasks((old) => old.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  // PUBLIC_INTERFACE
  const deleteTask = (id) => setTasks((old) => old.filter((t) => t.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}
