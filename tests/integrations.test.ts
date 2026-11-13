/**
 * Tests for the Free Service Integrations & Zero-Cost Fallbacks
 * Active Services: Resend (Email), Monkeytype (Typing), GeoIP/IPstack, Upstash (Rate Limiter)
 */

import { resendService } from "../lib/integrations/resend";
import { monkeytypeService } from "../lib/integrations/monkeytype";
import { geoService } from "../lib/integrations/ipstack";
import { upstashService } from "../lib/integrations/upstash";

async function runIntegrationTests() {
  console.log("=== RUNNING ESSENTIAL FREE SERVICE INTEGRATION TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Resend
  console.log("[1] Testing Resend Free Tier Integration");
  const resendHealth = resendService.getHealth();
  assert(resendHealth.plan.includes("Free Tier"), "Resend plan is Free Tier");
  assert(resendHealth.cost === "$0.00 / Free", "Resend cost is strictly $0.00");
  const emailRes = await resendService.sendEmail({
    to: "test@example.com",
    subject: "Test Free Email",
    html: "<p>Hello Free Tier</p>",
  });
  assert(emailRes.success, `Resend sendEmail succeeded (${emailRes.mode})`);
  const audiences = await resendService.listAudiences();
  assert(audiences.success && audiences.data.length > 0, "Resend listAudiences returned active audiences");

  // 2. Monkeytype API
  console.log("\n[2] Testing Monkeytype 100% Free Public API");
  const monkeyHealth = monkeytypeService.getHealth();
  assert(monkeyHealth.plan.includes("100% Free Public"), "Monkeytype is 100% Free Public API");
  const monkeyStats = await monkeytypeService.getStats();
  assert(monkeyStats.success && monkeyStats.data.wpm > 0, `Monkeytype stats returned (WPM: ${monkeyStats.data.wpm})`);

  // 3. IPstack / Free GeoIP
  console.log("\n[3] Testing GeoIP & IPstack Free Tier / Fallback");
  const geoHealth = geoService.getHealth();
  assert(geoHealth.plan.includes("100% Free Plan"), "GeoIP plan is 100% Free Plan");
  const geoResult = await geoService.lookup("8.8.8.8");
  assert(Boolean(geoResult.countryCode), `GeoIP lookup succeeded (Country: ${geoResult.countryCode})`);

  // 4. Upstash
  console.log("\n[4] Testing Upstash Free Serverless Tier & Sliding Window Rate Limiter");
  const upstashHealth = upstashService.getHealth();
  assert(upstashHealth.plan.includes("100% Free Serverless"), "Upstash is 100% Free Serverless Tier");
  const rateLimit = await upstashService.checkRateLimit("test-user-ip", 5, 10);
  assert(rateLimit.success && rateLimit.remaining >= 0, `Upstash rate limit checked (${rateLimit.mode})`);

  console.log(`\n=== INTEGRATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runIntegrationTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
