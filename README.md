# Brightloop Subscription & Invoicing Platform (Make_A_Ton)

This repository contains the modular components for the **Unified Subscription Management, Automated Invoicing & Recurring Billing System**.

---

## 👥 Contributors & Modules

### 👤 Member 1: Executive Analytics, Navigation & Real-time Notifications
- **Owner**: Rayhan (`reyyhann77`)
- **Files**:
  - `DashboardView.jsx` — Executive KPI Dashboard (MRR, ARR, Churn, Active Subscriptions, Growth metrics & charts)
  - `Navbar.jsx` — Main Application Navigation, Next Billing Day Countdown clock, Staff quick switcher
  - `NotificationToast.jsx` — Dynamic toasts for billing events, payments, cancellations

### 👤 Member 3: Automated Invoicing Engine & "Billing Day" Run
- **Owner**: Sreedhar (`sreedharhari2006-code`)
- **Files**:
  - `InvoicesView.jsx` — Invoices Ledger (Draft, Open, Paid, Overdue, Filters, Line item breakdowns)
  - `BillingDayModal.jsx` — Automated Billing Day Simulation (Sub-second batch generation, card charging, proration calculation, audit trail)
  - `InvoicePrintModal.jsx` — Professional Printable Tax Invoice modal with QR code, tax breakdown (GST/VAT), download/print triggers

---

## 📦 Exported Components (`index.js`)
- `DashboardView`, `Navbar`, `NotificationToast`
- `InvoicesView`, `BillingDayModal`, `InvoicePrintModal`
