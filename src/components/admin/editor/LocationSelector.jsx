"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchLocations, createLocation, getLocationWithParent, getAllStates } from "@/app/actions/locationActions";

export default function LocationSelector({ locationId, onLocationChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [newStateName, setNewStateName] = useState("");
  const [existingStates, setExistingStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [createMode, setCreateMode] = useState("existing"); // "existing" or "new"
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Load existing location on mount if locationId is set
  useEffect(() => {
    if (locationId) {
      getLocationWithParent(locationId).then((loc) => {
        if (loc) setSelectedLocation(loc);
      });
    }
  }, [locationId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleSearch = useCallback((value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchLocations(value);
      setResults(data);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);
  }, []);

  // Select an existing location
  const handleSelect = (location) => {
    setSelectedLocation(location);
    onLocationChange(location.id);
    setQuery("");
    setIsOpen(false);
    setShowCreateForm(false);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedLocation(null);
    onLocationChange(null);
    setQuery("");
  };

  // Open create form
  const handleOpenCreate = async () => {
    setShowCreateForm(true);
    setNewCityName(query); // Pre-fill with what user typed
    setIsOpen(false);
    // Fetch existing states for the dropdown
    const states = await getAllStates();
    setExistingStates(states);
  };

  // Create new location
  const handleCreate = async () => {
    if (!newCityName.trim()) return;
    setCreating(true);

    try {
      let parentId = null;

      // If user chose to create with an existing state
      if (createMode === "existing" && selectedStateId) {
        parentId = selectedStateId;
      }
      // If user wants to create a new state
      else if (createMode === "new" && newStateName.trim()) {
        const stateResult = await createLocation({ name: newStateName.trim() });
        if (stateResult.error) {
          alert("Failed to create state: " + stateResult.error);
          setCreating(false);
          return;
        }
        parentId = stateResult.data.id;
      }

      // Create the city
      const cityResult = await createLocation({ name: newCityName.trim(), parentId });
      if (cityResult.error) {
        alert("Failed to create location: " + cityResult.error);
        setCreating(false);
        return;
      }

      // Fetch the full location with parent
      const fullLocation = await getLocationWithParent(cityResult.data.id);
      handleSelect(fullLocation || cityResult.data);

      // Reset form
      setShowCreateForm(false);
      setNewCityName("");
      setNewStateName("");
      setSelectedStateId("");
      setCreateMode("existing");
    } catch (err) {
      alert("Error creating location: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  // Format display text for a location
  const formatLocation = (loc) => {
    if (!loc) return "";
    if (loc.parent) {
      return `${loc.parent.name} → ${loc.name}`;
    }
    return loc.name;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs text-slate-500 mb-1">Location</label>

      {/* Selected Location Display */}
      {selectedLocation ? (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded p-2 text-sm">
          <span className="text-indigo-800 font-medium flex items-center gap-1.5">
            <span className="text-base">📍</span>
            {formatLocation(selectedLocation)}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-indigo-400 hover:text-red-500 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>
      ) : (
        /* Search Input */
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search or create location..."
            className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-slate-800 outline-none focus:border-indigo-500 pr-8"
          />
          {isLoading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {results.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-3 py-2 hover:bg-indigo-50 transition-colors text-sm flex items-center gap-2 border-b border-slate-50 last:border-0"
            >
              <span className="text-slate-400 text-xs">📍</span>
              <div>
                <span className="text-slate-800 font-medium">{loc.name}</span>
                {loc.parent && (
                  <span className="text-slate-400 text-xs ml-1">
                    ({loc.parent.name})
                  </span>
                )}
              </div>
            </button>
          ))}
          {/* Create New Option */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-full text-left px-3 py-2.5 bg-slate-50 hover:bg-indigo-50 transition-colors text-sm font-medium text-indigo-600 flex items-center gap-2"
          >
            <span>+</span> Create &quot;{query}&quot;
          </button>
        </div>
      )}

      {/* No results — show create option */}
      {isOpen && results.length === 0 && query.length >= 2 && !isLoading && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl">
          <div className="px-3 py-2 text-xs text-slate-400">No locations found.</div>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-full text-left px-3 py-2.5 bg-slate-50 hover:bg-indigo-50 transition-colors text-sm font-medium text-indigo-600 flex items-center gap-2 rounded-b-lg"
          >
            <span>+</span> Create &quot;{query}&quot;
          </button>
        </div>
      )}

      {/* Create New Location Form */}
      {showCreateForm && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Create New Location</h4>

          {/* City Name */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">City / Location Name</label>
            <input
              type="text"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="e.g. Los Angeles"
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Parent State Toggle */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Parent State / Region</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setCreateMode("existing")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${createMode === "existing" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
              >
                Existing
              </button>
              <button
                type="button"
                onClick={() => setCreateMode("new")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${createMode === "new" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}
              >
                + New State
              </button>
            </div>

            {createMode === "existing" ? (
              <select
                value={selectedStateId}
                onChange={(e) => setSelectedStateId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">No parent (this is a state)</option>
                {existingStates.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                placeholder="e.g. California"
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newCityName.trim()}
              className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2 rounded hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Location"}
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setQuery(""); }}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
