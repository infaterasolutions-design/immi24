"use client";
import { useState } from "react";
import InternalLinkModal from "./InternalLinkModal";

export default function CustomWidgetBuilder({ widgets, onChange }) {
  const [modalState, setModalState] = useState({ isOpen: false, variant: null, index: null });
  const [editingText, setEditingText] = useState({ variant: null, index: null });

  // widgets shape: { mid: [{ url, title }], end: [{ url, title }] }
  const defaultWidgets = { mid: [], end: [], ...widgets };

  const handleAddLink = (variant) => {
    if (defaultWidgets[variant].length >= 6) {
      alert("Maximum 6 links allowed.");
      return;
    }
    setModalState({ isOpen: true, variant, index: null });
  };

  const handleEditLink = (variant, index) => {
    setModalState({ isOpen: true, variant, index });
  };

  const handleRemoveLink = (variant, index) => {
    const updated = { ...defaultWidgets };
    updated[variant].splice(index, 1);
    onChange(updated);
  };

  const handleInsertLink = ({ url, title }) => {
    if (!url) {
      // If URL is null, they removed the link
      if (modalState.index !== null) {
        handleRemoveLink(modalState.variant, modalState.index);
      }
      return;
    }

    const updated = { ...defaultWidgets };
    const { variant, index } = modalState;

    if (index !== null) {
      updated[variant][index].url = url;
      if (title) updated[variant][index].title = title;
    } else {
      updated[variant].push({ url, title: title || "" });
    }
    onChange(updated);
  };

  const handleTextChange = (variant, index, newTitle) => {
    const updated = { ...defaultWidgets };
    updated[variant][index].title = newTitle;
    onChange(updated);
  };

  const renderList = (variant, title) => {
    const items = defaultWidgets[variant] || [];
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
          <button
            type="button"
            onClick={() => handleAddLink(variant)}
            className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
          >
            + ADD LINK
          </button>
        </div>
        
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded border border-slate-100">No custom links added.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="bg-white border border-slate-200 rounded p-2 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 truncate flex-1" title={item.url}>{item.url}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => handleEditLink(variant, idx)} className="text-slate-400 hover:text-indigo-600 text-[10px] uppercase font-bold p-1">Edit URL</button>
                    <button type="button" onClick={() => handleRemoveLink(variant, idx)} className="text-slate-400 hover:text-rose-600 text-[10px] uppercase font-bold p-1">Remove</button>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleTextChange(variant, idx, e.target.value)}
                  placeholder="Enter custom display text..."
                  className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none focus:border-indigo-500"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Related Articles Widgets</h3>
        <p className="text-[10px] text-slate-400 mb-4">Manually select links and write custom titles. If left empty, the widgets will be hidden.</p>
      </div>

      {renderList("mid", "Mid-Article Widget (Max 3)")}
      {renderList("end", "End-of-Article Widget (Max 3)")}

      <InternalLinkModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, variant: null, index: null })}
        onInsert={handleInsertLink}
        initialUrl={modalState.index !== null ? defaultWidgets[modalState.variant]?.[modalState.index]?.url : ""}
      />
    </div>
  );
}
