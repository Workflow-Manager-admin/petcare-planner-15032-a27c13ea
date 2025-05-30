import React, { useState } from "react";

/**
 * AddPetForm provides a modal form for adding a new pet profile.
 * Handles name, breed, age (birthDate), and image upload (as base64), with validation.
 * - onSave(petObj): called with new pet object on successful submit
 * - onCancel(): called to dismiss/close
 */
// PUBLIC_INTERFACE
function AddPetForm({ open, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [ageOrBirthDate, setAgeOrBirthDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);

  React.useEffect(() => {
    if (open) {
      setName("");
      setSpecies("");
      setBreed("");
      setAgeOrBirthDate("");
      setPhotoUrl("");
      setNotes("");
      setError("");
      setLoadingImg(false);
    }
  }, [open]);

  // Calculate YYYY-MM-DD birthdate from age, or use direct input
  function getBirthDate() {
    if (!ageOrBirthDate || ageOrBirthDate.length > 6) {
      return ageOrBirthDate || undefined;
    }
    const n = parseInt(ageOrBirthDate, 10);
    if (!isNaN(n) && n > 0 && n < 100) {
      const dt = new Date();
      dt.setFullYear(dt.getFullYear() - n);
      // Jan 1, for lack of precision
      return dt.toISOString().slice(0, 10);
    }
    return undefined;
  }

  function handlePhotoChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Photo must be an image file");
      return;
    }
    setLoadingImg(true);
    const reader = new window.FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result);
      setLoadingImg(false);
    };
    reader.onerror = () => {
      setError("Failed to load image");
      setLoadingImg(false);
    };
    reader.readAsDataURL(f);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !species.trim()) {
      setError("Name and Species are required");
      return;
    }
    setError("");
    let newPet = {
      id: String(Date.now()) + Math.random().toFixed(4),
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim() || undefined,
      birthDate: getBirthDate(),
      photoUrl: photoUrl,
      notes: notes.trim() || undefined,
    };
    onSave && onSave(newPet);
  }

  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(15, 20, 22, 0.88)",
        zIndex: 199,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <form
        style={{
          background: "var(--background-mid, #232533)",
          color: "var(--text-color, #fff)",
          borderRadius: 13,
          minWidth: 306, maxWidth: 410, width: "95vw",
          padding: "25px 16px 19px 17px",
          position: "relative",
          boxShadow: "0 4px 38px 0 rgba(10,20,40,0.23)"
        }}
        aria-label="Add New Pet"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 8, right: 13,
            background: "none",
            color: "var(--text-secondary)",
            border: "none",
            fontSize: 23, cursor: "pointer"
          }}
        >×</button>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 17 }}>Add Pet Profile</div>
        {error && <div style={{ color: "#FF9800", marginBottom: 7, fontWeight: 500 }}>{error}</div>}
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="petName" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>
            Name <span style={{ color: "#FF9800" }}>*</span>
          </label>
          <input
            id="petName"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={36}
            autoFocus
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              background: "#252736",
              color: "#fff"
            }}
            placeholder="Pet's name"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="petSpecies" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>
            Species <span style={{ color: "#FF9800" }}>*</span>
          </label>
          <input
            id="petSpecies"
            type="text"
            required
            value={species}
            onChange={e => setSpecies(e.target.value)}
            maxLength={24}
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              background: "#252736",
              color: "#fff"
            }}
            placeholder="e.g. Dog, Cat, Rabbit"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="petBreed" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Breed</label>
          <input
            id="petBreed"
            type="text"
            value={breed}
            onChange={e => setBreed(e.target.value)}
            maxLength={36}
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 15,
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              background: "#252736",
              color: "#fff"
            }}
            placeholder="e.g. Labrador, Siamese"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="petAge" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Birthdate or Age (years)</label>
          <input
            id="petAge"
            type="text"
            value={ageOrBirthDate}
            onChange={e => setAgeOrBirthDate(e.target.value)}
            maxLength={12}
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 15,
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              background: "#252736",
              color: "#fff"
            }}
            placeholder="YYYY-MM-DD or Age"
            aria-label="Pet birth date or age"
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="petPhoto" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Photo</label>
          <input
            id="petPhoto"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ color: "#fff" }}
            aria-label="Upload pet photo"
          />
          {photoUrl && photoUrl.startsWith("data:") &&
            <div style={{ marginTop: 7 }}>
              <img src={photoUrl} alt="preview" style={{ maxWidth: 110, maxHeight: 88, borderRadius: 8, boxShadow: "0 0 7px 0 #111" }} />
            </div>
          }
          {loadingImg && (
            <div style={{ color: "#aaa", marginTop: 7 }}>Loading image...</div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="petNotes" style={{ fontWeight: 600, display: "block", marginBottom: 3 }}>Notes</label>
          <textarea
            id="petNotes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            maxLength={140}
            style={{
              width: "100%",
              padding: "7px 10px",
              fontSize: 15,
              borderRadius: 6,
              border: "1px solid var(--border-color)",
              background: "#252736",
              color: "#fff"
            }}
            placeholder="Extra info (optional)"
          />
        </div>
        <div style={{ marginTop: 13, display: "flex", justifyContent: "flex-end", gap: 13 }}>
          <button className="btn" type="button" onClick={onCancel} style={{ background: "#444960", color: "#fff" }}>Cancel</button>
          <button className="btn" type="submit" style={{ background: "var(--kavia-orange)" }}>Add Pet</button>
        </div>
      </form>
    </div>
  );
}

export default AddPetForm;
