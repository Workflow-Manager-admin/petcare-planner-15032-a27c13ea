import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import SidebarTabs from './components/SidebarTabs';
import Dashboard from './components/Dashboard';
import PetProfile from './components/PetProfile';
import TaskList from './components/TaskList';
import HealthLogPanel from './components/HealthLogPanel';
import Reminder from './components/Reminder';
import RemindersPanel from './components/RemindersPanel';

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
  // Handler for snoozing reminders, using the context directly (legal hook usage)
  const handleSnoozeReminder = (reminderId, mins = 10) => {
    if (typeof mins !== "number") mins = 10;
    if (window.confirm(`Snooze this reminder for ${mins} minutes?`)) {
      snoozeReminder(reminderId, mins);
    }
  };

  const handleRemindersClose = () => setRemindersOpen(false);
  const handleRemindersOpen = () => setRemindersOpen(true);

  const handleReminderDone = (reminderId) => {
    updateReminder(reminderId, { dismissed: false, completed: true });
    dismissReminder(reminderId);
  };
  const handleReminderDelete = (reminderId) => {
    deleteReminder(reminderId);
  };

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
      {/* Global Reminders Modal */}
      {remindersOpen && (
        <RemindersPanel
          reminders={reminders}
          onDismiss={onDismissReminder}
          onSnooze={handleSnoozeReminder}
          onMarkDone={handleReminderDone}
          onDelete={handleReminderDelete}
          onClose={handleRemindersClose}
          asModal
        />
      )}
      <nav className="navbar" style={{ background: '#111115', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: theme.primary }}>*</span> PetCare Planner
            </div>
            <div>
              {/* Global Reminders quick badge in navbar */}
              <button
                className="btn btn-small"
                aria-label={`Show reminders & notifications (${reminders.filter((r) => !r.dismissed).length} pending)`}
                style={{ background: "var(--background-mid)", color: "var(--accent)", border: "1.5px solid var(--accent)", fontWeight: 700, marginRight: 7, position: "relative" }}
                onClick={handleRemindersOpen}
              >
                <span role="img" aria-label="Reminders">🔔</span>
                {reminders.filter((r) => !r.dismissed).length > 0 && (
                  <span className="reminder-badge" tabIndex={-1} aria-label={`${reminders.filter((r) => !r.dismissed).length} pending reminders`}>
                    {reminders.filter((r) => !r.dismissed).length}
                  </span>
                )}
              </button>
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
          reminders={reminders}
          onOpenReminders={handleRemindersOpen}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: "#16191f" }}>
          <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "32px", alignItems: "flex-start", padding: "32px 34px 0 14px" }}>
            <div style={{ flex: 2, minWidth: 295, maxWidth: 600 }}>
              <Dashboard
                reminders={reminders}
                onDismissReminder={onDismissReminder}
                showHealthLog={false /* handled below */}
              />
            </div>
            <div style={{ flex: 1.2, minWidth: 260, maxWidth: 430 }}>
              {/* Health log CRUD for current pet */}
              <HealthLogPanel petId={activePetId} />
            </div>
          </div>
          {/* Slots for future extensibility/features */}
          <section style={{ display: 'none' }}>
            <PetProfile pet={pets.find(p => p.id === activePetId)} />
            <TaskList tasks={filteredTasks} />
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