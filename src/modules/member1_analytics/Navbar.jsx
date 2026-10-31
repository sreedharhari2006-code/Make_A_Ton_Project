import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  CreditCard,
  Package,
  UserCheck,
  Zap,
  Gauge,
  Sun,
  Moon,
  RotateCcw,
  UserPlus,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAuthModal, onOpenStaffModal, onOpenBillingModal }) {
  const {
    currentUser,
    users,
    switchUser,
    theme,
    toggleTheme,
    resetToDemoData,
    runPerformanceBenchmark,
    subscriptions
  } = useSubscriptions();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Check how many subscriptions are currently due for billing
  const today = new Date().toISOString().split('T')[0];
  const dueCount = subscriptions.filter(s => s.status === 'Active' && (!s.nextBillingDate || s.nextBillingDate <= today)).length;

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Top Banner & Quick Controls */}
      <div style={{
        padding: '8px 24px',
        backgroundColor: 'var(--brand-primary)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}>
            BRIGHTLOOP SOFTWARE
          </span>
          <span style={{ opacity: 0.9 }}>
            Unified Subscription Management, Recurring Billing & Customer Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Performance Benchmark */}
          <button
            onClick={() => runPerformanceBenchmark(1000)}
            title="Benchmark 1,000 subscriptions to verify sub-2-second requirement"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              padding: '3px 9px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <Gauge size={13} />
            <span>Benchmark 1,000 Records (&lt;2s)</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetToDemoData}
            title="Reset all data to default demo state"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              opacity: 0.85,
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #714B67 0%, #00A09D 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Brightloop <span style={{ color: 'var(--brand-secondary)', fontWeight: 600 }}>Billing</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Odoo Subscription Backbone
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              backgroundColor: activeTab === 'dashboard' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'dashboard' ? 'var(--brand-primary)' : 'var(--text-secondary)'
            }}
          >
            <LayoutDashboard size={16} />
            <span>Finance Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'subscriptions' ? 700 : 500,
              backgroundColor: activeTab === 'subscriptions' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'subscriptions' ? 'var(--brand-primary)' : 'var(--text-secondary)'
            }}
          >
            <FileText size={16} />
            <span>Subscriptions & Quotes</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'invoices' ? 700 : 500,
              backgroundColor: activeTab === 'invoices' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'invoices' ? 'var(--brand-primary)' : 'var(--text-secondary)'
            }}
          >
            <Receipt size={16} />
            <span>Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'payments' ? 700 : 500,
              backgroundColor: activeTab === 'payments' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'payments' ? 'var(--brand-primary)' : 'var(--text-secondary)'
            }}
          >
            <CreditCard size={16} />
            <span>Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'catalog' ? 700 : 500,
              backgroundColor: activeTab === 'catalog' ? 'var(--brand-primary-light)' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--brand-primary)' : 'var(--text-secondary)'
            }}
          >
            <Package size={16} />
            <span>Products & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: activeTab === 'portal' ? 700 : 500,
              backgroundColor: activeTab === 'portal' ? 'var(--brand-secondary-light)' : 'transparent',
              color: activeTab === 'portal' ? 'var(--brand-secondary)' : 'var(--text-secondary)'
            }}
          >
            <UserCheck size={16} />
            <span>Customer Portal</span>
          </button>
        </nav>

        {/* Right Tools & User Persona Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Billing Day trigger */}
          <button
            onClick={onOpenBillingModal}
            className="btn-teal btn-sm"
            style={{ position: 'relative' }}
            title="Open Automated Billing Day Engine"
          >
            <Zap size={14} />
            <span>Billing Day</span>
            {dueCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '999px',
                padding: '1px 6px',
                border: '2px solid var(--bg-surface)'
              }}>
                {dueCount}
              </span>
            )}
          </button>

          {/* Add Staff Member (Admin Only) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenStaffModal}
              className="btn-secondary btn-sm"
              title="Add a new member of staff (Admin only)"
            >
              <UserPlus size={14} />
              <span>Add Staff</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)'
            }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Role Switcher & Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                cursor: 'pointer'
              }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.1, color: 'var(--text-main)' }}>
                  {currentUser.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  color: currentUser.role === 'admin' ? 'var(--brand-primary)' : currentUser.role === 'staff' ? '#2563eb' : '#059669'
                }}>
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {roleMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '260px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Quick Switch Persona / Role
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Experience system as Admin, Staff, or Customer
                  </div>
                </div>

                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setRoleMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: u.id === currentUser.id ? 'var(--brand-primary-light)' : 'transparent',
                        textAlign: 'left'
                      }}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {u.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {u.role.toUpperCase()} • {u.company || u.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={() => {
                      setRoleMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--brand-primary)',
                      textAlign: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    + Sign Up New Customer Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
