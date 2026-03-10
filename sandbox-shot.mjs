import puppeteer from './node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
const browser = await puppeteer.launch({ executablePath: 'C:/Users/tlisb/.cache/puppeteer/chrome/win64-145.0.7632.77/chrome-win64/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1000));
await page.evaluate(() => {
  document.querySelectorAll('.pre-reveal').forEach(el => el.classList.remove('pre-reveal'));
});
await new Promise(r => setTimeout(r, 500));

// Hero (above fold)
await page.screenshot({ path: 'temporary screenshots/chk-hero.png', clip: { x: 0, y: 0, width: 1366, height: 768 } });

// Problem section
const probBox = await page.evaluate(() => {
  const el = document.querySelector('.problem-wrapper');
  el.scrollIntoView();
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1366, height: Math.min(el.offsetHeight, 1400) };
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/chk-problem.png', clip: probBox });

// Sandbox section
const sbBox = await page.evaluate(() => {
  const el = document.getElementById('sandbox');
  el.scrollIntoView();
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1366, height: el.offsetHeight };
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/chk-sandbox.png', clip: sbBox });

// Operators / TRA section
const opsBox = await page.evaluate(() => {
  const el = document.querySelector('.operators-wrapper');
  el.scrollIntoView();
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1366, height: el.offsetHeight };
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/chk-operators.png', clip: opsBox });

// Pricing section
const pricingBox = await page.evaluate(() => {
  const el = document.querySelector('.pricing-wrapper');
  el.scrollIntoView();
  const r = el.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1366, height: el.offsetHeight };
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: 'temporary screenshots/chk-pricing.png', clip: pricingBox });
await browser.close();
console.log('done');
