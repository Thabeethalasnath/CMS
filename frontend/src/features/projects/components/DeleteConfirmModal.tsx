import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  warningText?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  warningText,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        backdropFilter: 'blur(2px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} color="#DC2626" />
            </div>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>
              {title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ fontFamily: 'Inter', fontSize: '13px', color: '#475569', lineHeight: '20px' }}>
          Are you sure you want to delete <strong style={{ color: '#0F172A' }}>"{itemName}"</strong>?
          {warningText && (
            <p style={{ marginTop: '8px', color: '#DC2626', fontSize: '12px' }}>
              {warningText}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '8px 16px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '13px',
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#DC2626',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '13px',
              color: '#FFFFFF',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

