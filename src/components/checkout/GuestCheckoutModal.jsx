import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { abuDhabiAreas } from '../../data/translations';
import { getProductTitle } from '../../utils/translator';
import { getProductImage } from '../../utils/assets';
import {
  X,
  Send,
  CreditCard,
  Banknote,
  ShieldCheck,
  MapPin,
  Navigation,
  AlertCircle,
  Sparkles,
  User,
  Phone,
  FileText,
  Check,
  ShoppingBag,
  Truck,
  Building,
  ChevronDown,
  MessageCircle,
  BadgeCheck,
  Search
} from 'lucide-react';
import { WHATSAPP_NUMBER, getWhatsAppOrderUrl } from '../../utils/whatsapp';

export function GuestCheckoutModal() {
  const { lang, t } = useLanguage();
  const {
    cartItems,
    subtotal,
    deliveryFee,
    grandTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setLastOrderDetails,
    clearCart
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    area: abuDhabiAreas[0] || 'Al Reem Island',
    address: '',
    notes: '',
    paymentMethod: 'codCash'
  });

  const [errors, setErrors] = useState({});
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);

  // Custom Area Select State & Click Outside Ref
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [areaSearchTerm, setAreaSearchTerm] = useState('');
  const areaDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(e.target)) {
        setIsAreaDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isCheckoutOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Modern Browser Geolocation Permission Request
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoords({ lat: latitude, lng: longitude });
        setFormData((prev) => ({
          ...prev,
          address: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) - ` + (prev.address || '')
        }));
        setIsLocating(false);
        setLocationSuccess(true);
      },
      () => {
        setIsLocating(false);
        alert('Unable to retrieve GPS coordinates. Please type your street address manually.');
      },
      { timeout: 10000 }
    );
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'WhatsApp / Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderRef = `KM-UAE-${Math.floor(10000 + Math.random() * 90000)}`;

    const waUrl = getWhatsAppOrderUrl({
      orderRef,
      customerName: formData.fullName,
      phone: formData.phone,
      area: formData.area,
      address: formData.address,
      gpsCoords,
      items: cartItems,
      subtotal,
      deliveryFee,
      grandTotal,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    });

    const orderObject = {
      orderRef,
      customer: formData,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      grandTotal,
      timestamp: new Date().toLocaleString(),
      waUrl
    };

    setLastOrderDetails(orderObject);
    setIsCheckoutOpen(false);
    clearCart();

    // Automatically open WhatsApp with pre-filled message
    window.open(waUrl, '_blank');
  };

  const totalItemsCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const filteredAreas = abuDhabiAreas.filter((area) =>
    area.toLowerCase().includes(areaSearchTerm.toLowerCase().trim())
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        onClick={() => setIsCheckoutOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-[#ECECEC] rounded-3xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* 1. Modal Header */}
          <div className="bg-gradient-to-r from-[#0E2A5A] via-[#1A3A6D] to-[#5A3418] text-white px-5 py-4 sm:px-6 sm:py-4.5 shrink-0 flex items-center justify-between relative border-b border-white/10 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-black px-3 py-0.5 rounded-full uppercase mb-1 backdrop-blur-md">
                <Sparkles size={12} className="text-amber-400 shrink-0 animate-pulse" />
                <span>EXPRESS GUEST CHECKOUT • NO LOGIN REQUIRED</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight flex items-center gap-2">
                <span>{t('checkoutTitle') || 'Express Checkout'}</span>
                <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full font-bold text-amber-200 border border-white/10">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 ml-3 hover:scale-105 active:scale-95"
              aria-label="Close Checkout Modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* 2. Scrollable Body Form Container */}
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar bg-slate-50/60">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              
              {/* LEFT COLUMN: Customer & Address Details (7 Cols on LG) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* CARD 1: Customer Details */}
                <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2.5">
                    <h3 className="text-xs font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#0E2A5A]/10 text-[#0E2A5A] flex items-center justify-center shadow-2xs">
                        <User size={15} />
                      </div>
                      <span>1. Customer Details</span>
                    </h3>
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name Input */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#0E2A5A] mb-1 flex items-center gap-1">
                        <span>Full Name</span>
                        <span className="text-amber-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          className={`w-full bg-[#F8FAFC] border ${
                            errors.fullName ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500/20' : 'border-[#ECECEC] focus:bg-white'
                          } rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#0E2A5A] focus:ring-2 focus:ring-[#0E2A5A]/15 transition-all placeholder:text-slate-400`}
                          placeholder="e.g. Ahmed Al Mansoori"
                          value={formData.fullName}
                          onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                      </div>
                      {errors.fullName && (
                        <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />
                          <span>{errors.fullName}</span>
                        </span>
                      )}
                    </div>

                    {/* WhatsApp Phone Input */}
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#0E2A5A] mb-1 flex items-center gap-1">
                        <span>WhatsApp Mobile</span>
                        <span className="text-amber-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Phone size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          className={`w-full bg-[#F8FAFC] border ${
                            errors.phone ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500/20' : 'border-[#ECECEC] focus:bg-white'
                          } rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#0E2A5A] focus:ring-2 focus:ring-[#0E2A5A]/15 transition-all placeholder:text-slate-400`}
                          placeholder="e.g. 050 123 4567"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                        />
                      </div>
                      {errors.phone && (
                        <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />
                          <span>{errors.phone}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 2: Delivery Address with Custom Select & GPS */}
                <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2.5">
                    <h3 className="text-xs font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#5A3418]/10 text-[#5A3418] flex items-center justify-center shadow-2xs">
                        <MapPin size={15} />
                      </div>
                      <span>2. Delivery Address</span>
                    </h3>

                    {/* GPS Button */}
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="text-[10px] font-extrabold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-all cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <Navigation size={12} className={isLocating ? 'animate-spin text-emerald-600' : 'text-emerald-700'} />
                      <span>{isLocating ? 'Detecting GPS...' : locationSuccess ? '✓ GPS Location Saved' : 'Detect GPS 📍'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    
                    {/* CUSTOM AREA SELECT DROPDOWN (5 Cols) */}
                    <div className="sm:col-span-5 relative" ref={areaDropdownRef}>
                      <label className="block text-[11px] font-extrabold text-[#0E2A5A] mb-1 flex items-center gap-1">
                        <span>Abu Dhabi Area</span>
                        <span className="text-amber-600">*</span>
                      </label>

                      <div
                        onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                        className="w-full bg-[#F8FAFC] hover:bg-white border border-[#ECECEC] rounded-xl px-3 py-2.5 text-xs font-bold text-[#0E2A5A] cursor-pointer flex items-center justify-between shadow-2xs transition-all focus-within:ring-2 focus-within:ring-[#0E2A5A]/15 border-[#0E2A5A]/20"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={14} className="text-amber-600 shrink-0" />
                          <span className="truncate">{formData.area}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isAreaDropdownOpen ? 'rotate-180 text-[#0E2A5A]' : ''}`} />
                      </div>

                      {/* Custom Animated Dropdown Menu */}
                      <AnimatePresence>
                        {isAreaDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#ECECEC] rounded-2xl shadow-xl z-50 overflow-hidden"
                          >
                            <div className="p-2 border-b border-[#ECECEC] bg-[#F7F7F7]">
                              <div className="relative flex items-center">
                                <Search size={13} className="absolute left-2.5 text-slate-400" />
                                <input
                                  type="text"
                                  className="w-full bg-white border border-[#ECECEC] rounded-lg pl-8 pr-2 py-1.5 text-[11px] font-semibold text-[#222222] focus:outline-none focus:border-[#0E2A5A]"
                                  placeholder="Search Abu Dhabi area..."
                                  value={areaSearchTerm}
                                  onChange={(e) => setAreaSearchTerm(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>

                            <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                              {filteredAreas.map((area) => (
                                <div
                                  key={area}
                                  onClick={() => {
                                    handleChange('area', area);
                                    setIsAreaDropdownOpen(false);
                                    setAreaSearchTerm('');
                                  }}
                                  className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-between ${
                                    formData.area === area
                                      ? 'bg-[#0E2A5A] text-white shadow-2xs'
                                      : 'hover:bg-[#F7F7F7] text-[#222222]'
                                  }`}
                                >
                                  <span>{area}</span>
                                  {formData.area === area && <Check size={14} className="text-amber-300" />}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Street Address Input (7 Cols) */}
                    <div className="sm:col-span-7">
                      <label className="block text-[11px] font-extrabold text-[#0E2A5A] mb-1 flex items-center gap-1">
                        <span>Street / Building / Villa / Flat No.</span>
                        <span className="text-amber-600">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Building size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          className={`w-full bg-[#F8FAFC] border ${
                            errors.address ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500/20' : 'border-[#ECECEC] focus:bg-white'
                          } rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#222222] focus:outline-none focus:border-[#0E2A5A] focus:ring-2 focus:ring-[#0E2A5A]/15 transition-all placeholder:text-slate-400`}
                          placeholder="e.g. Gate Towers 2, Flat 1402, Al Reem Island"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                        />
                      </div>
                      {errors.address && (
                        <span className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} />
                          <span>{errors.address}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* CARD 3: Payment Method Cards */}
                <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2.5">
                    <h3 className="text-xs font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#0E2A5A]/10 text-[#0E2A5A] flex items-center justify-center shadow-2xs">
                        <Banknote size={15} />
                      </div>
                      <span>3. Payment Method</span>
                    </h3>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} />
                      <span>Pay Upon Delivery</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Cash On Delivery Option Card */}
                    <div
                      onClick={() => handleChange('paymentMethod', 'codCash')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        formData.paymentMethod === 'codCash'
                          ? 'border-[#0E2A5A] bg-[#0E2A5A]/5 shadow-md ring-2 ring-[#0E2A5A]/15 scale-[1.01]'
                          : 'border-[#ECECEC] bg-white hover:border-slate-300 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                          formData.paymentMethod === 'codCash' ? 'bg-[#0E2A5A] text-white' : 'bg-slate-100 text-[#0E2A5A]'
                        }`}>
                          <Banknote size={18} />
                        </div>
                        <div>
                          <h4 className="font-black text-xs text-[#0E2A5A]">Cash On Delivery</h4>
                          <span className="text-[10px] text-slate-500 font-extrabold block">Pay cash to delivery driver</span>
                        </div>
                      </div>
                      {formData.paymentMethod === 'codCash' ? (
                        <div className="w-6 h-6 rounded-full bg-[#0E2A5A] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>

                    {/* Card On Delivery Option Card */}
                    <div
                      onClick={() => handleChange('paymentMethod', 'codCard')}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        formData.paymentMethod === 'codCard'
                          ? 'border-[#0E2A5A] bg-[#0E2A5A]/5 shadow-md ring-2 ring-[#0E2A5A]/15 scale-[1.01]'
                          : 'border-[#ECECEC] bg-white hover:border-slate-300 hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                          formData.paymentMethod === 'codCard' ? 'bg-[#5A3418] text-white' : 'bg-slate-100 text-[#5A3418]'
                        }`}>
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <h4 className="font-black text-xs text-[#0E2A5A]">Card On Delivery</h4>
                          <span className="text-[10px] text-slate-500 font-extrabold block">Mobile POS Card Terminal</span>
                        </div>
                      </div>
                      {formData.paymentMethod === 'codCard' ? (
                        <div className="w-6 h-6 rounded-full bg-[#0E2A5A] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Order Items Summary, Notes & Financial Summary (5 Cols on LG) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                
                {/* CARD 4: Order Basket Summary Preview */}
                <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 space-y-3 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2.5">
                    <h3 className="text-xs font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#5A3418]/10 text-[#5A3418] flex items-center justify-center">
                        <ShoppingBag size={14} />
                      </div>
                      <span>4. Order Summary</span>
                    </h3>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Compact Product Thumbnails List */}
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 no-scrollbar divide-y divide-[#ECECEC]/60">
                    {cartItems.map((item) => {
                      const title = getProductTitle(item.product, lang);
                      const imgUrl = getProductImage(item.product.image);

                      return (
                        <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#F7F7F7] border border-[#ECECEC] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                              {imgUrl ? (
                                <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span>🏬</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-[#222222] truncate text-[11px] leading-tight">{title}</h4>
                              <span className="text-[10px] text-slate-500 font-bold block">
                                Qty: {item.quantity} × {item.product.price.toFixed(2)} AED
                              </span>
                            </div>
                          </div>
                          <span className="font-black text-[#0E2A5A] shrink-0 text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-[#ECECEC]">
                            {(item.product.price * item.quantity).toFixed(2)} AED
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CARD 5: Order Notes Option */}
                <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 space-y-2 shadow-sm">
                  <label className="block text-xs font-black text-[#0E2A5A] uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-[#5A3418]" />
                    <span>5. Order Notes (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-[#F8FAFC] border border-[#ECECEC] rounded-xl px-3 py-2 text-xs font-medium text-[#222222] focus:outline-none focus:border-[#0E2A5A] focus:bg-white placeholder:text-slate-400 transition-all"
                    placeholder="e.g. Leave package with reception / call before arrival..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                  />
                </div>

                {/* FINANCIAL BREAKDOWN CARD */}
                <div className="bg-gradient-to-br from-[#0E2A5A]/5 via-amber-500/5 to-[#5A3418]/5 border border-[#0E2A5A]/15 p-4 rounded-2xl space-y-2.5 text-xs font-bold shadow-inner">
                  <div className="flex justify-between text-[#666666]">
                    <span>Items Subtotal:</span>
                    <span className="font-black text-[#0E2A5A]">{subtotal.toFixed(2)} AED</span>
                  </div>

                  <div className="flex justify-between text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <Truck size={13} className="text-emerald-700" />
                      <span>Delivery (Abu Dhabi):</span>
                    </span>
                    <span className="font-black text-emerald-700">
                      {deliveryFee === 0 ? 'FREE (Over 150 AED)' : `${deliveryFee.toFixed(2)} AED`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-dashed border-[#0E2A5A]/20 flex justify-between items-center text-sm sm:text-base font-black text-[#0E2A5A]">
                    <div>
                      <span className="block leading-none">Total Payable:</span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">(Includes 5% UAE VAT)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#0E2A5A] text-xl font-black">{grandTotal.toFixed(2)}</span>
                      <span className="text-xs font-extrabold text-[#5A3418] ml-1">AED</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </form>

          {/* 3. Modal Sticky Bottom Action Footer */}
          <div className="bg-white border-t border-[#ECECEC] p-4 sm:px-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-amber-50/40 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0E2A5A] hidden sm:flex">
              <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
              <span>100% Certified Halal Grocery • Next-Day Abu Dhabi Delivery</span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm py-3.5 px-8 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer shrink-0 border border-emerald-500/30"
            >
              <MessageCircle size={18} className="fill-current text-white shrink-0" />
              <span>Confirm & Send Order via WhatsApp</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
