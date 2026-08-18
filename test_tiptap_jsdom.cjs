const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;

const { Editor } = require('@tiptap/core');
const StarterKit = require('@tiptap/starter-kit').default;
const Link = require('@tiptap/extension-link').default;

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
  content: '<p><a href="https://example.com" target="_blank">Blank target</a> and <a href="https://example.com" target="_self">Self target</a> and <a href="https://example.com">No target</a></p>',
});

console.log(editor.getHTML());
