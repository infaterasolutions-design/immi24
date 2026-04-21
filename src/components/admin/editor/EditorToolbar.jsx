"use client";
import { useCallback, useRef } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Image as ImageIcon, Video, Undo, Redo, Info, Table
} from "lucide-react";

export default function EditorToolbar({ editor, onImageUpload }) {
  const fileInputRef = useRef(null);

  const addYoutubeVideo = useCallback(() => {
    const url = prompt("Enter YouTube URL");
    if (url && editor) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
    e.target.value = '';
  };

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 sticky top-0 z-10 rounded-t-lg">
      <ToolbarButton icon={<Bold size={16} />} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} />
      <ToolbarButton icon={<Italic size={16} />} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} />
      <ToolbarButton icon={<Underline size={16} />} onClick={() => editor.chain().focus().toggleUnderline?.().run()} isActive={editor.isActive("underline")} />
      <ToolbarButton icon={<Strikethrough size={16} />} onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} />
      
      <Divider />
      
      <ToolbarButton icon={<Heading1 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} />
      <ToolbarButton icon={<Heading2 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} />
      <ToolbarButton icon={<Heading3 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} />
      
      <Divider />
      
      <ToolbarButton icon={<List size={16} />} onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} />
      <ToolbarButton icon={<ListOrdered size={16} />} onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} />
      <ToolbarButton icon={<Quote size={16} />} onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote" />
      <ToolbarButton icon={<Info size={16} />} onClick={() => editor.chain().focus().toggleCallout().run()} isActive={editor.isActive("callout")} title="Info Callout Box" />
      <ToolbarButton icon={<Code size={16} />} onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} />
      
      <Divider />
      
      <ToolbarButton icon={<AlignLeft size={16} />} onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
      <ToolbarButton icon={<AlignCenter size={16} />} onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
      <ToolbarButton icon={<AlignRight size={16} />} onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />
      <ToolbarButton icon={<AlignJustify size={16} />} onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} />
      
      <Divider />

      <ToolbarButton icon={<ImageIcon size={16} />} onClick={triggerFileUpload} title="Upload Image" />
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <ToolbarButton icon={<Video size={16} />} onClick={addYoutubeVideo} title="Embed YouTube" />
      <ToolbarButton icon={<Table size={16} />} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table" />

      <Divider />

      <ToolbarButton icon={<Undo size={16} />} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
      <ToolbarButton icon={<Redo size={16} />} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
    </div>
  );
}

function ToolbarButton({ icon, onClick, isActive = false, disabled = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive 
          ? "bg-indigo-100 text-indigo-700" 
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}
    >
      {icon}
    </button>
  );
}

function Divider() {
  return <div className="w-[1px] h-5 bg-slate-200 mx-1" />;
}
