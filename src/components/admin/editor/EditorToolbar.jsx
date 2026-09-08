"use client";
import { useCallback, useRef, useEffect, useReducer } from "react";
import { 
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, Heading4, Heading5,
  List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, 
  AlignJustify, Image as ImageIcon, Video, Undo, Redo, Info, Table, Link2, LayoutTemplate
} from "lucide-react";

export default function EditorToolbar({ editor, onImageUpload, onEmbedClick }) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    editor.on('selectionUpdate', forceUpdate);
    editor.on('transaction', forceUpdate);
    return () => {
      editor.off('selectionUpdate', forceUpdate);
      editor.off('transaction', forceUpdate);
    };
  }, [editor]);
  const fileInputRef = useRef(null);

  const addYoutubeVideo = useCallback(() => {
    const url = prompt("Enter YouTube URL");
    if (url && editor) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const insertMidWidget = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent('<p>[WIDGET_MID]</p>').run();
    }
  }, [editor]);

  const insertEndWidget = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertContent('<p>[WIDGET_END]</p>').run();
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

  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || '';

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-slate-200 sticky top-0 z-10 rounded-t-lg">
      <select
        value={currentFontSize}
        onChange={(e) => {
          if (!e.target.value) {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(e.target.value).run();
          }
        }}
        className="text-sm border border-slate-200 rounded px-2 py-1 h-8 text-slate-700 bg-white hover:border-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer mr-1"
      >
        <option value="">Size</option>
        <option value="12px">12</option>
        <option value="14px">14</option>
        <option value="16px">16</option>
        <option value="18px">18</option>
        <option value="20px">20</option>
        <option value="24px">24</option>
        <option value="28px">28</option>
        <option value="32px">32</option>
        <option value="36px">36</option>
        <option value="48px">48</option>
        <option value="64px">64</option>
      </select>
      <Divider />
      <ToolbarButton icon={<Bold size={16} />} onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} />
      <ToolbarButton icon={<Italic size={16} />} onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} />
      <ToolbarButton icon={<Underline size={16} />} onClick={() => editor.chain().focus().toggleUnderline?.().run()} isActive={editor.isActive("underline")} />
      <ToolbarButton icon={<Strikethrough size={16} />} onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} />
      
      <Divider />
      
      <ToolbarButton icon={<Heading1 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} />
      <ToolbarButton icon={<Heading2 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} />
      <ToolbarButton icon={<Heading3 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} />
      <ToolbarButton icon={<Heading4 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} isActive={editor.isActive("heading", { level: 4 })} />
      <ToolbarButton icon={<Heading5 size={16} />} onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} isActive={editor.isActive("heading", { level: 5 })} />
      
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
      
      <ToolbarButton icon={<Table size={16} />} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table" />
      <ToolbarButton icon={<Link2 size={16} />} onClick={onEmbedClick} title="Embed URL (YouTube, Twitter, Instagram...)" />

      <Divider />
      
      <ToolbarButton icon={<LayoutTemplate size={16} className="text-indigo-600" />} onClick={insertMidWidget} title="Insert Mid-Article Widget" />
      <ToolbarButton icon={<LayoutTemplate size={16} className="text-rose-600" />} onClick={insertEndWidget} title="Insert End-of-Article Widget" />

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
