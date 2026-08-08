import { test, expect } from '@playwright/test'

const BASE = process.env.TEST_URL || 'https://jee-van-two.vercel.app'

test.describe('Onboarding', () => {
  test('Landing shows country selection', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('text=Where in the world are you?')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=Top Agricultural Nations')).toBeVisible({ timeout: 10000 })
  })

  test('Search finds India', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.locator('input[placeholder*="Search"]').fill('India')
    await expect(page.locator('text=India')).toBeVisible({ timeout: 10000 })
  })

  test('Click India advances to language', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    // Wait for country buttons to render
    await page.waitForSelector('button:has-text("India")', { timeout: 10000 })
    await page.locator('button:has-text("India")').first().click()
    // Country selection triggers setTimeout(onNext, 500) — wait for language page
    await page.waitForSelector('text=Choose your language', { timeout: 15000 })
  })
})

test.describe('Admin', () => {
  test('Hidden trigger exists', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    // The trigger is opacity:0.3 — Playwright needs it to be in DOM, not necessarily visible
    await page.waitForSelector('[aria-label="Admin access"]', { timeout: 10000, state: 'attached' })
  })

  test('Alpha passkey works', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[aria-label="Admin access"]', { timeout: 10000, state: 'attached' })
    await page.locator('[aria-label="Admin access"]').click()
    await expect(page.locator('text=Admin Authentication')).toBeVisible({ timeout: 8000 })
    await page.locator('input[placeholder="Enter passkey..."]').fill('JeeVan-Alpha-2024')
    await page.locator('text=Authenticate').click()
    // The app does window.location.href = '/admin/alpha' — wait for redirect
    try {
      await page.waitForURL(/admin/, { timeout: 15000 })
    } catch {
      // Fallback: check if we're already on an admin page
      const url = page.url()
      expect(url).toMatch(/admin|alpha|beta/)
    }
  })
})

test.describe('APIs', () => {
  test('countries', async ({ request }) => {
    const r = await request.get(`${BASE}/api/countries`)
    expect(r.status()).toBe(200)
    expect((await r.json()).data.length).toBeGreaterThan(0)
  })
  test('weather', async ({ request }) => {
    const r = await request.get(`${BASE}/api/weather?lat=25.13&lng=85.44&days=7`)
    expect(r.status()).toBe(200)
    expect((await r.json()).forecast.length).toBeGreaterThan(0)
  })
  test('market', async ({ request }) => {
    const r = await request.get(`${BASE}/api/market?commodity=rice`)
    expect(r.status()).toBe(200)
    expect((await r.json()).data.length).toBeGreaterThan(0)
  })
  test('match', async ({ request }) => {
    const r = await request.post(`${BASE}/api/match`, { data: { lat: 25.13, lng: 85.44, month: 7, soilType: 'loam' } })
    expect(r.status()).toBe(200)
    expect((await r.json()).recommendations.length).toBeGreaterThan(0)
  })
  test('ai', async ({ request }) => {
    const r = await request.post(`${BASE}/api/ai`, { data: { query: 'rice Bihar' } })
    expect(r.status()).toBe(200)
    expect((await r.json()).response).toBeDefined()
  })
  test('translate', async ({ request }) => {
    const r = await request.post(`${BASE}/api/translate`, { data: { text: 'Hello', source: 'en', target: 'hi' } })
    expect(r.status()).toBe(200)
    expect((await r.json()).translatedText).toBeDefined()
  })
  test('auth valid', async ({ request }) => {
    const r = await request.post(`${BASE}/api/admin/auth`, { data: { passkey: 'JeeVan-Alpha-2024' } })
    expect([200, 429]).toContain(r.status())
    if (r.status() === 200) expect((await r.json()).success).toBe(true)
  })
  test('auth invalid', async ({ request }) => {
    await new Promise(r => setTimeout(r, 2000))
    const r = await request.post(`${BASE}/api/admin/auth`, { data: { passkey: 'wrongpassword123' } })
    expect([401, 429]).toContain(r.status())
  })
})

test.describe('Performance', () => {
  test('landing loads', async ({ page }) => {
    const s = Date.now()
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    expect(Date.now() - s).toBeLessThan(25000)
  })
  test('no console errors', async ({ page }) => {
    const e: string[] = []
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) e.push(m.text()) })
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)
    const real = e.filter(x => !x.includes('Third-party') && !x.includes('CORS') && !x.includes('Failed to fetch'))
    expect(real).toHaveLength(0)
  })
})
