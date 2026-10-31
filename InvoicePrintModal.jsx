import React from 'react';
import { Printer, Download, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function InvoicePrintModal({ invoice, onClose, onRecordPayment }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-xl printable-invoice-container"
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#714B67' }}>
              Invoice Document: {invoice.id}
            </span>
            <span className={`badge badge-${invoice.status.toLowerCase()}`}>
              {invoice.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {invoice.balanceDue > 0 && invoice.status !== 'Cancelled' && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="btn-primary btn-sm"
              >
                <span>Record Payment</span>
              </button>
            )}

            <button onClick={handlePrint} className="btn-secondary btn-sm">
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>

            <button onClick={onClose} className="btn-secondary btn-sm">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div style={{ padding: '20px 10px', fontSize: '13px', lineHeight: 1.6 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#714B67',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  B
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#714B67', letterSpacing: '-0.5px' }}>
                  Brightloop Software
                </div>
              </div>
              <div style={{ color: '#475569', fontSize: '12px' }}>
                100 Innovation Boulevard, Suite 500<br />
                Silicon Valley, CA 94025<br />
                Tax Reg ID: US-EIN-9928174<br />
                billing@brightloop.io
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                INVOICE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: '#714B67' }}>
                #{invoice.id}
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#475569' }}>
                Linked Subscription: <strong>{invoice.subscriptionId}</strong><br />
                Issue Date: <strong>{invoice.issueDate}</strong><br />
                Payment Due Date: <strong style={{ color: invoice.balanceDue > 0 ? '#b91c1c' : 'inherit' }}>{invoice.dueDate}</strong>
              </div>
            </div>
          </div>

          {/* Billed To / Terms Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Billed To:
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                {invoice.customerName}
              </div>
              <div style={{ fontSize: '13px', color: '#334155' }}>
                {invoice.customerCompany}<br />
                {invoice.customerEmail}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                Payment Schedule & Terms:
              </div>
              <div style={{ fontSize: '13px', color: '#0f172a' }}>
                Terms: <strong>{invoice.paymentTerms}</strong><br />
                Cycle: <strong>{invoice.billingPeriod}</strong><br />
                Tax Rule: <strong>{invoice.taxRuleName || 'Standard VAT'}</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left', fontSize: '12px' }}>
                <th style={{ padding: '10px 12px', color: '#475569', textTransform: 'uppercase' }}>Item & Description</th>
                <th style={{ padding: '10px 12px', color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '10px 12px', color: '#475569', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines?.map((line, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                    {line.description}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ${line.unitPrice?.toLocaleString() || '—'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {line.quantity || 1}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    ${line.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${invoice.subtotal.toFixed(2)}</span>
              </div>

              {invoice.discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                  <span>Discount Applied ({invoice.appliedDiscountCode || 'Promo'}):</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-${invoice.discountTotal.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Taxes:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${invoice.taxTotal.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '17px',
                fontWeight: 800,
                color: '#714B67',
                borderTop: '2px solid #cbd5e1',
                paddingTop: '8px'
              }}>
                <span>Total Due:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${invoice.grandTotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontSize: '13px' }}>
                <span>Amount Paid:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${invoice.amountPaid.toFixed(2)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: 800,
                color: invoice.balanceDue > 0 ? '#b91c1c' : '#059669',
                backgroundColor: '#f8fafc',
                padding: '8px',
                borderRadius: '6px'
              }}>
                <span>Remaining Balance:</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${invoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Wire Transfer Details & Footnote */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '16px',
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '20px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <div>
              <strong style={{ color: '#0f172a' }}>Bank Wire & ACH Instructions:</strong><br />
              Bank: Silicon Valley Commercial Bank<br />
              Account Name: Brightloop Software Inc.<br />
              Account #: 8492-9103-5591 • Routing: 121000358<br />
              SWIFT / BIC: SVCBUS33XXX • Reference: {invoice.id}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#059669', fontWeight: 700, marginBottom: '2px' }}>
                {invoice.balanceDue === 0 ? '✓ Paid in Full' : 'Pending Settlement'}
              </div>
              Thank you for trusting Brightloop Software as your recurring billing digital backbone.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
