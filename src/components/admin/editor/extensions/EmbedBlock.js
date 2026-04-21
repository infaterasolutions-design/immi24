import { Node, mergeAttributes } from '@tiptap/core';

/**
 * Detects the platform from a URL and returns embed metadata.
 */
function detectEmbed(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace('www.', '');

    // YouTube
    if (host === 'youtube.com' || host === 'youtu.be') {
      let videoId = '';
      if (host === 'youtu.be') {
        videoId = u.pathname.slice(1);
      } else {
        videoId = u.searchParams.get('v') || '';
        if (!videoId && u.pathname.startsWith('/shorts/')) {
          videoId = u.pathname.replace('/shorts/', '');
        }
      }
      if (videoId) {
        return {
          platform: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          aspectRatio: '16/9',
        };
      }
    }

    // Twitter / X
    if (host === 'twitter.com' || host === 'x.com') {
      const match = u.pathname.match(/\/(\w+)\/status\/(\d+)/);
      if (match) {
        return {
          platform: 'twitter',
          tweetUrl: url,
          tweetId: match[2],
          user: match[1],
        };
      }
    }

    // Instagram
    if (host === 'instagram.com') {
      const match = u.pathname.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
      if (match) {
        return {
          platform: 'instagram',
          embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed`,
          aspectRatio: '4/5',
        };
      }
    }

    // Facebook
    if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch') {
      return {
        platform: 'facebook',
        embedUrl: `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`,
        aspectRatio: '16/9',
      };
    }

    // LinkedIn
    if (host === 'linkedin.com') {
      const match = u.pathname.match(/\/posts\/|\/pulse\//);
      if (match) {
        return { platform: 'linkedin', originalUrl: url };
      }
    }

    return { platform: 'generic', originalUrl: url };
  } catch {
    return null;
  }
}

export const EmbedBlock = Node.create({
  name: 'embedBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      platform: { default: 'generic' },
      width: { default: 'full' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-embed-block]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src || '';
    const data = detectEmbed(src);
    const platform = data?.platform || 'generic';
    const width = HTMLAttributes.width || 'full';

    const wrapperAttrs = mergeAttributes(HTMLAttributes, {
      'data-embed-block': '',
      'data-platform': platform,
      'data-width': width,
      class: `embed-block embed-${platform} embed-width-${width}`,
    });

    if (platform === 'youtube') {
      return ['div', wrapperAttrs,
        ['div', { class: 'embed-responsive', style: 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;' },
          ['iframe', {
            src: data.embedUrl,
            frameborder: '0',
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowfullscreen: 'true',
            loading: 'lazy',
            style: 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;',
          }],
        ],
      ];
    }

    if (platform === 'instagram') {
      return ['div', wrapperAttrs,
        ['iframe', {
          src: data.embedUrl,
          frameborder: '0',
          scrolling: 'no',
          allowtransparency: 'true',
          loading: 'lazy',
          style: 'width:100%;min-height:480px;border:0;border-radius:8px;',
        }],
      ];
    }

    if (platform === 'facebook') {
      return ['div', wrapperAttrs,
        ['iframe', {
          src: data.embedUrl,
          frameborder: '0',
          scrolling: 'no',
          allowfullscreen: 'true',
          allow: 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share',
          loading: 'lazy',
          style: 'width:100%;min-height:400px;border:0;border-radius:8px;',
        }],
      ];
    }

    if (platform === 'twitter') {
      return ['div', wrapperAttrs,
        ['div', { class: 'embed-twitter-placeholder' },
          ['span', { class: 'embed-icon' }, '𝕏'],
          ['a', { href: src, target: '_blank', rel: 'noopener noreferrer' }, `Tweet: ${src}`],
        ],
      ];
    }

    return ['div', wrapperAttrs,
      ['div', { class: 'embed-link-card' },
        ['span', { class: 'embed-icon' }, '🔗'],
        ['a', { href: src, target: '_blank', rel: 'noopener noreferrer' }, src],
      ],
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const src = node.attrs.src || '';
      const data = detectEmbed(src);
      const platform = data?.platform || 'generic';
      const width = node.attrs.width || 'full';

      const dom = document.createElement('div');
      dom.className = `embed-block embed-${platform} embed-width-${width}`;
      dom.setAttribute('data-embed-block', '');
      dom.setAttribute('data-platform', platform);
      dom.setAttribute('data-width', width);

      // Add overlay for editor
      const overlay = document.createElement('div');
      overlay.className = 'embed-selection-overlay';
      dom.appendChild(overlay);

      // Add actual content preview
      const content = document.createElement('div');
      content.className = 'embed-content-preview';
      
      if (platform === 'youtube') {
        content.innerHTML = `<div class="embed-responsive" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;"><iframe src="${data.embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe></div>`;
      } else if (platform === 'instagram' || platform === 'facebook') {
        content.innerHTML = `<iframe src="${data.embedUrl}" style="width:100%;min-height:400px;border:0;border-radius:8px;"></iframe>`;
      } else if (platform === 'twitter') {
        content.innerHTML = `<div class="embed-twitter-placeholder"><span class="embed-icon">𝕏</span><a href="${src}" target="_blank">Tweet: ${src}</a></div>`;
      } else {
        content.innerHTML = `<div class="embed-link-card"><span class="embed-icon">🔗</span><a href="${src}" target="_blank">${src}</a></div>`;
      }
      
      dom.appendChild(content);

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false;
          if (updatedNode.attrs.width !== node.attrs.width) {
            dom.className = `embed-block embed-${platform} embed-width-${updatedNode.attrs.width || 'full'}`;
          }
          return true;
        }
      };
    };
  },

  addCommands() {
    return {
      setEmbed: (attrs) => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs });
      },
      setEmbedWidth: (width) => ({ tr, state }) => {
        const { selection } = state;
        const node = state.doc.nodeAt(selection.from);
        if (node && node.type.name === 'embedBlock') {
          tr.setNodeMarkup(selection.from, undefined, { ...node.attrs, width });
          return true;
        }
        return false;
      },
    };
  },
});
