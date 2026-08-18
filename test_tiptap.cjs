const { generateHTML } = require('@tiptap/html');
const StarterKit = require('@tiptap/starter-kit').default;
const Link = require('@tiptap/extension-link').default;

const json = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'http://example.com',
                target: '_blank'
              }
            }
          ]
        }
      ]
    }
  ]
};

const html = generateHTML(json, [
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
]);

console.log(html);
