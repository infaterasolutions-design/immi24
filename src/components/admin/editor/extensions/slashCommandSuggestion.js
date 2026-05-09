import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import CommandList from '../CommandList';
import { 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Minus, Image as ImageIcon, Video, Twitter, Table, Link2 
} from 'lucide-react';

export default function getSuggestion(onInternalLinkTrigger, onEmbedClick, onImageClick) {
  return {
    items: ({ query }) => {
      const allItems = [
        {
          title: 'Heading 1',
          icon: <Heading1 size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
          },
        },
        {
          title: 'Heading 2',
          icon: <Heading2 size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
          },
        },
        {
          title: 'Heading 3',
          icon: <Heading3 size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
          },
        },
        {
          title: 'Bullet List',
          icon: <List size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
          },
        },
        {
          title: 'Numbered List',
          icon: <ListOrdered size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
          },
        },
        {
          title: 'Quote',
          icon: <Quote size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run()
          },
        },
        {
          title: 'Divider',
          icon: <Minus size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHorizontalRule().run()
          },
        },
        {
          title: 'Table',
          icon: <Table size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          },
        },
        {
          title: 'Internal Link',
          icon: <Link2 size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            if (onInternalLinkTrigger) onInternalLinkTrigger();
          },
        },
        {
          title: 'Image',
          icon: <ImageIcon size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            if (onImageClick) onImageClick();
          },
        },
        {
          title: 'YouTube / Embed',
          icon: <Video size={16} />,
          command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).run();
            if (onEmbedClick) onEmbedClick();
          },
        },
      ];

      return allItems.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
    },

    render: () => {
      let component;
      let popup;

      return {
        onStart: props => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}
