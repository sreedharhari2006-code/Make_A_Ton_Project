import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  FileText,
  Plus,
  Copy,
  Calendar,
  DollarSign,
  ChevronRight,
  Send,
  CheckCircle2,
  Play,
  Pause,
  XCircle,
  RotateCcw,
  Clock,
  Tag,
  ShieldCheck,
  Percent,
  Search,
  Building
} from 'lucide-react';

export default function SubscriptionsView() {
  const {
    subscriptions,
    plans,
    products,
    users,
    taxRules,
    discountRules,
    quotationTemplates,
    createSubscription,
    createSubscriptionFromTemplate,
    updateSubscriptionStatus,
    updateSubscriptionLines,
    evaluateDiscount,
    currentUser
  } = useSubscriptions();

  const [activeStageTab, setActiveStageTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState(null);

  // Modal states
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Subscription Form State
  const [formData, setFormData] = useState({
    customerId: users.find(u => u.role === 'customer')?.id || '',
    planId: plans[0]?.id || '',
    paymentTerms: 'Net 30',
    startDate: new Date().toISOString().split('T')[0],
    validDays: 30,
    appliedDiscountCode: '',
    taxRuleId: taxRules[0]?.id || '',
    lines: [
      {
        id: 'line-new-1',
        productId: products[0]?.id || '',
        variantId: products[0]?.variants?.[0]?.id || '',
        quantity: 1
      }
    ]
  });

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    if (activeStageTab !== 'all' && sub.status.toLowerCase() !== activeStageTab.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        sub.id.toLowerCase().includes(q) ||
        sub.customerName.toLowerCase().includes(q) ||
        sub.customerCompany.toLowerCase().includes(q) ||
        sub.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate live preview totals for create modal
  const formSubtotal = formData.lines.reduce((acc, l) => {
    const prod = products.find(p => p.id === l.productId);
    const variant = prod?.variants?.find(v => v.id === l.variantId);
    const price = (Number(prod?.salesPrice || 0) + Number(variant?.priceDelta || 0)) * Number(l.quantity || 1);
    return acc + price;
  }, 0);

  const discountPreview = evaluateDiscount(formData.appliedDiscountCode, formData.lines.map(l => {
    const prod = products.find(p => p.id === l.productId);
    const variant = prod?.variants?.find(v => v.id === l.variantId);
    return {
      productId: l.productId,
      unitPrice: Number(prod?.salesPrice || 0) + Number(variant?.priceDelta || 0),
      quantity: l.quantity
    };
  }));

  const selectedTax = taxRules.find(t => t.id === formData.taxRuleId) || taxRules[0];
  const formTaxable = Math.max(0, formSubtotal - (discountPreview.valid ? discountPreview.discountAmount : 0));
  const formTax = Number(((formTaxable * (selectedTax?.rate || 0)) / 100).toFixed(2));
  const formGrandTotal = Number((formTaxable + formTax).toFixed(2));

  // Handler to create custom subscription
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const customer = users.find(u => u.id === formData.customerId);
    const plan = plans.find(p => p.id === formData.planId);

    const start = new Date(formData.startDate);
    const expiry = new Date(formData.startDate);
    expiry.setDate(start.getDate() + Number(formData.validDays));

    const finalLines = formData.lines.map((l, idx) => {
      const prod = products.find(p => p.id === l.productId);
      const variant = prod?.variants?.find(v => v.id === l.variantId) || prod?.variants?.[0] || { id: 'var-std', name: 'Standard', priceDelta: 0 };
      const unitPrice = Number(prod?.salesPrice || 0) + Number(variant?.priceDelta || 0);

      return {
        id: `line-${Date.now()}-${idx}`,
        productId: prod.id,
        productName: prod.name,
        variantId: variant.id,
        variantName: variant.name,
        variantDelta: variant.priceDelta || 0,
        unitPrice,
        quantity: Number(l.quantity),
        taxRate: selectedTax.rate,
        discountPercent: 0
      };
    });

    const newSub = createSubscription({
      customerId: customer.id,
      customerName: customer.name,
      customerCompany: customer.company || customer.name,
      customerEmail: customer.email,
      planId: plan.id,
      planName: plan.name,
      billingFrequency: plan.billingFrequency,
      startDate: formData.startDate,
      expiryDate: expiry.toISOString().split('T')[0],
      nextBillingDate: formData.startDate,
      lastBilledDate: '',
      paymentTerms: formData.paymentTerms,
      status: 'Quotation', // Starts in Quotation
      taxRuleId: selectedTax.id,
      appliedDiscountCode: discountPreview.valid ? formData.appliedDiscountCode : '',
      lines: finalLines,
      notes: `Proposal generated by ${currentUser.name}`
    });

    setShowCreateModal(false);
    setSelectedSub(newSub);
  };

  const handleTemplateSelect = (templateId, customerId) => {
    try {
      const newSub = createSubscriptionFromTemplate(templateId, customerId);
      setShowTemplateModal(false);
      setSelectedSub(newSub);
    } catch (err) {
      alert(err.message);
    }
  };

  const stages = ['Draft', 'Quotation', 'Confirmed', 'Active', 'Closed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Controls & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Subscriptions & Quotations
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage quote generation, price lines, variant add-ons, and full recurring lifecycles.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="btn-secondary"
            title="Start from pre-configured quotation template"
          >
            <Copy size={15} />
            <span>New From Template</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Create Subscription</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'draft', 'quotation', 'confirmed', 'active', 'paused', 'closed'].map(st => (
            <button
              key={st}
              onClick={() => setActiveStageTab(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: activeStageTab === st ? 'var(--brand-primary)' : 'var(--bg-surface)',
                color: activeStageTab === st ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {st}
              <span style={{
                marginLeft: '6px',
                opacity: 0.8,
                fontSize: '11px',
                fontWeight: 700
              }}>
                ({st === 'all' ? subscriptions.length : subscriptions.filter(s => s.status.toLowerCase() === st).length})
              </span>
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by ID, customer, company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subscription #</th>
                <th>Customer / Account</th>
                <th>Plan & Frequency</th>
                <th>Total Value</th>
                <th>Start Date</th>
                <th>Next Billing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No subscriptions found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredSubs.map(sub => {
                  const subTotal = sub.lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity), 0);
                  return (
                    <tr key={sub.id} onClick={() => setSelectedSub(sub)} style={{ cursor: 'pointer' }}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>
                        {sub.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{sub.customerName}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{sub.customerCompany}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{sub.planName}</span>
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-subtle)',
                          textTransform: 'capitalize'
                        }}>
                          {sub.billingFrequency}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        ${subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {sub.appliedDiscountCode && (
                          <span style={{ marginLeft: '4px', color: '#10b981', fontSize: '11px' }}>
                            (Promo: {sub.appliedDiscountCode})
                          </span>
                        )}
                      </td>
                      <td>{sub.startDate}</td>
                      <td>
                        <span style={{ color: sub.nextBillingDate && sub.nextBillingDate <= new Date().toISOString().split('T')[0] ? '#ef4444' : 'inherit', fontWeight: 600 }}>
                          {sub.nextBillingDate || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${sub.status.toLowerCase()}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSub(sub);
                          }}
                          className="btn-secondary btn-sm"
                        >
                          <span>Manage</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Detail & Lifecycle Modal */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div className="modal-content modal-xl" onClick={e => e.stopPropagation()}>
            {/* Header & Status Chevron Pipeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                    {selectedSub.id}
                  </h2>
                  <span className={`badge badge-${selectedSub.status.toLowerCase()}`}>
                    {selectedSub.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Customer: <strong>{selectedSub.customerName}</strong> ({selectedSub.customerCompany}) • Plan: <strong>{selectedSub.planName}</strong>
                </div>
              </div>

              {/* Lifecycle Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedSub.status === 'Draft' && (
                  <button
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'Quotation', 'Quote published and prepared for customer');
                      setSelectedSub(prev => ({ ...prev, status: 'Quotation' }));
                    }}
                    className="btn-primary btn-sm"
                  >
                    <Send size={13} />
                    <span>Send / Mark as Quotation</span>
                  </button>
                )}

                {selectedSub.status === 'Quotation' && (
                  <button
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'Confirmed', 'Customer approved quotation');
                      setSelectedSub(prev => ({ ...prev, status: 'Confirmed' }));
                    }}
                    className="btn-teal btn-sm"
                  >
                    <CheckCircle2 size={13} />
                    <span>Confirm Order</span>
                  </button>
                )}

                {selectedSub.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'Active', 'Subscription activated and recurring billing scheduled');
                      setSelectedSub(prev => ({ ...prev, status: 'Active' }));
                    }}
                    className="btn-primary btn-sm"
                  >
                    <Play size={13} />
                    <span>Activate Subscription</span>
                  </button>
                )}

                {selectedSub.status === 'Active' && (
                  <>
                    <button
                      onClick={() => {
                        try {
                          updateSubscriptionStatus(selectedSub.id, 'Paused', 'Temporarily paused');
                          setSelectedSub(prev => ({ ...prev, status: 'Paused' }));
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                      className="btn-secondary btn-sm"
                    >
                      <Pause size={13} />
                      <span>Pause</span>
                    </button>

                    <button
                      onClick={() => {
                        try {
                          updateSubscriptionStatus(selectedSub.id, 'Closed', 'Manually closed early');
                          setSelectedSub(prev => ({ ...prev, status: 'Closed' }));
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                      className="btn-danger btn-sm"
                    >
                      <XCircle size={13} />
                      <span>Close / Terminate</span>
                    </button>
                  </>
                )}

                {selectedSub.status === 'Paused' && (
                  <button
                    onClick={() => {
                      updateSubscriptionStatus(selectedSub.id, 'Active', 'Resumed from pause');
                      setSelectedSub(prev => ({ ...prev, status: 'Active' }));
                    }}
                    className="btn-primary btn-sm"
                  >
                    <Play size={13} />
                    <span>Resume</span>
                  </button>
                )}

                {selectedSub.status === 'Closed' && (
                  <button
                    onClick={() => {
                      try {
                        updateSubscriptionStatus(selectedSub.id, 'Active', 'Renewed subscription contract');
                        setSelectedSub(prev => ({ ...prev, status: 'Active' }));
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                    className="btn-teal btn-sm"
                  >
                    <RotateCcw size={13} />
                    <span>Renew Contract</span>
                  </button>
                )}

                <button onClick={() => setSelectedSub(null)} className="btn-secondary btn-sm">
                  Close Window
                </button>
              </div>
            </div>

            {/* Odoo Chevron Pipeline */}
            <div className="status-pipeline">
              {stages.map((st, idx) => {
                const currentIdx = stages.indexOf(selectedSub.status);
                const isActive = selectedSub.status === st;
                const isCompleted = currentIdx > idx;

                return (
                  <div
                    key={st}
                    className={`pipeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  >
                    {isCompleted ? '✓ ' : ''}{st}
                  </div>
                );
              })}
            </div>

            {/* Contract Key Attributes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              backgroundColor: 'var(--bg-subtle)',
              padding: '16px',
              borderRadius: '10px',
              margin: '16px 0',
              fontSize: '13px'
            }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Start Date</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedSub.startDate}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Expiry Date</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedSub.expiryDate}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Next Billing</div>
                <div style={{ fontWeight: 700, marginTop: '2px', color: 'var(--brand-primary)' }}>
                  {selectedSub.nextBillingDate || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Payment Terms</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{selectedSub.paymentTerms}</div>
              </div>
            </div>

            {/* Product Lines Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} color="var(--brand-primary)" />
                <span>Product Lines & Variant Adjustments</span>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Taxes</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSub.lines.map(line => {
                      const lineTotal = line.unitPrice * line.quantity;
                      return (
                        <tr key={line.id}>
                          <td style={{ fontWeight: 600 }}>{line.productName}</td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: line.variantDelta > 0 ? 'var(--brand-secondary-light)' : 'var(--bg-subtle)',
                              color: line.variantDelta > 0 ? 'var(--brand-secondary)' : 'var(--text-secondary)',
                              fontSize: '12px',
                              fontWeight: 600
                            }}>
                              {line.variantName} {line.variantDelta > 0 ? `(+$${line.variantDelta})` : ''}
                            </span>
                          </td>
                          <td>{line.quantity}</td>
                          <td>${line.unitPrice.toLocaleString()}</td>
                          <td>{line.taxRate}%</td>
                          <td style={{ fontWeight: 700 }}>${lineTotal.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--brand-secondary)" />
                <span>Subscription Lifecycle Activity Log</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedSub.history?.map((log, idx) => (
                  <div key={idx} style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderLeft: '3px solid var(--brand-primary)',
                    fontSize: '12.5px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{log.action}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{log.date}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {log.note} • <em>by {log.actor}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New From Template Modal */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">
                <Copy size={18} color="var(--brand-primary)" />
                <span>Turn Quotation Template into Subscription</span>
              </h2>
              <button onClick={() => setShowTemplateModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Sales reps can initiate standardized quotes with pre-configured plans, product lines, and variant selections in one click.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {quotationTemplates.map(tpl => {
                const plan = plans.find(p => p.id === tpl.planId);
                return (
                  <div key={tpl.id} style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-surface)'
                  }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{tpl.name}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{tpl.description}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>Plan: <strong>{plan?.name}</strong></span>
                        <span>Valid for: <strong>{tpl.validDays} days</strong></span>
                        <span>Items: <strong>{tpl.lines.length} products</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        id={`cust-select-${tpl.id}`}
                        defaultValue={users.find(u => u.role === 'customer')?.id}
                        style={{ fontSize: '12.5px', padding: '6px 10px' }}
                      >
                        {users.filter(u => u.role === 'customer').map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          const custSelect = document.getElementById(`cust-select-${tpl.id}`);
                          handleTemplateSelect(tpl.id, custSelect.value);
                        }}
                        className="btn-primary btn-sm"
                      >
                        <span>Generate Quote</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Subscription Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content modal-xl" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">
                <Plus size={18} color="var(--brand-primary)" />
                <span>Create New Custom Subscription / Quote</span>
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Customer & Plan Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Select Customer Account
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  >
                    {users.filter(u => u.role === 'customer').map(c => (
                      <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Billing Plan
                  </label>
                  <select
                    value={formData.planId}
                    onChange={e => setFormData({ ...formData, planId: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.billingFrequency.toUpperCase()} • ${p.cost})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>

              {/* Dates & Taxes Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Validity / Contract Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.validDays}
                    onChange={e => setFormData({ ...formData, validDays: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Tax Jurisdiction Rule
                  </label>
                  <select
                    value={formData.taxRuleId}
                    onChange={e => setFormData({ ...formData, taxRuleId: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    {taxRules.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.rate}%)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Lines Section */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Product Lines & Variants</div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        lines: [
                          ...formData.lines,
                          {
                            id: `line-${Date.now()}`,
                            productId: products[0].id,
                            variantId: products[0].variants?.[0]?.id || '',
                            quantity: 1
                          }
                        ]
                      });
                    }}
                    className="btn-secondary btn-sm"
                  >
                    <Plus size={13} />
                    <span>Add Line Item</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.lines.map((line, idx) => {
                    const prod = products.find(p => p.id === line.productId);
                    return (
                      <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                        {/* Product */}
                        <select
                          value={line.productId}
                          onChange={e => {
                            const newProdId = e.target.value;
                            const newProd = products.find(p => p.id === newProdId);
                            const updatedLines = [...formData.lines];
                            updatedLines[idx] = {
                              ...updatedLines[idx],
                              productId: newProdId,
                              variantId: newProd?.variants?.[0]?.id || ''
                            };
                            setFormData({ ...formData, lines: updatedLines });
                          }}
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (${p.salesPrice})</option>
                          ))}
                        </select>

                        {/* Variant */}
                        <select
                          value={line.variantId}
                          onChange={e => {
                            const updatedLines = [...formData.lines];
                            updatedLines[idx].variantId = e.target.value;
                            setFormData({ ...formData, lines: updatedLines });
                          }}
                        >
                          {prod?.variants?.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.name} {v.priceDelta > 0 ? `(+$${v.priceDelta})` : ''}
                            </option>
                          ))}
                        </select>

                        {/* Quantity */}
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={e => {
                            const updatedLines = [...formData.lines];
                            updatedLines[idx].quantity = e.target.value;
                            setFormData({ ...formData, lines: updatedLines });
                          }}
                          placeholder="Qty"
                        />

                        {/* Line subtotal */}
                        <div style={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>
                          ${(
                            (Number(prod?.salesPrice || 0) + Number(prod?.variants?.find(v => v.id === line.variantId)?.priceDelta || 0)) *
                            Number(line.quantity || 1)
                          ).toLocaleString()}
                        </div>

                        {/* Delete line */}
                        {formData.lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                lines: formData.lines.filter((_, i) => i !== idx)
                              });
                            }}
                            className="btn-danger btn-sm"
                            style={{ padding: '6px 8px' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discount Code & Live Calculation Breakdown */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '10px',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                    Promo / Discount Code
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. BULKSEATS20, ODOOPROMO500"
                      value={formData.appliedDiscountCode}
                      onChange={e => setFormData({ ...formData, appliedDiscountCode: e.target.value.toUpperCase() })}
                      style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                  {formData.appliedDiscountCode && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '12px',
                      color: discountPreview.valid ? '#059669' : '#dc2626',
                      fontWeight: 600
                    }}>
                      {discountPreview.valid
                        ? `✓ ${discountPreview.description} (Savings: -$${discountPreview.discountAmount})`
                        : `✗ ${discountPreview.reason}`}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                  <div>Subtotal: <strong>${formSubtotal.toFixed(2)}</strong></div>
                  {discountPreview.valid && (
                    <div style={{ color: '#059669' }}>
                      Discount: <strong>-${discountPreview.discountAmount.toFixed(2)}</strong>
                    </div>
                  )}
                  <div>Taxes ({selectedTax?.name}): <strong>${formTax.toFixed(2)}</strong></div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--brand-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                    Grand Total: ${formGrandTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span>Create Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
