import React from 'react';
import { useSubscriptions } from '../../context/SubscriptionContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notification } = useSubscriptions();

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isInfo = notification.type === 'info';
  const isError = notification.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      background: isSuccess ? '#065f46' : isInfo ? '#1e3a8a' : '#991b1b',
      color: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
      maxWidth: '480px',
      animation: 'slideUp 250ms ease',
      fontSize: '13.5px',
      fontWeight: 500,
      lineHeight: 1.4
    }}>
      {isSuccess && <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0 }} />}
      {isInfo && <Info size={18} color="#60a5fa" style={{ flexShrink: 0 }} />}
      {isError && <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1 }}>{notification.message}</span>
    </div>
  );
}
