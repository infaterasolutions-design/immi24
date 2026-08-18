import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

export async function GET(request) {
  const editor = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      })
    ],
    content: '<p><a href="https://example.com" target="_blank">Blank target</a> and <a href="https://example.com" target="_self">Self target</a></p>',
  });
  
  const html = editor.getHTML();
  
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
