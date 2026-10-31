import React, { useState } from 'react';
import { SubscriptionProvider, useSubscriptions } from './context/SubscriptionContext';
// Member 1: Executive Analytics & Navigation
import { DashboardView, Navbar, NotificationToast } from './modules/member1_analytics';

// Member 2: Subscriptions & Catalog
import { SubscriptionsView, CatalogView } from './modules/member2_subscriptions';

// Member 3: Billing & Invoicing Automation
import { InvoicesView, BillingDayModal, InvoicePrintModal } from './modules/member3_billing';

// Member 4: Payments Gateway, Customer Portal & Security
import { PaymentsView, CustomerPortalView, AuthModal, StaffModal } from './modules/member4_payments';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);

  const handleSelectInvoiceToPrint = (inv) => {
    setSelectedInvoiceForPrint(inv);
  };

  const handleRecordPaymentForInvoice = (inv) => {
    setSelectedInvoiceForPayment(inv);
    setActiveTab('payments');
  };

  return (
    <div className="app-container">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenStaffModal={() => setIsStaffModalOpen(true)}
        onOpenBillingModal={() => setIsBillingModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenBillingModal={() => setIsBillingModalOpen(true)}
            onSelectInvoice={handleSelectInvoiceToPrint}
            onRecordPaymentForInvoice={handleRecordPaymentForInvoice}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsView />
        )}

        {activeTab === 'invoices' && (
          <InvoicesView
            onSelectInvoice={handleSelectInvoiceToPrint}
            onRecordPaymentForInvoice={handleRecordPaymentForInvoice}
            onOpenBillingModal={() => setIsBillingModalOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            onSelectInvoice={handleSelectInvoiceToPrint}
            selectedInvoiceForPayment={selectedInvoiceForPayment}
            onClosePaymentModal={() => setSelectedInvoiceForPayment(null)}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogView />
        )}

        {activeTab === 'portal' && (
          <CustomerPortalView
            onSelectInvoice={handleSelectInvoiceToPrint}
            onRecordPaymentForInvoice={handleRecordPaymentForInvoice}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div>
          <strong>Brightloop Software</strong> • Unified Subscription Management, Automated Invoicing & Recurring Billing
        </div>
        <div style={{ marginTop: '4px' }}>
          Built for the Odoo Hackathon Challenge • Real-time RBAC, Plan Policies, Automated Tax/Discounts, &lt;2s Sub-second Scale
        </div>
      </footer>

      {/* Modals & Floating Overlays */}
      <BillingDayModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
      />

      <InvoicePrintModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        onRecordPayment={handleRecordPaymentForInvoice}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />

      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
