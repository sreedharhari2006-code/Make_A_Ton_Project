import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  Package,
  Layers,
  Percent,
  Receipt,
  Copy,
  Plus,
  ShieldAlert,
  Check,
  X,
  Tag,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function CatalogView() {
  const {
    products,
    addProduct,
    plans,
    addPlan,
    discountRules,
    addDiscountRule,
    toggleDiscountRule,
    taxRules,
    addTaxRule,
    quotationTemplates,
    addQuotationTemplate,
    currentUser
  } = useSubscriptions();

  const [activeSubTab, setActiveSubTab] = useState('products');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // New Product State
  const [newProd, setNewProd] = useState({
    name: '',
    type: 'software',
    salesPrice: 199,
    costPrice: 40,
    notes: '',
    variants: [
      { id: 'var-std', name: 'Standard Edition', priceDelta: 0 },
      { id: 'var-odoo', name: 'Odoo Enterprise Brand Integration', priceDelta: 560 }
    ]
  });

  // New Plan State
  const [newPlan, setNewPlan] = useState({
    name: '',
    cost: 199,
    billingFrequency: 'monthly',
    minQuantity: 1,
    availableFrom: '2026-01-01',
    availableTo: '2028-12-31',
    description: '',
    policies: {
      autoCloseOnEnd: true,
      allowEarlyClose: true,
      allowPause: true,
      allowRenew: true
    }
  });

  // New Discount State
  const [newDisc, setNewDisc] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: 15,
    minPurchase: 0,
    minQuantity: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    appliesTo: 'all',
    productIds: []
  });

  const isAdmin = currentUser.role === 'admin';

  const handleCreateProduct = (e) => {
    e.preventDefault();
    try {
      addProduct(newProd);
      setShowProductModal(false);
      setNewProd({
        name: '',
        type: 'software',
        salesPrice: 199,
        costPrice: 40,
        notes: '',
        variants: [
          { id: 'var-std', name: 'Standard Edition', priceDelta: 0 },
          { id: 'var-odoo', name: 'Odoo Enterprise Brand Integration', priceDelta: 560 }
        ]
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    try {
      addPlan(newPlan);
      setShowPlanModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateDiscount = (e) => {
    e.preventDefault();
    try {
      addDiscountRule(newDisc);
      setShowDiscountModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Product Catalog, Plans & Pricing Rules
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Administered configuration for products, brand variants, recurring billing schedules, tax rules, and discount logic.
          </p>
        </div>

        {!isAdmin && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--status-paused-bg)',
            color: 'var(--status-paused-text)',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <ShieldAlert size={16} />
            <span>Read-Only View: Log in as Admin to edit rules and launch plans</span>
          </div>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('products')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: activeSubTab === 'products' ? 700 : 500,
            backgroundColor: activeSubTab === 'products' ? 'var(--brand-primary)' : 'var(--bg-surface)',
            color: activeSubTab === 'products' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Package size={15} />
          <span>Products & Variants ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: activeSubTab === 'plans' ? 700 : 500,
            backgroundColor: activeSubTab === 'plans' ? 'var(--brand-primary)' : 'var(--bg-surface)',
            color: activeSubTab === 'plans' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Layers size={15} />
          <span>Recurring Plans ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('discounts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: activeSubTab === 'discounts' ? 700 : 500,
            backgroundColor: activeSubTab === 'discounts' ? 'var(--brand-primary)' : 'var(--bg-surface)',
            color: activeSubTab === 'discounts' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Percent size={15} />
          <span>Discount Rules ({discountRules.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('taxes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: activeSubTab === 'taxes' ? 700 : 500,
            backgroundColor: activeSubTab === 'taxes' ? 'var(--brand-primary)' : 'var(--bg-surface)',
            color: activeSubTab === 'taxes' ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Receipt size={15} />
          <span>Tax Rules ({taxRules.length})</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeSubTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Brightloop sells business software, add-ons, and products with brand/tier variants.
            </div>
            {isAdmin && (
              <button onClick={() => setShowProductModal(true)} className="btn-primary btn-sm">
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            {products.map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--bg-subtle)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: 'var(--text-secondary)'
                      }}>
                        {p.type}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px', color: 'var(--text-main)' }}>
                        {p.name}
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                        ${p.salesPrice}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Cost: ${p.costPrice}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '10px 0' }}>
                    {p.notes}
                  </p>

                  {/* Variants list */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Offered Variants & Price Delta:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {p.variants?.map(v => (
                        <span key={v.id} style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: v.priceDelta > 0 ? 'var(--brand-secondary-light)' : 'var(--bg-subtle)',
                          color: v.priceDelta > 0 ? 'var(--brand-secondary)' : 'var(--text-secondary)',
                          fontSize: '11.5px',
                          fontWeight: 600
                        }}>
                          {v.name} {v.priceDelta > 0 ? `(+$${v.priceDelta})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLANS TAB */}
      {activeSubTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Plans define billing frequency (daily, weekly, monthly, yearly), minimum quantities, and lifecycle policies.
            </div>
            {isAdmin && (
              <button onClick={() => setShowPlanModal(true)} className="btn-primary btn-sm">
                <Plus size={14} />
                <span>Launch New Plan</span>
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {plans.map(pl => (
              <div key={pl.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--brand-primary-light)',
                      color: 'var(--brand-primary)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}>
                      {pl.billingFrequency} BILLING
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '6px' }}>{pl.name}</h3>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>
                    ${pl.cost}
                  </div>
                </div>

                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '10px 0' }}>
                  {pl.description}
                </p>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Min Quantity: <strong>{pl.minQuantity} seat(s)</strong> • Available: {pl.availableFrom} to {pl.availableTo}
                </div>

                {/* Plan Policies Matrix */}
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '10px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  fontSize: '11.5px'
                }}>
                  <div style={{ color: pl.policies?.autoCloseOnEnd ? '#059669' : 'var(--text-muted)' }}>
                    {pl.policies?.autoCloseOnEnd ? '✓ Auto-close on end' : '○ Continuous renewal'}
                  </div>
                  <div style={{ color: pl.policies?.allowEarlyClose ? '#059669' : '#dc2626' }}>
                    {pl.policies?.allowEarlyClose ? '✓ Early close allowed' : '✕ Lock-in (no early close)'}
                  </div>
                  <div style={{ color: pl.policies?.allowPause ? '#059669' : '#dc2626' }}>
                    {pl.policies?.allowPause ? '✓ Can be paused' : '✕ Pausing disabled'}
                  </div>
                  <div style={{ color: pl.policies?.allowRenew ? '#059669' : '#dc2626' }}>
                    {pl.policies?.allowRenew ? '✓ Renewable' : '✕ Non-renewable'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISCOUNTS TAB */}
      {activeSubTab === 'discounts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                Automated Discount Engine Rules
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                "Only the admin can create discount rules: fixed amount or percentage, min purchase/quantity, start/end dates, usage limit, and product or subscription scope."
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => setShowDiscountModal(true)} className="btn-primary btn-sm">
                <Plus size={14} />
                <span>Create Discount Rule</span>
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type & Value</th>
                  <th>Conditions</th>
                  <th>Validity Dates</th>
                  <th>Usage Counter</th>
                  <th>Applies To</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {discountRules.map(d => {
                  const today = new Date().toISOString().split('T')[0];
                  const isExpired = d.endDate && today > d.endDate;
                  const isMaxed = d.timesUsed >= d.usageLimit;

                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>
                        {d.code}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700 }}>
                          {d.type === 'percentage' ? `${d.value}% Off` : `$${d.value} Flat Off`}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {d.minQuantity > 1 ? `Min ${d.minQuantity} qty` : ''}
                        {d.minPurchase > 0 ? `Min $${d.minPurchase}` : ''}
                        {!d.minQuantity && !d.minPurchase ? 'No minimum' : ''}
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {d.startDate} to {d.endDate}
                        {isExpired && (
                          <span style={{ marginLeft: '6px', color: '#dc2626', fontWeight: 700 }}>
                            (Expired)
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: isMaxed ? '#dc2626' : 'inherit' }}>
                            {d.timesUsed} / {d.usageLimit}
                          </span>
                          {isMaxed && <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700 }}>MAXED</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-subtle)',
                          fontSize: '11px',
                          fontWeight: 600
                        }}>
                          {d.appliesTo === 'all' ? 'Whole Subscription' : `${d.productIds?.length || 0} Specific Products`}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: d.active && !isExpired && !isMaxed ? '#ecfdf5' : '#fef2f2',
                          color: d.active && !isExpired && !isMaxed ? '#059669' : '#dc2626'
                        }}>
                          {d.active && !isExpired && !isMaxed ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        {isAdmin && (
                          <button
                            onClick={() => toggleDiscountRule(d.id)}
                            className="btn-secondary btn-sm"
                          >
                            {d.active ? 'Disable' : 'Enable'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAXES TAB */}
      {activeSubTab === 'taxes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Admin-configured tax rules applied automatically during billing runs.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {taxRules.map(t => (
              <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Code: {t.code}</div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand-secondary)' }}>
                  {t.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Add New Product & Variants</h2>
              <button onClick={() => setShowProductModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Brightloop Analytics Engine"
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Type</label>
                  <select
                    value={newProd.type}
                    onChange={e => setNewProd({ ...newProd, type: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="software">Software</option>
                    <option value="add-on">Add-on</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Sales Price ($)</label>
                  <input
                    type="number"
                    value={newProd.salesPrice}
                    onChange={e => setNewProd({ ...newProd, salesPrice: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Cost Price ($)</label>
                  <input
                    type="number"
                    value={newProd.costPrice}
                    onChange={e => setNewProd({ ...newProd, costPrice: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Description / Notes</label>
                <textarea
                  rows="2"
                  value={newProd.notes}
                  onChange={e => setNewProd({ ...newProd, notes: e.target.value })}
                  style={{ width: '100%' }}
                  placeholder="Feature highlights and SLA notes"
                />
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Preset Variant Included:</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  • <strong>Odoo Enterprise Brand Integration</strong> (Adds +$560 as per challenge specifications)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Launch New Recurring Plan</h2>
              <button onClick={() => setShowPlanModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Quarterly Scale Plan"
                  value={newPlan.name}
                  onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Frequency</label>
                  <select
                    value={newPlan.billingFrequency}
                    onChange={e => setNewPlan({ ...newPlan, billingFrequency: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Base Cost ($)</label>
                  <input
                    type="number"
                    value={newPlan.cost}
                    onChange={e => setNewPlan({ ...newPlan, cost: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Min Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newPlan.minQuantity}
                    onChange={e => setNewPlan({ ...newPlan, minQuantity: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>Plan Lifecycle Policies:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newPlan.policies.autoCloseOnEnd}
                      onChange={e => setNewPlan({ ...newPlan, policies: { ...newPlan.policies, autoCloseOnEnd: e.target.checked } })}
                    />
                    <span>Auto-close on its own when end date is reached</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newPlan.policies.allowEarlyClose}
                      onChange={e => setNewPlan({ ...newPlan, policies: { ...newPlan.policies, allowEarlyClose: e.target.checked } })}
                    />
                    <span>Can be closed early by customer/staff</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newPlan.policies.allowPause}
                      onChange={e => setNewPlan({ ...newPlan, policies: { ...newPlan.policies, allowPause: e.target.checked } })}
                    />
                    <span>Allows pausing billing cycle</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={newPlan.policies.allowRenew}
                      onChange={e => setNewPlan({ ...newPlan, policies: { ...newPlan.policies, allowRenew: e.target.checked } })}
                    />
                    <span>Eligible for automatic renewal</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowPlanModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Launch Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="modal-overlay" onClick={() => setShowDiscountModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="card-title">Create Admin Discount Rule</h2>
              <button onClick={() => setShowDiscountModal(false)} className="btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleCreateDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP25"
                    value={newDisc.code}
                    onChange={e => setNewDisc({ ...newDisc, code: e.target.value.toUpperCase() })}
                    style={{ width: '100%', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Scope</label>
                  <select
                    value={newDisc.appliesTo}
                    onChange={e => setNewDisc({ ...newDisc, appliesTo: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="all">Whole Subscription</option>
                    <option value="specific_products">Specific Products</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Discount Type</label>
                  <select
                    value={newDisc.type}
                    onChange={e => setNewDisc({ ...newDisc, type: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Value</label>
                  <input
                    type="number"
                    value={newDisc.value}
                    onChange={e => setNewDisc({ ...newDisc, value: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={newDisc.usageLimit}
                    onChange={e => setNewDisc({ ...newDisc, usageLimit: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Min Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newDisc.minQuantity}
                    onChange={e => setNewDisc({ ...newDisc, minQuantity: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Min Purchase ($)</label>
                  <input
                    type="number"
                    value={newDisc.minPurchase}
                    onChange={e => setNewDisc({ ...newDisc, minPurchase: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Start Date</label>
                  <input
                    type="date"
                    value={newDisc.startDate}
                    onChange={e => setNewDisc({ ...newDisc, startDate: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>End Date</label>
                  <input
                    type="date"
                    value={newDisc.endDate}
                    onChange={e => setNewDisc({ ...newDisc, endDate: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowDiscountModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Discount Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
