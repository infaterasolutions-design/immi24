import { BubbleMenu } from "@tiptap/react/menus";
import { useEffect, useReducer, useCallback } from "react";
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, Heading4, Heading5,
  List, ListOrdered, Quote, Link2, RemoveFormatting
} from "lucide-react";

export default function EditorBubbleMenu({ editor, onEmbedClick }) {
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
  if (!editor) return null;

  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || '';

  const shouldShow = useCallback(({ editor, view, state }) => {
    if (!view.hasFocus()) return false;
    // Show the menu if text is highlighted OR if the cursor is inside a link
    return !state.selection.empty || editor.isActive('link');
  }, []);

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100 }}
      shouldShow={shouldShow}
      className="flex flex-wrap items-center gap-1 p-1.5 bg-white border border-slate-200 shadow-xl rounded-lg"
    >
      <select
        value={currentFontSize}
        onChange={(e) => {
          if (!e.target.value) {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(e.target.value).run();
          }
        }}
        className="text-xs border border-slate-200 rounded px-1.5 py-1 h-7 text-slate-700 bg-white hover:border-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
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

      <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />

      <BubbleButton 
        icon={<Bold size={16} />} 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        isActive={editor.isActive("bold")} 
        title="Bold" 
      />
      <BubbleButton 
        icon={<Italic size={16} />} 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        isActive={editor.isActive("italic")} 
        title="Italic" 
      />
      <BubbleButton 
        icon={<Underline size={16} />} 
        onClick={() => editor.chain().focus().toggleUnderline?.().run()} 
        isActive={editor.isActive("underline")} 
        title="Underline" 
      />
      
      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <BubbleButton 
        icon={<Heading1 size={16} />} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        isActive={editor.isActive("heading", { level: 1 })} 
        title="Heading 1" 
      />
      <BubbleButton 
        icon={<Heading2 size={16} />} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        isActive={editor.isActive("heading", { level: 2 })} 
        title="Heading 2" 
      />
      <BubbleButton 
        icon={<Heading3 size={16} />} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        isActive={editor.isActive("heading", { level: 3 })} 
        title="Heading 3" 
      />
      <BubbleButton 
        icon={<Heading4 size={16} />} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
        isActive={editor.isActive("heading", { level: 4 })} 
        title="Heading 4" 
      />
      <BubbleButton 
        icon={<Heading5 size={16} />} 
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} 
        isActive={editor.isActive("heading", { level: 5 })} 
        title="Heading 5" 
      />

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <BubbleButton 
        icon={<List size={16} />} 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        isActive={editor.isActive("bulletList")} 
        title="Bullet List" 
      />
      <BubbleButton 
        icon={<ListOrdered size={16} />} 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        isActive={editor.isActive("orderedList")} 
        title="Numbered List" 
      />
      <BubbleButton 
        icon={<Quote size={16} />} 
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        isActive={editor.isActive("blockquote")} 
        title="Quote" 
      />

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      <BubbleButton 
        icon={<Link2 size={16} />} 
        onClick={onEmbedClick} 
        isActive={editor.isActive("link")} 
        title="Link" 
      />
      <BubbleButton 
        icon={<RemoveFormatting size={16} />} 
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} 
        title="Remove Formatting" 
      />
    </BubbleMenu>
  );
}

function BubbleButton({ icon, onClick, isActive = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${
        isActive 
          ? "bg-indigo-100 text-indigo-700" 
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28 }}
    >
      {icon}
    </button>
  );
}
