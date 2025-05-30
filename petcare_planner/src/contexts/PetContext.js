import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * PetContext stores pet data and CRUD operations.
 */
const PetContext = createContext();

// PUBLIC_INTERFACE
export const usePets = () => useContext(PetContext);

// PUBLIC_INTERFACE
export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);

  // Load pets from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("pets") || "[]";
    try {
      setPets(JSON.parse(stored));
    } catch {
      setPets([]);
    }
  }, []);

  // Sync pets to localStorage
  useEffect(() => {
    window.localStorage.setItem("pets", JSON.stringify(pets));
  }, [pets]);

  // PUBLIC_INTERFACE
  const addPet = (pet) => setPets((old) => [...old, pet]);
  // PUBLIC_INTERFACE
  const updatePet = (id, updated) =>
    setPets((old) => old.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  // PUBLIC_INTERFACE
  const deletePet = (id) => setPets((old) => old.filter((p) => p.id !== id));

  return (
    <PetContext.Provider value={{ pets, addPet, updatePet, deletePet }}>
      {children}
    </PetContext.Provider>
  );
}
