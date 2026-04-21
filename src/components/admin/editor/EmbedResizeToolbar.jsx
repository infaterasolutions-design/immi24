"use client";
import React, { useEffect, useState } from "react";

const SIZE_OPTIONS = [
  { value: "small", label: "S", title: "Small (50%)", icon: "width_narrow" },
  { value: "medium", label: "M", title: "Medium (75%)", icon: "width_normal" },
  { value: "full", label: "F", title: "Full Width", icon: "width_full" },
];

export default function EmbedResizeToolbar({ editor }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentWidth, setCurrentWidth] = useState("full");

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { selection } = editor.state;
      const node = editor.state.doc.nodeAt(selection.from);

      if (node && node.type.name === "embedBlock") {
        setVisible(true);
        setCurrentWidth(node.attrs.width || "full");

        // Position above the embed block
        const { view } = editor;
        const dom = view.nodeDOM(selection.from);
        if (dom && dom.nodeType === 1) {
          const containerEl = view.dom.closest(".tiptap-container");
          const domRect = dom.getBoundingClientRect();
          const containerRect = containerEl?.getBoundingClientRect();
          if (containerRect) {
            setPosition({
              top: domRect.top - containerRect.top - 44,
              left: domRect.left - containerRect.left + domRect.width / 2,
            });
          }
        }
      } else {
        setVisible(false);
      }
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!editor || !visible) return null;

  const handleResize = (width) => {
    editor.chain().focus().setEmbedWidth(width).run();
    setCurrentWidth(width);
  };

  const handleDelete = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <div
      className="absolute z-50 flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-lg p-1 transition-all"
      style={{
        top: Math.max(0, position.top),
        left: position.left,
        transform: "translateX(-50%)",
      }}
    >
      {/* Size Buttons */}
      <div className="flex items-center bg-slate-50 rounded-md p-0.5 gap-0.5">
        {SIZE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleResize(opt.value)}
            title={opt.title}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              currentWidth === opt.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      {/* Delete */}
      <button
        type="button"
        onClick={handleDelete}
        title="Remove Embed"
        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  );
}
