import { chromium } from 'playwright-core';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

const pages = [
  { name: '01-home', url: 'https://askuae.vercel.app/home' },
  { name: '02-comparison', url: 'https://askuae.vercel.app/comparison' },
  { name: '03-politics', url: 'https://askuae.vercel.app/politics' },
  { name: '04-economy', url: 'https://askuae.vercel.app/economy' },
  { name: '05-society', url: 'https://askuae.vercel.app/society' },
  { name: '06-industry', url: 'https://askuae.vercel.app/industry' },
  { name: '07-legal', url: 'https://askuae.vercel.app/legal' },
  { name: '08-news', url: 'https://askuae.vercel.app/news' },
];

// Find cached chromium
const cachedChromium = '/Users/sjbaek/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

async function main() {
  // Create output directory
  await mkdir('forchatgpt', { recursive: true });

  if (!existsSync(cachedChromium)) {
    console.error('Cached Chromium not found at:', cachedChromium);
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: cachedChromium,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  for (const page of pages) {
    const p = await context.newPage();
    await p.goto(page.url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2000);
    await p.screenshot({
      path: `forchatgpt/${page.name}.png`,
      fullPage: true,
    });
    console.log(`Captured: ${page.name}`);
    await p.close();
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
