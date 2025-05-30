import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import SidebarTabs from './components/SidebarTabs';
import Dashboard from './components/Dashboard';
import PetProfile from './components/PetProfile';
import TaskList from './components/TaskList';
import HealthLogPanel from './components/HealthLogPanel';
import Reminder from './components/Reminder';

// Import Context Providers/hooks (all centralized state logic)
import { PetProvider, usePets } from './contexts/PetContext';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { HealthLogProvider, useHealthLogs } from './contexts/HealthLogContext';
import { ReminderProvider, useReminders } from './contexts/ReminderContext';

const theme = {
  primary: '#4CAF50',
  secondary: '#FFFFFF',
  accent: '#FF9800',
  mode: 'dark'
};

// MAIN APP LAYER
function MainContainer() {
  // PET/PROFILE CONTEXT
  const { pets, addPet, updatePet, deletePet } = usePets();
  // TASK CONTEXT
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  // HEALTH EVENT CONTEXT
  const { healthEvents, addHealthEvent, updateHealthEvent, deleteHealthEvent } = useHealthLogs();
  // REMINDER CONTEXT
  const { reminders, addReminder, updateReminder, dismissReminder, deleteReminder } = useReminders();

  // App-level active (selected) pet, defaults to first if available
  const [activePetId, setActivePetId] = useState(() => pets[0]?.id || "");

  // Whenever pets changes: if no activePetId or the pet gets deleted, fallback
  useEffect(() => {
    if (!pets.find((p) => p.id === activePetId)) {
      setActivePetId(pets.length > 0 ? pets[0].id : "");
    }
  }, [pets, activePetId]);

  // Selection handler for pet tab
  const handleSelectPet = (petId) => setActivePetId(petId);

  // Handler for "Add Pet" – actual modal/form is to be implemented elsewhere
  const handleAddPet = () => {
    // Placeholder: in production, show a modal, etc.
    alert("Open Add Pet form (to be implemented)");
  };

  // Wire up CRUD for reminders, tasks, and health logs
  const onToggleTaskStatus = (taskId) => {
    const t = tasks.find((t) => t.id === taskId);
    if (!t) return;
    updateTask(taskId, {
      status: t.status === "done" ? "pending" : "done",
    });
  };
  const onDismissReminder = (reminderId) => dismissReminder(reminderId);

  // Filter view for active pet
  const filteredTasks = useMemo(
    () => tasks.filter((t) => t.petId === activePetId),
    [tasks, activePetId]
  );
  const filteredEvents = useMemo(
    () => healthEvents.filter((e) => e.petId === activePetId),
    [healthEvents, activePetId]
  );

  return (
    <div className="app" style={{ minHeight: '100vh', background: 'var(--kavia-dark)', color: 'var(--text-color)' }}>
      <nav className="navbar" style={{ background: '#111115', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: theme.primary }}>*</span> PetCare Planner
            </div>
            <div>
              {/* Placeholder for future settings/profile */}
              <button className="btn" style={{ background: theme.primary, color: theme.secondary }}>
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div style={{ display: "flex", paddingTop: "68px", minHeight: "calc(100vh - 68px)", background: "var(--kavia-dark)" }}>
        <SidebarTabs
          pets={pets}
          activePetId={activePetId}
          onSelect={handleSelectPet}
          onAdd={handleAddPet}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: "#16191f" }}>
          <Dashboard
            reminders={reminders}
            onDismissReminder={onDismissReminder}
            showHealthLog={true}
          />
          {/* Slots for future extensibility/features */}
          <section style={{ display: 'none' }}>
            <PetProfile pet={pets.find(p => p.id === activePetId)} />
            <TaskList tasks={filteredTasks} />
            <HealthLog events={filteredEvents} />
            <Reminder reminder={reminders[0]} />
          </section>
        </main>
      </div>
    </div>
  );
}

function App() {
  // Compose all context providers for local storage state
  // (ThemeProvider can be added as a wrapper here if/when needed)
  return (
    <PetProvider>
      <TaskProvider>
        <HealthLogProvider>
          <ReminderProvider>
            <MainContainer />
          </ReminderProvider>
        </HealthLogProvider>
      </TaskProvider>
    </PetProvider>
  );
}

export default App;