import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

await page.goto('http://localhost:3000/places', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)

// Screenshot Abu Dhabi section
await page.screenshot({ path: 'screenshots/places-abudhabi.png', fullPage: false })

// Scroll down to see Dubai
await page.evaluate(() => window.scrollBy(0, 600))
await page.waitForTimeout(1000)
await page.screenshot({ path: 'screenshots/places-dubai.png', fullPage: false })

// Full page
await page.screenshot({ path: 'screenshots/places-full-loaded.png', fullPage: true })

await browser.close()
console.log('Screenshots saved to screenshots/')
