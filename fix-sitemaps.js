const fs = require('fs');
const path = require('path');

const sitemapDir = path.join(__dirname, 'src/app');

// We will find all route.js inside sitemap-*/route.js
const files = fs.readdirSync(sitemapDir)
  .filter(d => d.startsWith('sitemap'))
  .map(d => path.join(sitemapDir, d, 'route.js'))
  .filter(f => fs.existsSync(f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // For Array.from(urls).map(...)
  if (content.includes('Array.from(urls).map(path => {')) {
    content = content.replace(
      'Array.from(urls).map(path => {',
      'Array.from(urls).filter(path => !["/category/", "/maryland/", "/minnesota/", "/live-updates/"].some(prefix => path.startsWith(prefix))).map(path => {'
    );
  }

  // For (articles || []).map(article => {
  if (content.includes('(articles || []).map(article => {')) {
    content = content.replace(
      '(articles || []).map(article => {',
      '(articles || []).filter(article => {\n    const path = article.cluster_slug ? `/${article.cluster_slug}/${article.slug}` : `/${article.slug}`;\n    return !["/category/", "/maryland/", "/minnesota/", "/live-updates/"].some(prefix => path.startsWith(prefix));\n  }).map(article => {'
    );
  }

  // Also in sitemap-locations.xml there might be Array.from(urls).map
  // or it might be data.map. Let's check sitemap-locations.xml:
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
});
