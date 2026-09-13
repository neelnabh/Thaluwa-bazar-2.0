# Thaluwa Bazar (থলুৱা বজাৰ)
> **Assam-First Hyperlocal Marketplace connecting nearby buyers & local sellers within ~5 km.**

Built strictly following the **Startup & High-Security Blueprint** and **OWASP ASVS 5.0.0 Level 2** baseline.

---

## 🌟 Core Highlights

1. **Assam-First Localization**: Full dual-language interface (অসমীয়া-first with instant English fallback).
2. **Hyperlocal Radius Engine**: Haversine distance calculator with live 1km - 25km radius filter and quick selection across Assam markets (Beltola, Panbazar, Uzanbazar, Dispur, Maligaon, Jorhat, Dibrugarh, Tezpur, Silchar, etc.).
3. **OWASP ASVS Contact Privacy**: Seller phone numbers and private identifiers are never exposed in public API responses until an authorized contact unlock is performed.
4. **Server-Enforced Order State Machine**:
   $$\text{REQUESTED} \longrightarrow \text{ACCEPTED} \longrightarrow \text{READY\_FOR\_PICKUP} \longrightarrow \text{COMPLETED}$$
5. **Role-Based Workspaces**:
   - 🛒 **Buyer**: Discover local fresh items, save favorites, unlock contacts, track live orders.
   - 🧑‍🌾 **Seller**: Manage listings, adjust availability, process orders through the state machine.
   - 🛡️ **Moderator**: Review community violation reports and flag suspicious listings.
   - 👑 **Super Admin**: Marketplace economics configuration, analytics, and immutable security audit logs.
6. **Instant Demo Role Switcher**: Top toolbar to switch between roles on the fly for verification.

---

## 🚀 Getting Started

### 1. Installation & Running
```bash
# Navigate to project
cd C:\Users\HP\.gemini\antigravity\scratch\thaluwa-bazar

# Run automated security test suite
node test.js

# Start local dev server
cmd /c "npm run dev"
```
Open **http://localhost:3000** in your browser.

---

## 🔒 Security Baseline (OWASP ASVS 5.0.0 Level 2)

- **Contact Privacy Flow**: Phone numbers are masked in listing payloads.
- **Strict Parameter Validation & Escaping**: Prevents XSS, SQLi, and prototype pollution.
- **Audit Logging**: Every privileged transaction and contact unlock is logged with actor, timestamp, IP, and result.
- **Rate Limiting**: Throttles brute-force attempts on sensitive endpoints.
