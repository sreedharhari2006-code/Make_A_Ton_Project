import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  CreditCard,
  Plus,
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  Building,
  Tag,
  ArrowUpRight
} from 'lucide-react';

export default function PaymentsView({ onSelectInvoice, selectedInvoiceForPayment, onClosePaymentModal }) {
  const {
    payments,
    invoices,
    recordPayment,
    financeMetrics,
    currentUser
  } = useSubscriptions();

  const [showModal, setShowModal] = useState(!!selectedInvoiceForPayment);
  const [searchQuery, setSearchQuery] = useState('');

  // Payment form state
  const [formData, setFormData] = useState({
    invoiceId: selectedInvoiceForPayment?.id || invoices.find(i => i.balanceDue > 0)?.id || '',
    amount: selectedInvoiceForPayment?.balanceDue || invoices.find(i => i.balanceDue > 0)?.balanceDue || 0,
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'Credit Card (Visa)',
    reference: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    notes: 'Reconciled payment against customer invoice.'
  });

  const selectedInv = invoices.find(i => i.id === formData.invoiceId);

  // Method options
  const paymentMethods = [
    'Credit Card (Visa)',
    'Credit Card (Mastercard)',
    'Bank Wire / NEFT',
    'Stripe Gateway',
    'UPI / Instant Digital',
    'Commercial Cheque',
    'Cash / Direct Deposit'
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      recordPayment(formData);
      setShowModal(false);
      if (onClosePaymentModal) onClosePaymentModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.invoiceId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.method.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Payments & Collections Ledger
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Record multi-method customer payments, reconcile outstanding invoice balances, and track bank settlements.
          </p>
        </div>

        <button
          onClick={() => {
            const firstUnpaid = invoices.find(i => i.balanceDue > 0);
            if (firstUnpaid) {
              setFormData({
                invoiceId: firstUnpaid.id,
                amount: firstUnpaid.balanceDue,
                paymentDate: new Date().toISOString().split('T')[0],
                method: 'Credit Card (Visa)',
                reference: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                notes: 'Payment reconciled against invoice.'
              });
            }
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Collected
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
            ${financeMetrics.totalRevenueCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across {payments.length} transactions
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Outstanding Balance
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
            ${financeMetrics.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Uncollected accounts receivable
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Reconciled Invoices
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '2px' }}>
            {invoices.filter(i => i.status === 'Paid').length} / {invoices.length}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Fully settled accounts
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>Payment Transactions Log</div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search reference, invoice #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '32px', fontSize: '12.5px' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Transaction Ref</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.id}</td>
                    <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      <button
                        onClick={() => {
                          const inv = invoices.find(i => i.id === p.invoiceId);
                          if (inv) onSelectInvoice(inv);
                        }}
                        style={{ color: 'var(--brand-primary)', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        {p.invoiceId}
                      </button>
                    </td>
                    <td>{p.customerName}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>{p.paymentDate}</td>
                    <td>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        fontSize: '11.5px',
                        fontWeight: 600
                      }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{p.reference}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <div className="card-title">
                <CreditCard size={18} color="var(--brand-primary)" />
                <span>Record Customer Payment</span>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  Select Invoice
                </label>
                <select
                  value={formData.invoiceId}
                  onChange={e => {
                    const invId = e.target.value;
                    const inv = invoices.find(i => i.id === invId);
                    setFormData({
                      ...formData,
                      invoiceId: invId,
                      amount: inv ? inv.balanceDue : 0
                    });
                  }}
                  style={{ width: '100%' }}
                  required
                >
                  {invoices.filter(i => i.status !== 'Cancelled').map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.id} — {inv.customerName} (${inv.balanceDue > 0 ? `Due: $${inv.balanceDue}` : 'Settled'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedInv && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  fontSize: '12.5px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div>Customer: <strong>{selectedInv.customerName}</strong></div>
                    <div>Due Date: <strong>{selectedInv.dueDate}</strong></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>Grand Total: <strong>${selectedInv.grandTotal.toFixed(2)}</strong></div>
                    <div style={{ color: '#dc2626', fontWeight: 700 }}>
                      Remaining Balance: ${selectedInv.balanceDue.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedInv?.balanceDue || 999999}
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', fontWeight: 700 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Payment Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={e => setFormData({ ...formData, method: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    {paymentMethods.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Transaction / Reference #
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={e => setFormData({ ...formData, reference: e.target.value })}
                    style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                  Reconciliation Note
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Confirm & Reconcile Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
