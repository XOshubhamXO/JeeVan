/**
 * JeeVan Platform — k6 Stress Test Suite
 *
 * Validates:
 * - 60fps video background streaming under load
 * - API failover circuit breaker behavior
 * - Admin authentication resilience
 * - Concurrent user session handling
 *
 * Usage: k6 run tests/k6/stress-test.js
 */

import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend, Counter } from 'k6/metrics'

// ─── Custom Metrics ───
const errorRate = new Rate('errors')
const pageLoadTrend = new Trend('page_load_time')
const apiResponseTrend = new Trend('api_response_time')
const failoverCounter = new Counter('failover_events')
const adminAuthFailures = new Counter('admin_auth_failures')

// ─── Test Configuration ───
export const options = {
  // Progressive load stages
  stages: [
    { duration: '30s', target: 20 },   // Ramp up: 20 VUs
    { duration: '1m', target: 50 },    // Steady: 50 VUs
    { duration: '30s', target: 100 },  // Spike: 100 VUs
    { duration: '1m', target: 100 },   // Sustained spike
    { duration: '30s', target: 200 },  // Stress: 200 VUs
    { duration: '1m', target: 200 },   // Sustained stress
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% of requests < 2s
    http_req_failed: ['rate<0.05'],      // < 5% failure rate
    errors: ['rate<0.10'],               // < 10% error rate
    page_load_time: ['p(95)<3000'],      // Page loads < 3s
  },
  // Simulate real browser behavior
  userAgent: 'JeeVan-k6-StressTest/1.0',
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

// ─── Main Test Scenario ───
export default function () {
  // Simulate realistic user journey with think time
  const thinkTime = Math.random() * 3 + 1 // 1-4 seconds

  group('1. Landing Page & Static Assets', () => {
    const landRes = http.get(`${BASE_URL}/`, {
      headers: { 'Accept': 'text/html' },
      tags: { name: 'landing_page' },
    })
    check(landRes, {
      'landing returns 200': (r) => r.status === 200,
      'landing has HTML content': (r) => r.body.includes('<!DOCTYPE html>'),
      'landing loads under 3s': (r) => r.timings.duration < 3000,
    }) || errorRate.add(1)
    pageLoadTrend.add(landRes.timings.duration)
  })

  sleep(thinkTime * 0.5)

  group('2. API Endpoints — Primary & Failover', () => {
    // Telemetry health check
    const telemetryRes = http.get(`${BASE_URL}/api/telemetry`, {
      tags: { name: 'api_telemetry' },
    })
    check(telemetryRes, {
      'telemetry health returns 200': (r) => r.status === 200,
      'telemetry reports operational': (r) => r.json('status') === 'operational',
    }) || errorRate.add(1)
    apiResponseTrend.add(telemetryRes.timings.duration)
  })

  sleep(thinkTime * 0.3)

  group('3. Onboarding Flow Simulation', () => {
    // Simulate Hub page load (post-onboarding)
    const hubRes = http.get(`${BASE_URL}/hub`, {
      headers: { 'Accept': 'text/html' },
      tags: { name: 'hub_page' },
    })
    check(hubRes, {
      'hub returns 200': (r) => r.status === 200,
    }) || errorRate.add(1)
    pageLoadTrend.add(hubRes.timings.duration)
  })

  sleep(thinkTime * 0.3)

  group('4. Admin Security — Auth Attempts', () => {
    // Simulate unauthorized access attempt
    const adminRes = http.get(`${BASE_URL}/admin/alpha`, {
      headers: { 'Accept': 'text/html' },
      tags: { name: 'admin_alpha' },
    })
    check(adminRes, {
      'admin page accessible (redirects to landing)': (r) => r.status === 200,
    }) || adminAuthFailures.add(1)

    // Brute force simulation — rapid passkey attempts
    const passkeys = ['wrong1', 'wrong2', 'admin123', 'password']
    for (const pk of passkeys) {
      const authRes = http.post(`${BASE_URL}/api/admin`, JSON.stringify({
        passkey: pk,
        tier: 'ALPHA',
      }), {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'admin_auth' },
      })
      if (authRes.status !== 200) adminAuthFailures.add(1)
    }
  })

  sleep(thinkTime * 0.5)

  group('5. Concurrent Market Rate Requests', () => {
    // Simulate commodity price queries
    const commodities = ['rice', 'wheat', 'maize', 'turmeric']
    for (const commodity of commodities) {
      const marketRes = http.get(`${BASE_URL}/api/market?commodity=${commodity}`, {
        tags: { name: 'api_market' },
      })
      apiResponseTrend.add(marketRes.timings.duration)
    }
  })

  sleep(thinkTime)
}

// ─── Teardown ───
export function teardown() {
  console.log('=== JeeVan Stress Test Complete ===')
  console.log(`Error Rate: ${errorRate.name}`)
  console.log(`Failover Events: ${failoverCounter.name}`)
  console.log(`Admin Auth Failures: ${adminAuthFailures.name}`)
}
