import React, { useState } from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { UserPlus, ShieldAlert, Check, Users } from 'lucide-react';

export default function StaffModal({ isOpen, onClose }) {
  const { currentUser, users, addStaffMember } = useSubscriptions();

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  if (currentUser.role !== 'admin') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <ShieldAlert size={48} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b' }}>Access Restricted</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Only system administrators can add new internal members of staff. Please log in as an Admin to perform this action.
            </p>
            <button onClick={onClose} className="btn-secondary" style={{ marginTop: '16px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      addStaffMember(staffForm);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const existingStaff = users.filter(u => u.role === 'staff' || u.role === 'admin');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">
            <UserPlus size={18} color="var(--brand-primary)" />
            <span>Add Internal Staff Member (Admin Exclusive)</span>
          </div>
          <button onClick={onClose} className="btn-secondary btn-sm">✕</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          "Only the admin can add a new member of staff. Internal staff handle day-to-day work (quotes, subscriptions, billing, payments) with limited access."
        </p>

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--status-overdue-bg)',
            color: 'var(--status-overdue-text)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            marginBottom: '14px'
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Liam Taylor"
                value={staffForm.name}
                onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Staff Email (@brightloop.io)
              </label>
              <input
                type="email"
                placeholder="liam.taylor@brightloop.io"
                value={staffForm.email}
                onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Initial Password
              </label>
              <input
                type="password"
                placeholder=">8 chars, uppercase, lowercase, special char"
                value={staffForm.password}
                onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Role & Permissions
              </label>
              <select
                value={staffForm.role}
                onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="staff">Internal Staff (Day-to-day operations)</option>
                <option value="admin">System Administrator (Full access)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Staff Member
              </button>
            </div>
          </form>

          {/* Current Staff Roster */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Internal Team ({existingStaff.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {existingStaff.map(st => (
                <div key={st.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '12px'
                }}>
                  <img src={st.avatar} alt={st.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{st.name}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{st.email}</div>
                  </div>
                  <span className={`badge badge-${st.role === 'admin' ? 'confirmed' : 'quotation'}`} style={{ fontSize: '9.5px' }}>
                    {st.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
