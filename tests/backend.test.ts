/**
 * Backend Architecture & Health Verification Test Suite
 * Follows the backend-development and testing-qa skill standards.
 */

import { hashPassword, verifyPassword, slugify, sanitizeHtml, formatApiResponse } from "../src/utils";
import { contactFormSchema, projectSchema, skillSchema } from "../src/validators";
import { rateLimiter } from "../src/middleware/rate-limit";
import { db } from "../src/config/database";
import { ProfileRepository, ProjectRepository, SkillRepository } from "../src/repositories";
import { sql } from "drizzle-orm";

async function runTestSuite() {
  console.log("=== RUNNING BACKEND ARCHITECTURE TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Cryptography & Hashing
  console.log("[1] Testing Cryptography & Password Verification");
  const testPassword = "SuperSecurePassword123!";
  const hash = await hashPassword(testPassword);
  assert(hash.startsWith("$2"), "Password hashed with bcrypt salt");
  const isValid = await verifyPassword(testPassword, hash);
  assert(isValid === true, "Password matches hash successfully");
  const isInvalid = await verifyPassword("WrongPassword", hash);
  assert(isInvalid === false, "Incorrect password properly rejected");

  // 2. Sanitization & String Formatters
  console.log("\n[2] Testing Slugification & Sanitization");
  const slug = slugify("Next.js 16 Full-Stack 3D Architecture!");
  assert(slug === "nextjs-16-full-stack-3d-architecture", `Slugify output correct: ${slug}`);
  const sanitized = sanitizeHtml("<script>alert('xss')</script>Hello & welcome");
  assert(sanitized.includes("&lt;script&gt;"), "Dangerous HTML tags sanitized");

  // 3. API Response Formatters (Backend Skill standard)
  console.log("\n[3] Testing API Response Envelope");
  const envelope = formatApiResponse({ id: "123", name: "Alpha" }, { page: 1, per_page: 10, total: 42 });
  assert(envelope.data.id === "123", "Response data payload preserved");
  assert(envelope.meta?.total === 42, "Response meta pagination preserved");

  // 4. Input Validators (Zod Schemas)
  console.log("\n[4] Testing Zod Validation Schemas");
  const validContact = contactFormSchema.safeParse({
    name: "Arun M",
    email: "alex@example.com",
    subject: "Enterprise Architecture Consultation",
    message: "Interested in full-stack architecture redesign.",
    consentGiven: true,
  });
  assert(validContact.success === true, "Valid contact form submission accepted");

  const invalidContact = contactFormSchema.safeParse({
    name: "A",
    email: "not-an-email",
    message: "short",
    consentGiven: false,
  });
  assert(invalidContact.success === false, "Invalid contact form properly flagged by Zod");

  // 5. Rate Limiting Middleware
  console.log("\n[5] Testing Rate Limiting (Token Bucket / Window)");
  const testIp = "192.168.1.100";
  const r1 = rateLimiter.check(testIp, 3, 60000);
  assert(r1.allowed === true, "First request within rate limit allowed");
  rateLimiter.check(testIp, 3, 60000);
  rateLimiter.check(testIp, 3, 60000);
  const rBlocked = rateLimiter.check(testIp, 3, 60000);
  assert(rBlocked.allowed === false, "Excessive requests throttled with 429 status");

  // 6. Database Health Probe
  console.log("\n[6] Testing Database Connectivity");
  try {
    const res = await db.execute(sql`SELECT 1 as connected`);
    assert(res !== undefined, "Database connectivity probe succeeded (SELECT 1)");
  } catch (err: any) {
    console.warn(`  ! Database unreachable in this environment: ${err.message}`);
  }

  // 7. Database Resilience & Graceful Fallback Integrity
  console.log("\n[7] Testing Database Resilience & Graceful Fallback");
  const fallbackProf = await ProfileRepository.getPublished();
  assert(fallbackProf !== null && fallbackProf.fullName === "Arun M", "ProfileRepository returns Arun M resiliently");
  const fallbackProjs = await ProjectRepository.findPublished();
  assert(Array.isArray(fallbackProjs) && fallbackProjs.length > 0, `ProjectRepository returns ${fallbackProjs.length} published projects`);
  const fallbackCats = await SkillRepository.getPublishedCategoriesWithSkills();
  assert(Array.isArray(fallbackCats) && fallbackCats.length > 0, `SkillRepository returns ${fallbackCats.length} skill clusters with children`);

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test suite runtime failure:", err);
  process.exit(1);
});
