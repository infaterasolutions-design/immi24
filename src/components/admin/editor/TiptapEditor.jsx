"use client";
import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Callout } from "./extensions/Callout";
import { EmbedBlock } from "./extensions/EmbedBlock";
import EditorToolbar from "./EditorToolbar";
import TableBubbleMenu from "./TableBubbleMenu";
import EmbedModal from "./EmbedModal";
import { uploadMediaToSupabase } from "../../../lib/adminHelpers";

// URL patterns we auto-detect on paste
const EMBED_URL_PATTERNS = [
  /^https?:\/\/(www\.)?(youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts\/)/,
  /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\//,
  /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//,
  /^https?:\/\/(www\.)?(facebook\.com|fb\.com|fb\.watch)\//,
  /^https?:\/\/(www\.)?linkedin\.com\/(posts|pulse)\//,
];

function isEmbeddableUrl(text) {
  return EMBED_URL_PATTERNS.some((pattern) => pattern.test(text.trim()));
}

function detectPlatformFromUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" || host === "youtu.be") return "youtube";
    if (host === "twitter.com" || host === "x.com") return "twitter";
    if (host === "instagram.com") return "instagram";
    if (host === "facebook.com" || host === "fb.com" || host === "fb.watch") return "facebook";
    if (host === "linkedin.com") return "linkedin";
    return "generic";
  } catch {
    return "generic";
  }
}

export default function TiptapEditor({ content, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5] },
      }),
      Callout,
      EmbedBlock,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands or start writing...",
      }),
      Youtube.configure({
        controls: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none min-h-[500px]",
      },
      handleDrop: function (view, event, slice, moved) {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file, view, event);
            return true;
          }
        }
        return false;
      },
      handlePaste: function (view, event) {
        // Handle image paste
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files[0]
        ) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleImageUpload(file, view, event);
            return true;
          }
        }

        // Handle URL paste → auto-embed
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (text && isEmbeddableUrl(text)) {
          event.preventDefault();
          const platform = detectPlatformFromUrl(text);
          // Use setTimeout to ensure editor is ready
          setTimeout(() => {
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.embedBlock.create({
                  src: text,
                  platform,
                })
              )
            );
          }, 0);
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  async function handleImageUpload(file, view, event) {
    setIsUploading(true);
    try {
      const url = await uploadMediaToSupabase(file);
      if (url && view && event) {
        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        const node = schema.nodes.image.create({ src: url });
        const transaction = view.state.tr.insert(
          coordinates ? coordinates.pos : view.state.selection.to,
          node
        );
        view.dispatch(transaction);
      } else if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleEmbedInsert = useCallback(
    ({ src, platform }) => {
      if (editor) {
        editor.chain().focus().setEmbed({ src, platform }).run();
      }
    },
    [editor]
  );

  // Effect to sync content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-container rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex flex-col h-full">
      <EditorToolbar
        editor={editor}
        onImageUpload={(file) => handleImageUpload(file, null, null)}
        onEmbedClick={() => setShowEmbedModal(true)}
      />

      <div className="p-8 flex-1 overflow-y-auto relative bg-white">
        {isUploading && (
          <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded text-xs font-semibold shadow z-10 animate-pulse">
            Uploading...
          </div>
        )}
        <TableBubbleMenu editor={editor} />
        <EditorContent editor={editor} className="outline-none" />
      </div>

      <EmbedModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        onInsert={handleEmbedInsert}
      />
    </div>
  );
}
