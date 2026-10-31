import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  Receipt,
  Printer,
  Send,
  CheckCircle,
  XCircle,
  CreditCard,
  Zap,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  Calendar,
  Building
} from 'lucide-react';

export default function InvoicesView({ onSelectInvoice, onRecordPaymentForInvoice, onOpenBillingModal }) {
  const {
    invoices,
    confirmInvoice,
    cancelInvoice,
    sendInvoice,
    currentUser
  } = useSubscriptions();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailPreviewInv, setEmailPreviewInv] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const filteredInvoices = invoices.filter(inv => {
    // Dynamic overdue evaluation
    const isOverdue = inv.status !== 'Cancelled' && inv.balanceDue > 0 && inv.dueDate < today;
    const effectiveStatus = isOverdue ? 'Overdue' : inv.status;

    if (statusFilter !== 'all' && effectiveStatus.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerCompany.toLowerCase().includes(q) ||
        inv.subscriptionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Invoices & Automated Recurring Billing
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Each invoice is created automatically from its active subscription with customer details, product lines, taxes, and discounts.
          </p>
        </div>

        <button
          onClick={onOpenBillingModal}
          className="btn-primary"
        >
          <Zap size={15} />
          <span>Run Automated Billing Engine</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'draft', 'confirmed', 'paid', 'overdue', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: statusFilter === st ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: statusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {st}
              <span style={{ marginLeft: '6px', opacity: 0.8, fontSize: '11px', fontWeight: 700 }}>
                ({st === 'all' ? invoices.length : invoices.filter(i => {
                  const isOverdue = i.status !== 'Cancelled' && i.balanceDue > 0 && i.dueDate < today;
                  const eff = isOverdue ? 'Overdue' : i.status;
                  return eff.toLowerCase() === st;
                }).length})
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search invoice #, customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Subscription</th>
                <th>Customer</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No invoices matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => {
                  const isOverdue = inv.status !== 'Cancelled' && inv.balanceDue > 0 && inv.dueDate < today;
                  const displayStatus = isOverdue ? 'Overdue' : inv.status;

                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          style={{ color: 'var(--brand-primary)', textDecoration: 'underline', fontWeight: 700 }}
                          title="Open printable formatted invoice"
                        >
                          {inv.id}
                        </button>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                          {inv.subscriptionId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inv.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.customerCompany}</div>
                      </td>
                      <td>{inv.issueDate}</td>
                      <td>
                        <span style={{ color: isOverdue ? '#dc2626' : 'inherit', fontWeight: isOverdue ? 700 : 500 }}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ${inv.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {inv.discountTotal > 0 && (
                          <div style={{ fontSize: '11px', color: '#10b981' }}>
                            -${inv.discountTotal} saved
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: inv.balanceDue > 0 ? (isOverdue ? '#dc2626' : '#d97706') : '#059669' }}>
                        ${inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge badge-${displayStatus.toLowerCase()}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {/* Print / View */}
                          <button
                            onClick={() => onSelectInvoice(inv)}
                            className="btn-secondary btn-sm"
                            title="Print / View Invoice Document"
                          >
                            <Printer size={13} />
                          </button>

                          {/* Confirm */}
                          {inv.status === 'Draft' && (
                            <button
                              onClick={() => confirmInvoice(inv.id)}
                              className="btn-teal btn-sm"
                              title="Confirm Draft Invoice"
                            >
                              <CheckCircle size={13} />
                              <span>Confirm</span>
                            </button>
                          )}

                          {/* Send Email */}
                          <button
                            onClick={() => {
                              sendInvoice(inv.id);
                              setEmailPreviewInv(inv);
                            }}
                            className="btn-secondary btn-sm"
                            title="Send invoice email to customer"
                          >
                            <Send size={13} />
                          </button>

                          {/* Record Payment */}
                          {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
                            <button
                              onClick={() => onRecordPaymentForInvoice(inv)}
                              className="btn-primary btn-sm"
                              title="Record payment against invoice"
                            >
                              <CreditCard size={13} />
                              <span>Pay</span>
                            </button>
                          )}

                          {/* Cancel */}
                          {inv.status === 'Draft' && (
                            <button
                              onClick={() => cancelInvoice(inv.id)}
                              className="btn-danger btn-sm"
                              title="Cancel invoice"
                              style={{ padding: '4px 6px' }}
                            >
                              <XCircle size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Email Dispatch Modal */}
      {emailPreviewInv && (
        <div className="modal-overlay" onClick={() => setEmailPreviewInv(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <div className="card-title">
                <Send size={18} color="var(--brand-primary)" />
                <span>Email Dispatched to Customer</span>
              </div>
              <button onClick={() => setEmailPreviewInv(null)} className="btn-secondary btn-sm">✕</button>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px',
              lineHeight: 1.6,
              color: 'var(--text-main)'
            }}>
              <div><strong>To:</strong> {emailPreviewInv.customerEmail}</div>
              <div><strong>From:</strong> billing@brightloop.io</div>
              <div><strong>Subject:</strong> Brightloop Invoice {emailPreviewInv.id} for ${emailPreviewInv.grandTotal.toLocaleString()}</div>
              <div style={{ margin: '12px 0', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                Dear {emailPreviewInv.customerName},<br /><br />
                Please find attached your invoice <strong>{emailPreviewInv.id}</strong> for the amount of <strong>${emailPreviewInv.grandTotal.toLocaleString()}</strong>.<br /><br />
                Payment Terms: {emailPreviewInv.paymentTerms}<br />
                Due Date: {emailPreviewInv.dueDate}<br />
                Balance Due: ${emailPreviewInv.balanceDue.toLocaleString()}<br /><br />
                You can view, download and pay this directly through your Brightloop Customer Portal.<br /><br />
                Thank you,<br />
                Brightloop Software Billing Operations
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setEmailPreviewInv(null)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
