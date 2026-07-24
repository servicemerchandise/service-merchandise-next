'use client';

import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}

export function Modal({ title, children, onClose, onSave }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-display font-bold text-lg">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={onSave} className="btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export function Input({ label, value, onChange, type = 'text' }: InputProps) {
  return (
    <div>
      <label className="text-xs font-medium text-sm-700 block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="input-base" />
    </div>
  );
}
