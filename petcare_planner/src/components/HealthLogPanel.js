import React, { useState, useMemo, useCallback } from "react";
import { useHealthLogs } from "../contexts/HealthLogContext";
import { usePets } from "../contexts/PetContext";
import HealthLog from "./HealthLog";

/**
 * Accessible modal for add/edit health event.
 */
function HealthEventModal({ open, onClose, onSubmit, initial, petName }) {
  const isEdit = !!(initial && initial.id);
  const [eventType, setEventType] = useState(initial?.eventType || "");
  const [date, setDate] = useState(initial?.date || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [attachmentUrl, setAttachmentUrl] = useState(initial?.attachmentUrl || "");

  // Reset form when opening for new record or edit.
  React.useEffect(() => {
    setEventType(initial?.eventType || "");
    setDate(initial?.date || "");
    setNotes(initial?.notes || "");
    setAttachmentUrl(initial?.attachmentUrl || "");
  }, [open, initial]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { setAttachmentUrl(reader.result); };
    reader.readAsDataURL(f);
  };

  return open ? (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal-overlay"
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(20,22,25,0.86)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        aria-label={isEdit ? "Edit Health Event" : "Add Health Event"}
        style={{
          background: "var(--background-mid, #232533)", color: "var(--text-color, #fff)",
          borderRadius: 13, minWidth: 306, maxWidth: 410, width: "94vw",
          padding: "25px 17px 22px 17px", position: "relative",
          boxShadow: "0 4px 23px 0 rgba(10,20,40,0.25)"
        }}
        onSubmit={e => {
          e.preventDefault();
          if (!eventType || !date) {
            alert("Please enter event type and date.");
            return;
          }
          onSubmit({
            eventType: eventType.trim(),
            date,
            notes: notes.trim(),
            attachmentUrl: attachmentUrl,
          });
        }}
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Close health event modal"
          style={{
            position: "absolute", top: 9, right: 11, background: "none",
            color: "var(--text-secondary)", border: "none",
            fontSize: 24, cursor: "pointer"
          }}
        >×</button>
        <div style={{ fontWeight: 600, fontSize: 19, marginBottom: 11 }}>
          {isEdit ? `Edit Health Event` : `Add Health Event`} {petName ? `for ${petName}` : ""}
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="eventType" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Event Type</label>
          <input
            id="eventType"
            type="text"
            required
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            maxLength={36}
            autoFocus
            style={{
              width: "100%", padding: "7px 10px", fontSize: 16,
              borderRadius: 6, border: "1px solid var(--border-color)", background: "#252736", color: "#fff"
            }}
            aria-label="Health event type"
            placeholder="e.g. Vaccination or Vet Visit"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="eventDate" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Date</label>
          <input
            id="eventDate"
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px", fontSize: 16,
              borderRadius: 6, border: "1px solid var(--border-color)", background: "#252736", color: "#fff"
            }}
            aria-label="Date of health event"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="eventNotes" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Notes</label>
          <textarea
            id="eventNotes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            maxLength={150}
            style={{
              width: "100%", padding: "7px 10px", fontSize: 15,
              borderRadius: 6, border: "1px solid var(--border-color)", background: "#252736", color: "#fff"
            }}
            aria-label="Notes for health event"
            placeholder="Describe this event (optional)"
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="eventAttachment" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Attachment</label>
          <input
            id="eventAttachment"
            type="file"
            aria-label="Attach file (optional)"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ color: "#fff" }}
          />
          {/* Display attachment preview if image or attachment present */}
          {attachmentUrl && attachmentUrl.startsWith("data:image") &&
            <div style={{ marginTop: 5 }}>
              <img src={attachmentUrl} alt="attachment preview" style={{ maxWidth: 160, maxHeight: 86, borderRadius: 4 }} aria-label="attachment preview" />
            </div>
          }
          {attachmentUrl && attachmentUrl.startsWith("data:application/pdf") &&
            <div style={{ marginTop: 5 }}>
              <span style={{ color: "var(--kavia-orange)" }}>PDF attached.</span>
            </div>
          }
        </div>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 11 }}>
          <button className="btn" type="button" onClick={onClose} style={{ background: "#424560", color: "#fff" }}>Cancel</button>
          <button className="btn" type="submit" style={{ background: "var(--kavia-orange)" }}>{isEdit ? "Update" : "Add Event"}</button>
        </div>
      </form>
    </div>
  ) : null;
}

// PUBLIC_INTERFACE
/**
 * HealthLogPanel - Wrapper for health event CRUD, accessible modal, uses HealthLog for timeline.
 * Props: petId (active pet), onEventAdded (optional, for parent notify)
 */
function HealthLogPanel({
  petId,
  style,
  onEventAdded
}) {
  const { pets } = usePets();
  const { healthEvents, addHealthEvent, updateHealthEvent, deleteHealthEvent } = useHealthLogs();

  // Identify pet name for accessibility/heading
  const pet = useMemo(() => pets.find(p => p.id === petId), [pets, petId]);
  const petName = pet?.name || "";

  // Filter to only this pet's health events, newest first (by date)
  const events = useMemo(
    () =>
      healthEvents
        .filter(ev => ev.petId === petId)
        .slice()
        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    ,
    [healthEvents, petId]
  );

  // Modal state & editing logic
  const [modalOpen, setModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  // Find the editing event object if in edit mode
  const editingEvent = editEventId != null
    ? events.find(ev => ev.id === editEventId)
    : undefined;

  // Handlers
  const handleOpenNew = () => { setEditEventId(null); setModalOpen(true); };
  const handleOpenEdit = useCallback((id) => {
    setEditEventId(id);
    setModalOpen(true);
  }, []);
  const handleCloseModal = () => { setModalOpen(false); setEditEventId(null); };

  // Submitting a new or edited health event
  const handleSubmitModal = vals => {
    if (editingEvent) {
      updateHealthEvent(editingEvent.id, { ...vals });
    } else {
      addHealthEvent({
        id: String(Date.now()) + Math.random(),
        petId,
        ...vals
      });
    }
    handleCloseModal();
    if (typeof onEventAdded === "function") onEventAdded();
  };

  // Delete handler (confirm dialog)
  const handleDelete = (id) => {
    if (window.confirm("Delete this health event?")) {
      deleteHealthEvent(id);
    }
  };

  return (
    <section
      aria-label={`Health Log for ${petName || "pet"}`}
      style={{
        ...style,
        background: "var(--background-mid,#232533)",
        padding: "17px 13px 20px",
        borderRadius: 13,
        color: "var(--text-color)",
        minWidth: 264,
        maxWidth: 420,
        border: "1px solid var(--border-color)",
        boxShadow: "0 1px 7px 0 rgba(10,10,12,0.09)"
      }}
      tabIndex={0}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
        <h3 style={{ fontSize: "1.13em", fontWeight: 600, margin: 0 }}>{petName ? `${petName}'s Health Log` : "Health Log"}</h3>
        <button
          className="btn"
          style={{ background: "var(--kavia-orange)", color: "#fff", fontWeight: 600, padding: "5px 15px" }}
          onClick={handleOpenNew}
          aria-label={`Add health event for ${petName || "pet"}`}
        >
          + Add Event
        </button>
      </div>
      {/* Health Timeline. Pass edit/delete callbacks for per-row controls */}
      <HealthLog
        events={events}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
      {/* Modal for entry or edit */}
      <HealthEventModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        initial={editingEvent}
        petName={petName}
      />
    </section>
  );
}

export default HealthLogPanel;
