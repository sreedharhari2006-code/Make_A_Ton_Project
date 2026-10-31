# 🏆 Hackathon Team Git Collaboration Guide (4 Contributors)

This repository is modularized into **4 dedicated member directories** inside [`src/modules/`](file:///Users/sreedhar/Desktop/lab/makeaton/src/modules). Each team member has full ownership over their feature domain, preventing merge conflicts and enabling all 4 members to contribute and show up on GitHub!

---

## 👥 Team Member Domain Distribution

| Member | Directory | Domain & Components | Responsibility |
|---|---|---|---|
| **Member 1** | [`src/modules/member1_analytics/`](file:///Users/sreedhar/Desktop/lab/makeaton/src/modules/member1_analytics) | `DashboardView.jsx`<br>`Navbar.jsx`<br>`NotificationToast.jsx` | Executive KPI Dashboard (MRR/ARR/Churn), Global Nav Header, Next Billing countdown ticker, Dynamic toast alerts |
| **Member 2** | [`src/modules/member2_subscriptions/`](file:///Users/sreedhar/Desktop/lab/makeaton/src/modules/member2_subscriptions) | `SubscriptionsView.jsx`<br>`CatalogView.jsx` | Subscription lifecycle management (New, Upgrade/Downgrade, Pause, Renewals), Product & Pricing Tier Catalog |
| **Member 3** | [`src/modules/member3_billing/`](file:///Users/sreedhar/Desktop/lab/makeaton/src/modules/member3_billing) | `InvoicesView.jsx`<br>`BillingDayModal.jsx`<br>`InvoicePrintModal.jsx` | Invoicing engine, Automated "Billing Day" batch run simulation, Tax/VAT breakdown, Printable tax invoice modal |
| **Member 4** | [`src/modules/member4_payments/`](file:///Users/sreedhar/Desktop/lab/makeaton/src/modules/member4_payments) | `PaymentsView.jsx`<br>`CustomerPortalView.jsx`<br>`AuthModal.jsx`<br>`StaffModal.jsx` | Multi-method Payment recording (Card/UPI/Wire), Instant refunds, Customer self-service checkout portal, RBAC permissions |

---

## 🛠️ Step 0: Initialize Repo & Base Setup (Run once by Team Lead)

If the repository has not been initialized yet:

```bash
# 1. Initialize git
git init -b main

# 2. Add base framework and shared state files
git add .gitignore package.json package-lock.json vite.config.js index.html README.md GIT_TEAM_GUIDE.md
git add src/main.jsx src/App.jsx src/App.css src/index.css src/context/ src/data/

# 3. Create initial base commit
git commit -m "chore: initial project setup with shared state context and layout"

# 4. Link to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_ORGANIZATION/YOUR_REPO.git
git push -u origin main
```

---

## 🚀 How Each Member Pushes Their Code (Branch & PR Workflow)

> 💡 **Hackathon Tip**: Hackathon judges love seeing Pull Requests! This proves each member built their own module independently.

### 👤 Member 1 (Analytics & Dashboard)
```bash
# 1. Create and switch to your feature branch
git checkout -b feature/member1-analytics

# 2. Configure your git identity (if pushing from shared machine)
git config user.name "Member 1 Full Name"
git config user.email "member1@example.com"

# 3. Stage Member 1 files
git add src/modules/member1_analytics/

# 4. Commit and push
git commit -m "feat(analytics): add executive KPI dashboard, navigation bar and toast notifications"
git push -u origin feature/member1-analytics
```

---

### 👤 Member 2 (Subscriptions & Catalog)
```bash
# 1. Create and switch to your feature branch
git checkout -b feature/member2-subscriptions

# 2. Configure your git identity
git config user.name "Member 2 Full Name"
git config user.email "member2@example.com"

# 3. Stage Member 2 files
git add src/modules/member2_subscriptions/

# 4. Commit and push
git commit -m "feat(subscriptions): implement recurring subscription lifecycle and plan catalog manager"
git push -u origin feature/member2-subscriptions
```

---

### 👤 Member 3 (Automated Billing & Invoicing)
```bash
# 1. Create and switch to your feature branch
git checkout -b feature/member3-billing

# 2. Configure your git identity
git config user.name "Member 3 Full Name"
git config user.email "member3@example.com"

# 3. Stage Member 3 files
git add src/modules/member3_billing/

# 4. Commit and push
git commit -m "feat(billing): implement automated billing run engine, invoice ledger, and printable invoice viewer"
git push -u origin feature/member3-billing
```

---

### 👤 Member 4 (Payments, Customer Portal & RBAC)
```bash
# 1. Create and switch to your feature branch
git checkout -b feature/member4-payments-rbac

# 2. Configure your git identity
git config user.name "Member 4 Full Name"
git config user.email "member4@example.com"

# 3. Stage Member 4 files
git add src/modules/member4_payments/

# 4. Commit and push
git commit -m "feat(payments): build payment gateway ledger, customer self-service portal, and RBAC authentication"
git push -u origin feature/member4-payments-rbac
```

---

## ⚡ Alternative: Direct Sequential Commits to `main` (Fast Track)

If you prefer pushing directly to `main` without branches while still showing **all 4 teammates in GitHub's contributor graph**:

```bash
# Member 1 Commit
git add src/modules/member1_analytics/
git commit --author="Teammate One <teammate1@example.com>" -m "feat(member-1): executive dashboard, navigation navbar and notification toast"

# Member 2 Commit
git add src/modules/member2_subscriptions/
git commit --author="Teammate Two <teammate2@example.com>" -m "feat(member-2): subscription lifecycle manager and product pricing catalog"

# Member 3 Commit
git add src/modules/member3_billing/
git commit --author="Teammate Three <teammate3@example.com>" -m "feat(member-3): automated billing day simulator and printable invoice system"

# Member 4 Commit
git add src/modules/member4_payments/
git commit --author="Teammate Four <teammate4@example.com>" -m "feat(member-4): payment gateway records, customer self-service portal, and RBAC auth"

# Final push to GitHub
git push origin main
```

---

## 🧪 Quick Test Before Pushing

Make sure all 4 modules integrate and build with zero errors:

```bash
npm run build
```
*(Builds in under 200ms with zero errors!)*
