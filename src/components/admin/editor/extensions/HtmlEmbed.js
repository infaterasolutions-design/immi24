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
        getAttrs: (node) => ({
          html: node.querySelector('.html-embed-content')?.innerHTML || '',
          width: node.getAttribute('data-width') || 'full',
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { html, width, ...rest } = HTMLAttributes;
    return [
      'div',
      mergeAttributes(rest, {
        'data-html-embed': '',
        'data-width': width,
        class: `html-embed-block embed-width-${width}`,
      }),
      ['div', { class: 'embed-selection-overlay' }],
      ['div', { class: 'html-embed-content' }, html],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement('div');
      const width = node.attrs.width || 'full';
      container.className = `html-embed-block embed-width-${width}`;
      container.setAttribute('data-html-embed', '');
      
      const overlay = document.createElement('div');
      overlay.className = 'embed-selection-overlay';
      container.appendChild(overlay);

      const content = document.createElement('div');
      content.className = 'html-embed-content-preview';
      content.innerHTML = node.attrs.html;
      
      // Handle scripts (like Twitter widgets)
      const scripts = content.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });

      // If it's a twitter tweet, we might need to trigger the global widgets.js if it exists
      if (node.attrs.html.includes('twitter-tweet') && window.twttr) {
        window.twttr.widgets.load(content);
      }

      container.appendChild(content);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false;
          if (updatedNode.attrs.html !== node.attrs.html) {
             content.innerHTML = updatedNode.attrs.html;
             // Re-run scripts if html changed
             const newScripts = content.querySelectorAll('script');
             newScripts.forEach(oldScript => {
               const newScript = document.createElement('script');
               Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
               newScript.appendChild(document.createTextNode(oldScript.innerHTML));
               oldScript.parentNode.replaceChild(newScript, oldScript);
             });
             if (updatedNode.attrs.html.includes('twitter-tweet') && window.twttr) {
               window.twttr.widgets.load(content);
             }
          }
          if (updatedNode.attrs.width !== node.attrs.width) {
            container.className = `html-embed-block embed-width-${updatedNode.attrs.width || 'full'}`;
          }
          return true;
        },
      };
    };
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
        const pos = selection.from;
        const node = state.doc.nodeAt(pos);
        if (node && node.type.name === 'htmlEmbed') {
          tr.setNodeMarkup(pos, undefined, {
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
