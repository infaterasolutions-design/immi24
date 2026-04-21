import React from "react";
import { BubbleMenu } from "@tiptap/react/menus";

export default function TableBubbleMenu({ editor }) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, maxWidth: 'none' }}
      shouldShow={({ editor }) => editor.isActive("table")}
      className="bg-white border border-slate-200 shadow-xl rounded-lg p-1.5 flex items-center gap-1.5"
    >
      {/* Row Controls */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5">
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded tooltip-btn"
          title="Add Row Above"
        >
          <span className="material-symbols-outlined text-[18px]">add_row_above</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded tooltip-btn"
          title="Add Row Below"
        >
          <span className="material-symbols-outlined text-[18px]">add_row_below</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded tooltip-btn"
          title="Delete Row"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>

      {/* Column Controls */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5 pl-0.5">
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded tooltip-btn"
          title="Add Column Left"
        >
          <span className="material-symbols-outlined text-[18px]">add_column_left</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded tooltip-btn"
          title="Add Column Right"
        >
          <span className="material-symbols-outlined text-[18px]">add_column_right</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded tooltip-btn"
          title="Delete Column"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>

      {/* Cell Controls */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5 pl-0.5">
        <button
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded disabled:opacity-30 tooltip-btn"
          title="Merge Cells"
        >
          <span className="material-symbols-outlined text-[18px]">table_restaurant</span>
        </button>
        <button
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded disabled:opacity-30 tooltip-btn"
          title="Split Cell"
        >
          <span className="material-symbols-outlined text-[18px]">splitscreen</span>
        </button>
      </div>
      
      {/* Table Actions */}
      <div className="flex items-center gap-1 pl-0.5">
        <button
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          className="p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded tooltip-btn"
          title="Toggle Header Row"
        >
          <span className="material-symbols-outlined text-[18px]">view_stream</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded tooltip-btn"
          title="Delete Table"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
        </button>
      </div>
    </BubbleMenu>
  );
}
