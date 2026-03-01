import { chromium } from 'playwright-core'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
const page = await ctx.newPage()

await page.goto('http://localhost:3000/places', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

// Full page - All
await page.screenshot({ path: 'screenshots/places-all-loaded.png', fullPage: true })
console.log('Saved: places-all-loaded.png')

// Click Abu Dhabi tab
const adBtn = page.locator('button:has-text("Abu Dhabi")')
if (await adBtn.count() > 0) {
  await adBtn.click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'screenshots/places-abudhabi-tab.png', fullPage: true })
  console.log('Saved: places-abudhabi-tab.png')
}

// Click Dubai tab
const dubaiBtn = page.locator('button:has-text("Dubai")')
if (await dubaiBtn.count() > 0) {
  await dubaiBtn.click()
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'screenshots/places-dubai-tab.png', fullPage: true })
  console.log('Saved: places-dubai-tab.png')
}

await browser.close()
