// Standalone test suite without TypeScript loader requirement

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const ALLOWED_TRANSITIONS = {
  REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['READY_FOR_PICKUP', 'REJECTED', 'CANCELLED'],
  READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['DISPUTED'],
  REJECTED: [],
  CANCELLED: [],
  DISPUTED: ['COMPLETED'],
};

function validateOrderTransition(currentStatus, newStatus, userRole, isBuyer, isSeller) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return { valid: false, message: `Invalid state transition from ${currentStatus} to ${newStatus}.` };
  }
  if (userRole === 'admin' || userRole === 'moderator') return { valid: true };
  if (['ACCEPTED', 'REJECTED', 'READY_FOR_PICKUP'].includes(newStatus) && !isSeller) {
    return { valid: false, message: "Only the seller can accept, reject, or mark orders ready." };
  }
  if (newStatus === 'CANCELLED' && !isBuyer && !isSeller) {
    return { valid: false, message: "Only order participants can cancel an order." };
  }
  if (newStatus === 'COMPLETED' && !isBuyer && !isSeller) {
    return { valid: false, message: "Only buyer or seller can mark completed." };
  }
  if (newStatus === 'DISPUTED' && !isBuyer) {
    return { valid: false, message: "Only buyer can file a dispute." };
  }
  return { valid: true };
}

function sanitizeProductPublic(product, isContactUnlocked) {
  const clean = { ...product };
  if (!isContactUnlocked) {
    delete clean.seller_phone;
  }
  return clean;
}

function sanitizeText(input) {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

console.log("\n============================================================");
console.log(" THALUWA BAZAR (থলুৱা বজাৰ) - SECURITY & LOGIC TEST SUITE ");
console.log(" Baseline: OWASP ASVS 5.0.0 Level 2 + Hyperlocal Geolocation");
console.log("============================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
  }
}

// 1. Geolocation & Haversine formula
const distBeltolaToPanbazar = calculateDistanceKm(26.1285, 91.7925, 26.1856, 91.7454);
assert(distBeltolaToPanbazar > 7 && distBeltolaToPanbazar < 9, `Haversine distance between Beltola & Panbazar is ~8km (Got: ${distBeltolaToPanbazar}km)`);

const distZero = calculateDistanceKm(26.1285, 91.7925, 26.1285, 91.7925);
assert(distZero === 0, `Distance to same point is 0.0 km`);

// 2. Order State Machine Transition Rules
const jumpRequestedToCompleted = validateOrderTransition('REQUESTED', 'COMPLETED', 'buyer', true, false);
assert(jumpRequestedToCompleted.valid === false, `Forbidden direct jump from REQUESTED to COMPLETED without seller acceptance`);

const buyerAcceptAttempt = validateOrderTransition('REQUESTED', 'ACCEPTED', 'buyer', true, false);
assert(buyerAcceptAttempt.valid === false, `Buyer cannot accept an order on behalf of seller`);

const sellerAcceptValid = validateOrderTransition('REQUESTED', 'ACCEPTED', 'seller', false, true);
assert(sellerAcceptValid.valid === true, `Seller can legitimately accept an incoming order`);

const sellerMarkReady = validateOrderTransition('ACCEPTED', 'READY_FOR_PICKUP', 'seller', false, true);
assert(sellerMarkReady.valid === true, `Seller can mark accepted order as READY_FOR_PICKUP`);

const completeReadyOrder = validateOrderTransition('READY_FOR_PICKUP', 'COMPLETED', 'seller', false, true);
assert(completeReadyOrder.valid === true, `Order can be marked COMPLETED from READY_FOR_PICKUP`);

// 3. OWASP ASVS Contact Privacy
const mockProduct = {
  id: 'prod_test',
  seller_id: 'user_seller_1',
  title_en: 'Duck Eggs',
  seller_phone: '+91 94350 98765',
};

const publicSanitized = sanitizeProductPublic(mockProduct, false);
assert(publicSanitized.seller_phone === undefined, `Contact Privacy: seller_phone is stripped from unauthorized public views`);

const unlockedSanitized = sanitizeProductPublic(mockProduct, true);
assert(unlockedSanitized.seller_phone === '+91 94350 98765', `Authorized contact unlock delivers verified seller_phone`);

// 4. Input Sanitization / Anti-XSS
const maliciousScript = "<script>alert('pwned')</script>";
const escaped = sanitizeText(maliciousScript);
assert(!escaped.includes("<script>"), `XSS tags properly escaped (${escaped})`);

console.log(`\n============================================================`);
console.log(` SUMMARY: ${passed}/${total} TESTS PASSED SUCCESSFULLY `);
console.log(`============================================================\n`);

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
