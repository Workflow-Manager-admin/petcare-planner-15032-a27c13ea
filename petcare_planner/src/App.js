import React, { useState } from 'react';
import './App.css';
import SidebarTabs from './components/SidebarTabs';
import Dashboard from './components/Dashboard';

// Placeholder panel imports for extensibility
import PetProfile from './components/PetProfile';
import TaskList from './components/TaskList';
import HealthLog from './components/HealthLog';
import Reminder from './components/Reminder';

// Mock data imports for first-step scaffolding, until real context is wired
import { mockPets } from './mock/pets';
import { mockTasks } from './mock/tasks';
import { mockHealthEvents } from './mock/healthEvents';
import { mockReminders } from './mock/reminders';

// THEME COLORS (applicable for future ThemeProvider/context work)
const theme = {
  primary: '#4CAF50',
  secondary: '#FFFFFF',
  accent: '#FF9800',
  mode: 'dark'
};

function App() {
  // App-level state for active (selected) pet
  const [activePetId, setActivePetId] = useState(mockPets[0]?.id);

  // Switch selected pet for dashboard
  const handleSelectPet = (petId) => setActivePetId(petId);

  // Placeholders for CRUD actions (to be replaced with context/actions)
  const handleAddPet = () => {
    // Placeholder: would open add-pet modal in real app
    alert('Open Add Pet form (to be implemented)');
  };
  // Toggle task status for demo
  const [tasks, setTasks] = useState(mockTasks);
  const onToggleStatus = (taskId) => {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "done"
                ? "pending"
                : "done"
            }
          : t
      )
    );
  };
  // Reminders dismiss (demo)
  const [reminders, setReminders] = useState(mockReminders);
  const onDismissReminder = (reminderId) => {
    setReminders(reminders =>
      reminders.map(r =>
        r.id === reminderId ? { ...r, dismissed: true } : r
      )
    );
  };

  // Filter pet-related tasks/events
  const filteredTasks = tasks.filter(
    (t) => t.petId === activePetId
  );
  const filteredEvents = mockHealthEvents.filter(
    (e) => e.petId === activePetId
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
          pets={mockPets}
          activePetId={activePetId}
          onSelect={handleSelectPet}
          onAdd={handleAddPet}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", background: "#16191f" }}>
          <Dashboard
            tasks={filteredTasks}
            events={filteredEvents}
            reminders={reminders}
            onToggleStatus={onToggleStatus}
            onDismissReminder={onDismissReminder}
          />
          {/* Slots for future extensibility/features */}
          <section style={{ display: 'none' }}>
            <PetProfile pet={mockPets.find(p => p.id === activePetId)} />
            <TaskList tasks={filteredTasks} />
            <HealthLog events={filteredEvents} />
            <Reminder reminder={reminders[0]} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;