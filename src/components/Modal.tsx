/**
 * Modal
 * Props:
 *   title         – string
 *   sub           – string (optional subtitle)
 *   onClose       – fn(): close modal
 *   onConfirm     – fn(): primary action
 *   confirmLabel  – string: label for confirm button
 *   children      – form fields / modal body content
 */
import React from 'react';

interface ModalProps {
  title: string;
  sub?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  children?: React.ReactNode;
}
export default function Modal({ title, sub, onClose, onConfirm, confirmLabel, children }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        {sub && <div className="modal-sub">{sub}</div>}

        {children}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary"   onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
