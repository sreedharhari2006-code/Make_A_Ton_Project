import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Receipt
} from 'lucide-react';

export default function BillingDayModal({ isOpen, onClose }) {
  const { subscriptions, runBillingDay, plans, taxRules } = useSubscriptions();

  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0]);
  const [runResult, setRunResult] = useState(null);

  if (!isOpen) return null;

  // Find eligible subscriptions
  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const dueSubs = activeSubs.filter(s => (!s.nextBillingDate || s.nextBillingDate <= billingDate) && s.lastBilledDate !== billingDate);
  const alreadyBilledSubs = activeSubs.filter(s => s.lastBilledDate === billingDate);

  const projectedTotal = dueSubs.reduce((acc, sub) => {
    const subtotal = sub.lines.reduce((sAcc, l) => sAcc + (l.unitPrice * l.quantity), 0);
    const taxRule = taxRules.find(t => t.id === sub.taxRuleId) || taxRules[0];
    const tax = (subtotal * taxRule.rate) / 100;
    return acc + subtotal + tax;
  }, 0);

  const handleRunExecution = () => {
    const result = runBillingDay(billingDate);
    setRunResult(result);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">
            <Zap size={20} color="var(--brand-secondary)" />
            <span>Automated Recurring Billing Engine (Billing Day)</span>
          </div>
          <button onClick={onClose} className="btn-secondary btn-sm">✕</button>
        </div>

        {runResult ? (
          /* Execution Completed Screen */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div style={{
              backgroundColor: 'var(--status-active-bg)',
              border: '1px solid #10b981',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={44} color="#059669" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', margin: '0 0 4px' }}>
                Billing Run Successful!
              </h3>
              <p style={{ fontSize: '13.5px', color: '#047857' }}>
                Generated <strong>{runResult.billedCount} invoices</strong> totaling <strong>${runResult.totalBilledAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>.
              </p>
            </div>

            {/* Generated Invoices preview */}
            <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '8px' }}>
              Generated Invoices:
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {runResult.generatedInvoices.map(inv => (
                <div key={inv.id} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '13px'
                }}>
                  <div>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>
                      {inv.id}
                    </span>
                    <span style={{ marginLeft: '10px', fontWeight: 600 }}>{inv.customerName}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({inv.customerCompany})</span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-secondary)' }}>
                    ${inv.grandTotal.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button
                onClick={() => {
                  setRunResult(null);
                  onClose();
                }}
                className="btn-primary"
              >
                Close & Review Invoices
              </button>
            </div>
          </div>
        ) : (
          /* Pre-run Review Screen */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Brightloop's automated engine scans all active subscriptions, calculates line items with taxes and discounts, and guarantees idempotency — <strong>no double billing and no skipped subscriptions.</strong>
            </p>

            {/* Date Selector & Eligibility stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr',
              gap: '14px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '16px',
              borderRadius: '10px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                  Target Billing Run Date
                </label>
                <input
                  type="date"
                  value={billingDate}
                  onChange={e => setBillingDate(e.target.value)}
                  style={{ width: '100%', fontWeight: 600 }}
                />
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Due Subscriptions
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: dueSubs.length > 0 ? 'var(--brand-primary)' : 'var(--text-muted)', marginTop: '4px' }}>
                  {dueSubs.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  out of {activeSubs.length} active
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Projected Revenue
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                  ${projectedTotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Taxes & discounts applied
                </div>
              </div>
            </div>

            {/* Safeguards & Deduplication Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--brand-secondary-light)',
              border: '1px solid var(--brand-secondary)'
            }}>
              <ShieldCheck size={22} color="var(--brand-secondary)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                <strong>Idempotent Billing Safeguard:</strong> {alreadyBilledSubs.length} subscription(s) have already been billed for this cycle and will be automatically skipped to eliminate any risk of double billing.
              </div>
            </div>

            {/* List of Subscriptions Due for Invoicing */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '8px' }}>
                Subscriptions Queued for Billing:
              </div>

              {dueSubs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  All active subscriptions are currently up to date for {billingDate}!
                  <div style={{ marginTop: '4px', fontSize: '11.5px' }}>
                    Tip: Try selecting a future date (e.g. next month) to simulate the next billing cycle.
                  </div>
                </div>
              ) : (
                <div className="table-responsive" style={{ maxHeight: '200px' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Subscription #</th>
                        <th>Customer</th>
                        <th>Frequency</th>
                        <th>Next Due</th>
                        <th>Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dueSubs.map(sub => (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{sub.id}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{sub.customerName}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.customerCompany}</div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{sub.billingFrequency}</td>
                          <td>{sub.nextBillingDate}</td>
                          <td>{sub.lines.length} lines</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunExecution}
                className="btn-primary"
                disabled={dueSubs.length === 0}
              >
                <Zap size={15} />
                <span>Execute Billing Run ({dueSubs.length} Subscriptions)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
