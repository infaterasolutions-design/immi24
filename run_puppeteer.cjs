const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://c:/Users/sande/Downloads/stitch_usa_immigration_live_news/public/test-tiptap.html', { waitUntil: 'networkidle0' });
  const output = await page.$eval('#output', el => el.textContent);
  console.log('OUTPUT:', output);
  await browser.close();
})();
