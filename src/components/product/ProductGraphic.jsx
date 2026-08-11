import React from 'react';

export function ProductGraphic({ type }) {
  switch (type) {
    case 'shin-ramyun':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="25" y="25" width="110" height="110" rx="18" fill="#DC2626" />
          <circle cx="80" cy="80" r="40" fill="#991B1B" />
          <text x="80" y="75" textAnchor="middle" fill="#FFD700" fontSize="22" fontWeight="900">辛</text>
          <text x="80" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">SHIN RAMYUN</text>
          <path d="M 40 120 Q 80 135 120 120" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'buldak-carbonara':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="25" y="25" width="110" height="110" rx="18" fill="#F472B6" />
          <rect x="35" y="35" width="90" height="90" rx="12" fill="#FCE7F3" />
          <text x="80" y="72" textAnchor="middle" fill="#BE185D" fontSize="16" fontWeight="900">불닭</text>
          <text x="80" y="90" textAnchor="middle" fill="#BE185D" fontSize="10" fontWeight="800">CARBONARA</text>
          <text x="80" y="108" textAnchor="middle" fill="#E11D48" fontSize="14">🔥 🧀</text>
        </svg>
      );
    case 'jin-ramyun':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="25" y="25" width="110" height="110" rx="18" fill="#3B82F6" />
          <circle cx="80" cy="80" r="38" fill="#1D4ED8" />
          <text x="80" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900">진라면</text>
          <text x="80" y="94" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="800">SPICY</text>
        </svg>
      );
    case 'chapagetti':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="25" y="25" width="110" height="110" rx="18" fill="#334155" />
          <circle cx="80" cy="80" r="38" fill="#1E293B" />
          <text x="80" y="76" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="900">짜파게티</text>
          <text x="80" y="94" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700">BLACK BEAN</text>
        </svg>
      );
    case 'mat-kimchi':
    case 'bibigo-kimchi':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="35" y="30" width="90" height="105" rx="14" fill="#B91C1C" />
          <rect x="42" y="20" width="76" height="15" rx="4" fill="#15803D" />
          <path d="M 50 65 Q 80 50 110 65 Q 80 85 50 65" fill="#EF4444" opacity="0.8" />
          <text x="80" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">KIMCHI</text>
          <text x="80" y="108" textAnchor="middle" fill="#FEF08A" fontSize="10" fontWeight="700">김치 🥬 🌶️</text>
        </svg>
      );
    case 'kkakdugi':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="35" y="30" width="90" height="105" rx="14" fill="#C2410C" />
          <rect x="42" y="20" width="76" height="15" rx="4" fill="#047857" />
          <rect x="52" y="55" width="22" height="22" rx="4" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
          <rect x="85" y="55" width="22" height="22" rx="4" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2" />
          <text x="80" y="102" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">깍두기</text>
        </svg>
      );
    case 'banana-milk':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <path d="M 55 45 L 105 45 L 115 130 Q 80 140 45 130 Z" fill="#FACC15" stroke="#EAB308" strokeWidth="3" />
          <rect x="65" y="25" width="30" height="20" rx="4" fill="#15803D" />
          <text x="80" y="85" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="900">바나나맛</text>
          <text x="80" y="102" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="800">MILK 🍌</text>
        </svg>
      );
    case 'milkis':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="45" y="25" width="70" height="115" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          <circle cx="80" cy="65" r="20" fill="#38BDF8" />
          <text x="80" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">Milkis</text>
          <text x="80" y="105" textAnchor="middle" fill="#0369A1" fontSize="13" fontWeight="800">밀키스 🥛</text>
        </svg>
      );
    case 'yuja-tea':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="40" y="40" width="80" height="95" rx="16" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <rect x="48" y="25" width="64" height="18" rx="4" fill="#854D0E" />
          <circle cx="80" cy="75" r="22" fill="#FACC15" />
          <text x="80" y="80" textAnchor="middle" fill="#78350F" fontSize="16">🍋 🍯</text>
          <text x="80" y="112" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="800">유자차</text>
        </svg>
      );
    case 'gochujang':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="35" y="45" width="90" height="85" rx="12" fill="#B91C1C" />
          <rect x="30" y="30" width="100" height="20" rx="6" fill="#991B1B" />
          <text x="80" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">고추장</text>
          <text x="80" y="98" textAnchor="middle" fill="#FCA5A5" fontSize="10" fontWeight="700">GOCHUJANG 🌶️</text>
        </svg>
      );
    case 'ssamjang':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="35" y="45" width="90" height="85" rx="12" fill="#15803D" />
          <rect x="30" y="30" width="100" height="20" rx="6" fill="#166534" />
          <text x="80" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">쌈장</text>
          <text x="80" y="98" textAnchor="middle" fill="#BBF7D0" fontSize="10" fontWeight="700">SSAMJANG 🥬</text>
        </svg>
      );
    case 'sesame-oil':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="50" y="40" width="60" height="95" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
          <rect x="62" y="22" width="36" height="20" rx="4" fill="#78350F" />
          <text x="80" y="80" textAnchor="middle" fill="#78350F" fontSize="14" fontWeight="900">참기름</text>
          <text x="80" y="100" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700">SESAME OIL</text>
        </svg>
      );
    case 'honey-butter-chips':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <path d="M 40 30 L 120 30 L 130 135 L 30 135 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="3" />
          <circle cx="80" cy="75" r="26" fill="#FEF08A" />
          <text x="80" y="72" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="900">허니버터칩</text>
          <text x="80" y="90" textAnchor="middle" fill="#CA8A04" fontSize="12">🍯 🧈</text>
        </svg>
      );
    case 'choco-pie':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="30" y="35" width="100" height="95" rx="14" fill="#78350F" />
          <circle cx="80" cy="80" r="30" fill="#451A03" />
          <circle cx="80" cy="80" r="14" fill="#FFFFFF" />
          <text x="80" y="120" textAnchor="middle" fill="#FDE047" fontSize="11" fontWeight="800">CHOCO PIE</text>
        </svg>
      );
    case 'shrimp-crackers':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="35" y="30" width="90" height="105" rx="14" fill="#F97316" />
          <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">새우깡</text>
          <text x="80" y="100" textAnchor="middle" fontSize="24">🦐</text>
        </svg>
      );
    case 'mandu':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <circle cx="80" cy="85" r="45" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
          <path d="M 50 85 Q 80 50 110 85 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
          <text x="80" y="112" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="900">왕교자 만두</text>
        </svg>
      );
    case 'tteokbokki':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="45" y="35" width="70" height="100" rx="10" fill="#DC2626" />
          <rect x="40" y="25" width="80" height="16" rx="4" fill="#991B1B" />
          <text x="80" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900">요포키</text>
          <text x="80" y="95" textAnchor="middle" fill="#FEF08A" fontSize="11" fontWeight="800">TTEOKBOKKI</text>
        </svg>
      );
    case 'hetbahn':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <ellipse cx="80" cy="90" rx="48" ry="28" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
          <ellipse cx="80" cy="85" rx="45" ry="24" fill="#FFFFFF" />
          <text x="80" y="88" textAnchor="middle" fill="#DC2626" fontSize="15" fontWeight="900">햇반</text>
        </svg>
      );
    case 'cosrx-essence':
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="52" y="45" width="56" height="90" rx="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <rect x="65" y="25" width="30" height="22" rx="4" fill="#0F172A" />
          <text x="80" y="75" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="900">COSRX</text>
          <text x="80" y="92" textAnchor="middle" fill="#E53935" fontSize="10" fontWeight="700">SNAIL 96 🐌</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <rect x="30" y="30" width="100" height="100" rx="16" fill="#E53935" />
          <text x="80" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="800">KOREA MART</text>
        </svg>
      );
  }
}
