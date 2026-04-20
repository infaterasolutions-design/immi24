import { Node, mergeAttributes } from '@tiptap/core';

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div.info-callout',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'info-callout' }), 0];
  },

  addCommands() {
    return {
      setCallout: () => ({ commands }) => {
        return commands.wrapIn(this.name);
      },
      toggleCallout: () => ({ commands }) => {
        return commands.toggleNode(this.name, 'paragraph');
      },
    };
  },
});
