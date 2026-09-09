const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:3000/federal-court-blocks-trump-birthright-citizenship-order', { waitUntil: 'networkidle0' });
  
  await page.evaluate(async () => {
    const iframes = document.querySelectorAll('iframe[src*="youtube"]');
    if (iframes.length === 0) {
      console.log('NO IFRAMES FOUND');
      return;
    }
    const iframe = iframes[0];
    
    console.log('Initial iframe rect:', iframe.getBoundingClientRect());
    console.log('Initial iframe classes:', iframe.className);
    
    // Scroll down to 3500px
    for (let i = 0; i <= 3500; i += 100) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 50));
    }
    
    console.log('After scroll iframe classes:', iframe.className);
    const formatRect = r => ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height });
    console.log('After scroll iframe rect:', formatRect(iframe.getBoundingClientRect()));
    const computed = window.getComputedStyle(iframe);
    console.log('After scroll iframe position:', computed.position);
    console.log('After scroll iframe bottom:', computed.bottom);
    console.log('After scroll iframe right:', computed.right);
    console.log('After scroll iframe width:', computed.width);
    console.log('After scroll iframe height:', computed.height);
    console.log('After scroll iframe z-index:', computed.zIndex);
    
    const wrapper = iframe.closest('.embed-block') || iframe.closest('[data-youtube-video]') || iframe.parentElement;
    console.log('After scroll wrapper tagName:', wrapper.tagName);
    console.log('After scroll wrapper className:', wrapper.className);
    console.log('After scroll wrapper rect:', formatRect(wrapper.getBoundingClientRect()));
  });
  
  await page.screenshot({ path: 'pip_test.png', fullPage: true });
  await browser.close();
})();
