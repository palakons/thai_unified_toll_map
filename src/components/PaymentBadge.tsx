import React from 'react';
import { PaymentTag } from '../types/toll';
import { PAYMENT_TAG_INFO } from '../data/tollNetwork';

interface PaymentBadgeProps {
  method: PaymentTag;
  size?: 'sm' | 'md';
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({ method, size = 'sm' }) => {
  const info = PAYMENT_TAG_INFO[method];
  if (!info) return null;

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${info.color} ${
        isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="text-xs">{info.icon}</span>
      <span>{info.label_th}</span>
    </span>
  );
};
