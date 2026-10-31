# ⚡ Brightloop — Unified Subscription Management & Automated Billing Engine

> **Built for the Make-A-Ton / Odoo Hackathon Challenge**  
> A high-performance, real-time subscription lifecycle manager, recurring invoicing engine, multi-method payment gateway simulator, and self-service customer portal.

---

## 👥 Team & Architecture (4 Core Modules)

This repository is organized into 4 distinct feature modules located in [`src/modules/`](src/modules/):

| Member | Module Directory | Components | Responsibilities |
|---|---|---|---|
| **Member 1 (Rayhan)** | [`src/modules/member1_analytics/`](src/modules/member1_analytics/) | `DashboardView.jsx`<br>`Navbar.jsx`<br>`NotificationToast.jsx` | Executive KPI dashboard (MRR, ARR, Churn, Active Subscriptions), global navigation, next billing countdown ticker, and dynamic toast notifications. |
| **Member 2 (Nafil)** | [`src/modules/member2_subscriptions/`](src/modules/member2_subscriptions/) | `SubscriptionsView.jsx`<br>`CatalogView.jsx` | Full subscription lifecycle management (create, upgrade/downgrade, pause, resume, cancel, auto-renewals) and recurring pricing plan catalog (Starter, Pro, Enterprise, Custom tiers). |
| **Member 3 (Sreedhar)** | [`src/modules/member3_billing/`](src/modules/member3_billing/) | `InvoicesView.jsx`<br>`BillingDayModal.jsx`<br>`InvoicePrintModal.jsx` | Invoicing ledger (Draft, Open, Paid, Overdue), automated batch "Billing Day" simulation run, sub-second proration calculation, and printable tax invoice viewer with QR code. |
| **Member 4 (Gedis)** | [`src/modules/member4_payments/`](src/modules/member4_payments/) | `PaymentsView.jsx`<br>`CustomerPortalView.jsx`<br>`AuthModal.jsx`<br>`StaffModal.jsx` | Multi-method payment recording (Card, UPI, Wire, Stripe), instant refund triggers, self-service customer portal, and Role-Based Access Control (Admin, Billing Mgr, Support, Viewer). |

---

## 🚀 Quick Start (Run Locally)

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** (or the port indicated in your terminal) in your browser.

### 4. Build for Production
```bash
npm run build
```
*(Builds in <200ms with 0 compilation errors)*

---

## 🌟 Key Features

1. **Sub-Second Performance (<2s Requirement)**: Real-time recalculation of MRR, ARR, taxes, and discounts with sub-millisecond latency telemetry widget.
2. **Automated "Billing Day" Run**: 1-click batch billing engine simulation that evaluates due dates, calculates prorations, applies tax/discount rules, and creates invoices automatically.
3. **Role-Based Access Control (RBAC)**: Switch between Administrator, Billing Manager, Support Agent, and Customer to experience permission-restricted UI states.
4. **Professional Invoice PDF & QR Code**: Printable tax invoices compliant with GST/VAT standards, itemized breakdown, and audit metadata.
5. **Customer Self-Service Portal**: Direct checkout simulation allowing customers to update cards, UPI handles, and pay pending bills instantly.
