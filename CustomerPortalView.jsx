import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  UserCheck,
  CreditCard,
  FileText,
  Printer,
  Shield,
  Pause,
  Play,
  XCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building,
  Key
} from 'lucide-react';

export default function CustomerPortalView({ onSelectInvoice, onRecordPaymentForInvoice }) {
  const {
    currentUser,
    subscriptions,
    invoices,
    plans,
    products,
    updateSubscriptionStatus,
    updateSubscriptionLines,
    resetPassword
  } = useSubscriptions();

  // If current logged-in user is not a customer, show an easy customer persona switcher or prompt
  const isCustomer = currentUser.role === 'customer';

  // Find subscriptions and invoices belonging to this customer
  const mySubscriptions = subscriptions.filter(s => s.customerId === currentUser.id || s.customerEmail === currentUser.email);
  const myInvoices = invoices.filter(i => i.customerId === currentUser.id || i.customerEmail === currentUser.email);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    try {
      resetPassword(currentUser.email, passwordForm.newPassword);
      setPassSuccess('Password updated successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message);
    }
  };

  const toggleAddOn = (sub, addOnProduct) => {
    const existingIndex = sub.lines.findIndex(l => l.productId === addOnProduct.id);
    let newLines = [...sub.lines];

    if (existingIndex !== -1) {
      // Remove add-on
      newLines.splice(existingIndex, 1);
    } else {
      // Add add-on
      newLines.push({
        id: `line-addon-${Date.now()}`,
        productId: addOnProduct.id,
        productName: addOnProduct.name,
        variantId: addOnProduct.variants?.[0]?.id || 'var-std',
        variantName: addOnProduct.variants?.[0]?.name || 'Standard',
        variantDelta: 0,
        unitPrice: addOnProduct.salesPrice,
        quantity: 1,
        taxRate: 18,
        discountPercent: 0
      });
    }

    updateSubscriptionLines(sub.id, newLines);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Customer Header Banner */}
      <div style={{
        backgroundColor: 'var(--brand-secondary-light)',
        border: '1px solid var(--brand-secondary)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff' }}
          />
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--brand-secondary)' }}>
              Brightloop Customer Self-Service Portal
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '2px 0 4px', color: 'var(--text-main)' }}>
              {currentUser.name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {currentUser.company} • {currentUser.email}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Account Access Level:</div>
          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--brand-secondary)',
            backgroundColor: '#ffffff',
            padding: '4px 12px',
            borderRadius: '20px',
            marginTop: '4px',
            display: 'inline-block'
          }}>
            CUSTOMER (Restricted to Own Records)
          </div>
        </div>
      </div>

      {!isCustomer && (
        <div style={{
          backgroundColor: 'var(--status-paused-bg)',
          border: '1px solid var(--status-paused-text)',
          borderRadius: '10px',
          padding: '14px 18px',
          fontSize: '13px',
          color: 'var(--status-paused-text)'
        }}>
          <strong>Note:</strong> You are currently browsing as <strong>{currentUser.name} ({currentUser.role.toUpperCase()})</strong>. You can switch to any customer persona (e.g., David Miller or Elena Rostova) via the top right dropdown menu to test customer self-service workflows.
        </div>
      )}

      {/* Main Grid: My Subscriptions & Invoices */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: My Subscriptions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileText size={18} color="var(--brand-primary)" />
              <span>My Active Subscriptions ({mySubscriptions.length})</span>
            </div>
          </div>

          {mySubscriptions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No subscriptions linked to this customer account.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mySubscriptions.map(sub => {
                const plan = plans.find(p => p.id === sub.planId);
                const subTotal = sub.lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity), 0);

                return (
                  <div key={sub.id} style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: 'var(--bg-surface)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{sub.id}</span>
                          <span className={`badge badge-${sub.status.toLowerCase()}`}>{sub.status}</span>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{sub.planName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Billed: {sub.billingFrequency.toUpperCase()} • Next billing: <strong>{sub.nextBillingDate || 'N/A'}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                          ${subTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recurring rate</div>
                      </div>
                    </div>

                    {/* Included lines */}
                    <div style={{ margin: '14px 0', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Active Software & Add-on Lines:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {sub.lines.map(line => (
                          <div key={line.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                            <span>• {line.productName} ({line.variantName}) x{line.quantity}</span>
                            <span style={{ fontWeight: 600 }}>${(line.unitPrice * line.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Self-Service Add-on Switcher */}
                    <div style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                        Switch Add-ons On / Off (Self-Service):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {products.filter(p => p.type === 'add-on').map(addon => {
                          const isActive = sub.lines.some(l => l.productId === addon.id);
                          return (
                            <button
                              key={addon.id}
                              onClick={() => toggleAddOn(sub, addon)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                border: '1px solid var(--border-color)',
                                backgroundColor: isActive ? 'var(--brand-secondary)' : 'var(--bg-surface)',
                                color: isActive ? '#ffffff' : 'var(--text-main)',
                                cursor: 'pointer'
                              }}
                            >
                              {isActive ? '✓ Included: ' : '+ Add: '} {addon.name} (${addon.salesPrice}/mo)
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Self-Service Plan Controls */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      {sub.status === 'Active' && plan?.policies?.allowPause && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'Paused', 'Customer requested temporary pause')}
                          className="btn-secondary btn-sm"
                        >
                          <Pause size={12} />
                          <span>Pause Plan</span>
                        </button>
                      )}

                      {sub.status === 'Paused' && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'Active', 'Customer resumed subscription')}
                          className="btn-primary btn-sm"
                        >
                          <Play size={12} />
                          <span>Resume Plan</span>
                        </button>
                      )}

                      {sub.status === 'Active' && plan?.policies?.allowEarlyClose && (
                        <button
                          onClick={() => updateSubscriptionStatus(sub.id, 'Closed', 'Customer cancelled subscription early')}
                          className="btn-danger btn-sm"
                        >
                          <XCircle size={12} />
                          <span>Cancel Subscription</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Invoices & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Invoices & Receipts */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CreditCard size={18} color="var(--brand-secondary)" />
                <span>My Invoices & Receipts ({myInvoices.length})</span>
              </div>
            </div>

            {myInvoices.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No invoices issued to your account yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Period</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInvoices.map(inv => (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            style={{ color: 'var(--brand-primary)', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            {inv.id}
                          </button>
                        </td>
                        <td style={{ fontSize: '12px' }}>{inv.issueDate}</td>
                        <td style={{ fontWeight: 700 }}>
                          ${inv.grandTotal.toLocaleString()}
                        </td>
                        <td>
                          <span className={`badge badge-${inv.status.toLowerCase()}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => onSelectInvoice(inv)}
                              className="btn-secondary btn-sm"
                              title="Print Receipt"
                            >
                              <Printer size={12} />
                            </button>
                            {inv.balanceDue > 0 && inv.status !== 'Cancelled' && (
                              <button
                                onClick={() => onRecordPaymentForInvoice(inv)}
                                className="btn-primary btn-sm"
                              >
                                <span>Pay Now</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Account Security & Password Update */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Key size={18} color="var(--brand-primary)" />
                <span>Account Security & Password</span>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Password rules: <strong>&gt;8 characters, uppercase letter, lowercase letter, special character.</strong>
              </p>

              {passError && (
                <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                  ✗ {passError}
                </div>
              )}
              {passSuccess && (
                <div style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                  ✓ {passSuccess}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="submit" className="btn-primary btn-sm">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
