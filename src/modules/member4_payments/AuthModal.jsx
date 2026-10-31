import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import {
  UserPlus,
  LogIn,
  KeyRound,
  Check,
  X,
  AlertCircle,
  Mail,
  Lock,
  Building,
  User,
  Phone
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { signupCustomer, requestPasswordReset, resetPassword, switchUser, users } = useSubscriptions();

  const [tab, setTab] = useState('signup'); // 'signup', 'login', 'forgot'

  // Sign up form
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    password: ''
  });

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetTokenData, setResetTokenData] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Password rules validation criteria
  const pwd = signupForm.password;
  const isLenValid = pwd.length > 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);
  const isAllValid = isLenValid && hasUpper && hasLower && hasSpecial;

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      signupCustomer(signupForm);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = requestPasswordReset(forgotEmail);
      setResetTokenData(data);
      setSuccessMsg(`Reset link generated for ${forgotEmail}. You can now test setting a new password.`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCompleteReset = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      resetPassword(resetTokenData.email, newPassword);
      setResetTokenData(null);
      setForgotEmail('');
      setNewPassword('');
      setTab('login');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button
            onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13.5px',
              fontWeight: tab === 'signup' ? 700 : 500,
              borderBottom: tab === 'signup' ? '2px solid var(--brand-primary)' : 'none',
              color: tab === 'signup' ? 'var(--brand-primary)' : 'var(--text-muted)'
            }}
          >
            Customer Sign Up
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13.5px',
              fontWeight: tab === 'login' ? 700 : 500,
              borderBottom: tab === 'login' ? '2px solid var(--brand-primary)' : 'none',
              color: tab === 'login' ? 'var(--brand-primary)' : 'var(--text-muted)'
            }}
          >
            Direct Login
          </button>
          <button
            onClick={() => { setTab('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '13.5px',
              fontWeight: tab === 'forgot' ? 700 : 500,
              borderBottom: tab === 'forgot' ? '2px solid var(--brand-primary)' : 'none',
              color: tab === 'forgot' ? 'var(--brand-primary)' : 'var(--text-muted)'
            }}
          >
            Forgot Password
          </button>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--status-overdue-bg)',
            color: 'var(--status-overdue-text)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--status-active-bg)',
            color: 'var(--status-active-text)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN UP TAB */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              "A small business finds Brightloop online and creates an account with their email and a password."
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Hayes"
                  value={signupForm.name}
                  onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Studio"
                  value={signupForm.company}
                  onChange={e => setSignupForm({ ...signupForm, company: e.target.value })}
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Business Email (Must be Unique)
              </label>
              <input
                type="email"
                placeholder="jordan@acmestudio.com"
                value={signupForm.email}
                onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Account Password
              </label>
              <input
                type="password"
                placeholder="Enter secure password"
                value={signupForm.password}
                onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                style={{ width: '100%' }}
                required
              />

              {/* Password criteria checklist required by challenge */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginTop: '8px',
                fontSize: '11.5px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px'
              }}>
                <div style={{ color: isLenValid ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {isLenValid ? '✓' : '○'} More than 8 characters ({pwd.length})
                </div>
                <div style={{ color: hasUpper ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {hasUpper ? '✓' : '○'} Uppercase letter (A-Z)
                </div>
                <div style={{ color: hasLower ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {hasLower ? '✓' : '○'} Lowercase letter (a-z)
                </div>
                <div style={{ color: hasSpecial ? '#059669' : '#dc2626', fontWeight: 600 }}>
                  {hasSpecial ? '✓' : '○'} Special character (!@#$%^&*)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!isAllValid}>
                <UserPlus size={15} />
                <span>Create Customer Account</span>
              </button>
            </div>
          </form>
        )}

        {/* LOGIN TAB */}
        {tab === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Select any registered user to immediately log in and explore their role:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {users.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    onClose();
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${u.role === 'admin' ? 'confirmed' : u.role === 'staff' ? 'quotation' : 'active'}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD TAB */}
        {tab === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              "If they forget it later, a reset link should arrive at their registered email."
            </p>

            {!resetTokenData ? (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. david@acmecorp.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <Mail size={15} />
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Simulated Reset Link Execution Screen */
              <form onSubmit={handleCompleteReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--brand-primary-light)',
                  border: '1px solid var(--brand-primary-border)',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                    Simulated Email Reset Link Activated:
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    https://brightloop.io/auth/reset?token={resetTokenData.token}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Must meet complexity requirements"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="submit" className="btn-teal">
                    <KeyRound size={15} />
                    <span>Save New Password</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
