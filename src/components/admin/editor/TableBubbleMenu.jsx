"use client";
import React, { useEffect, useState, useRef } from "react";

export default function TableBubbleMenu({ editor }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    const updateMenu = () => {
      const isTable = editor.isActive("table");
      setVisible(isTable);

      if (isTable) {
        // Get the DOM element of the table node
        const { view } = editor;
        const { from } = view.state.selection;
        const domAtPos = view.domAtPos(from);
        let tableEl = domAtPos.node;

        // Walk up the DOM to find the table element
        while (tableEl && tableEl.nodeName !== "TABLE") {
          tableEl = tableEl.parentElement;
        }

        if (tableEl) {
          const editorRect = view.dom.closest(".tiptap-container")?.getBoundingClientRect();
          const tableRect = tableEl.getBoundingClientRect();
          if (editorRect) {
            setPosition({
              top: tableRect.top - editorRect.top - 48,
              left: tableRect.left - editorRect.left + tableRect.width / 2,
            });
          }
        }
      }
    };

    editor.on("selectionUpdate", updateMenu);
    editor.on("transaction", updateMenu);

    return () => {
      editor.off("selectionUpdate", updateMenu);
      editor.off("transaction", updateMenu);
    };
  }, [editor]);

  if (!editor || !visible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 flex items-center gap-1 bg-white border border-slate-200 shadow-xl rounded-lg p-1.5 transition-all"
      style={{
        top: Math.max(0, position.top),
        left: position.left,
        transform: "translateX(-50%)",
      }}
    >
      {/* Row Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5">
        <Btn
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="Add Row Above"
          icon="keyboard_arrow_up"
        />
        <Btn
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="Add Row Below"
          icon="keyboard_arrow_down"
        />
        <Btn
          onClick={() => editor.chain().focus().deleteRow().run()}
          title="Delete Row"
          icon="delete"
          danger
        />
      </div>

      {/* Column Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 pl-0.5">
        <Btn
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="Add Column Left"
          icon="keyboard_arrow_left"
        />
        <Btn
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="Add Column Right"
          icon="keyboard_arrow_right"
        />
        <Btn
          onClick={() => editor.chain().focus().deleteColumn().run()}
          title="Delete Column"
          icon="delete"
          danger
        />
      </div>

      {/* Cell Controls */}
      <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 pl-0.5">
        <Btn
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
          title="Merge Cells"
          icon="call_merge"
        />
        <Btn
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
          title="Split Cell"
          icon="call_split"
        />
      </div>

      {/* Table Actions */}
      <div className="flex items-center gap-0.5 pl-0.5">
        <Btn
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          title="Toggle Header Row"
          icon="table_rows"
        />
        <Btn
          onClick={() => editor.chain().focus().deleteTable().run()}
          title="Delete Table"
          icon="delete_sweep"
          danger
        />
      </div>
    </div>
  );
}

function Btn({ onClick, title, icon, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors cursor-pointer ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}
    >
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
    </button>
  );
}
