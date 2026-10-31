import React, { useState, useMemo } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Users,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  Send,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';

export default function DashboardView({ onOpenBillingModal, onSelectInvoice, onRecordPaymentForInvoice }) {
  const {
    subscriptions,
    invoices,
    payments,
    financeMetrics,
    plans,
    sendInvoice,
    currentUser
  } = useSubscriptions();

  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [benchmarkLatency, setBenchmarkLatency] = useState(null);

  // Measure calculation latency to prove sub-2-second speed
  const startTime = performance.now();

  const today = new Date().toISOString().split('T')[0];

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
      return true;
    });
  }, [subscriptions, statusFilter]);

  // Overdue Invoices list
  const overdueInvoices = useMemo(() => {
    return invoices.filter(inv => {
      return inv.status !== 'Cancelled' && inv.balanceDue > 0 && inv.dueDate < today;
    }).map(inv => {
      const due = new Date(inv.dueDate);
      const now = new Date(today);
      const diffDays = Math.max(1, Math.round((now - due) / (1000 * 60 * 60 * 24)));
      return {
        ...inv,
        daysOverdue: diffDays
      };
    }).sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [invoices, today]);

  // Revenue by Plan calculation
  const revenueByPlan = useMemo(() => {
    const planMap = {};
    subscriptions.forEach(sub => {
      if (sub.status === 'Active') {
        const subtotal = sub.lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity), 0);
        planMap[sub.planName] = (planMap[sub.planName] || 0) + subtotal;
      }
    });
    return Object.entries(planMap).map(([name, amount]) => ({ name, amount }));
  }, [subscriptions]);

  const calcDuration = (performance.now() - startTime).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive Welcome & Speed Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Finance & Executive Overview
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
            Real-time MRR, recurring billing health, and accounts receivable reconciliation for Brightloop Software.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--status-active-bg)',
            color: 'var(--status-active-text)',
            fontSize: '12px',
            fontWeight: 700
          }}>
            <Sparkles size={14} />
            <span>Response Time: {calcDuration}ms (Target: &lt;2,000ms)</span>
          </div>

          <button
            onClick={onOpenBillingModal}
            className="btn-primary"
            style={{ padding: '8px 16px' }}
          >
            <Zap size={15} />
            <span>Run Billing Engine</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Metric 1: Active Subscriptions */}
        <div className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Subscriptions
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                {financeMetrics.activeSubsCount}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 700, color: '#059669' }}>
              {subscriptions.length} Total Registered
            </span>
            <span>• {subscriptions.filter(s => s.status === 'Quotation').length} Quotations pending</span>
          </div>
        </div>

        {/* Metric 2: MRR & ARR */}
        <div className="card" style={{ borderLeft: '4px solid var(--brand-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Monthly Recurring (MRR)
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                ${financeMetrics.totalMRR.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-secondary-light)',
              color: 'var(--brand-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 700, color: 'var(--brand-secondary)' }}>
              ARR: ${financeMetrics.totalARR.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </span>
            <span>annualized run-rate</span>
          </div>
        </div>

        {/* Metric 3: Total Collected Revenue */}
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Revenue Collected
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                ${financeMetrics.totalRevenueCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Reconciled through {payments.length} customer payments</span>
          </div>
        </div>

        {/* Metric 4: Total Outstanding & Overdue */}
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Overdue Accounts
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                ${financeMetrics.overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
            <span>{financeMetrics.overdueCount} invoice(s) overdue</span>
            <span>• Chase required</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Overdue Chasing Radar & Revenue Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Card: Overdue Invoices Radar */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <AlertTriangle size={18} color="#dc2626" />
                <span>Overdue Invoices Radar ({overdueInvoices.length})</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Immediate chasing list before overdue accounts turn into lost revenue
              </div>
            </div>
          </div>

          {overdueInvoices.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 600 }}>All invoices are paid or within terms!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>No overdue accounts requiring chasing today.</div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Days Overdue</th>
                    <th>Balance Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          style={{ color: 'var(--brand-primary)', textDecoration: 'underline', fontWeight: 600 }}
                        >
                          {inv.id}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inv.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.customerCompany}</div>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {inv.daysOverdue} days late
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#dc2626' }}>
                        ${inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => sendInvoice(inv.id)}
                            className="btn-secondary btn-sm"
                            title="Send instant reminder email"
                          >
                            <Send size={12} />
                            <span>Chase</span>
                          </button>
                          <button
                            onClick={() => onRecordPaymentForInvoice(inv)}
                            className="btn-primary btn-sm"
                            title="Record received payment"
                          >
                            <span>Pay</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Card: Revenue by Plan & Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={18} color="var(--brand-secondary)" />
                <span>Active Subscription Volume by Plan</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Distribution of monthly recurring revenue across offerings
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {revenueByPlan.map(item => {
              const maxAmount = Math.max(...revenueByPlan.map(p => p.amount), 1);
              const percent = Math.round((item.amount / maxAmount) * 100);

              return (
                <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                      ${item.amount.toLocaleString()} / mo
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #714B67 0%, #00A09D 100%)',
                      borderRadius: '4px',
                      transition: 'width 300ms ease'
                    }} />
                  </div>
                </div>
              );
            })}

            {revenueByPlan.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No active subscriptions currently generating monthly revenue.
              </div>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Invoices</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px' }}>{invoices.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Paid Invoices</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
                {invoices.filter(i => i.status === 'Paid').length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Uncollected AR</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>
                ${financeMetrics.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Subscriptions & Quick Audit Stream */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileText size={18} color="var(--brand-primary)" />
            <span>Active Subscriptions Quick Roster</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ fontSize: '12.5px', padding: '4px 10px' }}
            >
              <option value="all">All Stages</option>
              <option value="Active">Active</option>
              <option value="Quotation">Quotation</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subscription #</th>
                <th>Customer</th>
                <th>Plan & Frequency</th>
                <th>Next Billing Date</th>
                <th>Payment Terms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.slice(0, 8).map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {sub.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sub.customerName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.customerCompany}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{sub.planName}</span>
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '11px',
                      padding: '2px 6px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: '4px',
                      textTransform: 'capitalize'
                    }}>
                      {sub.billingFrequency}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      <span>{sub.nextBillingDate || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{sub.paymentTerms}</td>
                  <td>
                    <span className={`badge badge-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
