import { Node, mergeAttributes } from '@tiptap/core';

export const HtmlEmbed = Node.create({
  name: 'htmlEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      html: {
        default: '',
      },
      width: {
        default: 'full', // 'small' | 'medium' | 'full'
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-html-embed]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || 'full';
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-html-embed': '',
        class: `html-embed-block embed-width-${width}`,
      }),
      ['div', { class: 'embed-selection-overlay' }],
      ['div', { class: 'html-embed-container', 'data-content': HTMLAttributes.html }],
    ];
  },

  addCommands() {
    return {
      setHtmlEmbed: (attrs) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs,
        });
      },
      setHtmlEmbedWidth: (width) => ({ tr, state }) => {
        const { selection } = state;
        const node = state.doc.nodeAt(selection.from);
        if (node && node.type.name === 'htmlEmbed') {
          tr.setNodeMarkup(selection.from, undefined, {
            ...node.attrs,
            width,
          });
          return true;
        }
        return false;
      },
    };
  },
});
