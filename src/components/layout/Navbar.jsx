import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../ui/LanguageSelector';
import { products } from '../../data/products';
import { getProductImage, brandLogo } from '../../utils/assets';
import { getProductTitle } from '../../utils/translator';
import {
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  Flame,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Grid,
  Tag,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { LayoutContainer } from '../layout/LayoutContainer';

export const Navbar = memo(function Navbar() {
  const { isRtl, lang, t } = useLanguage();
  const { cartCount, subtotal, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState('Abu Dhabi Central');
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [isMobileLocOpen, setIsMobileLocOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Live Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Scroll effect for elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Outside Click for Search Suggestions Dropdown (Desktop & Mobile)
  useEffect(() => {
    function handleClickOutside(e) {
      const inDesktop = searchContainerRef.current && searchContainerRef.current.contains(e.target);
      const inMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const locations = [
    'Abu Dhabi Central',
    'Al Reem Island',
    'Corniche & Khalidiyah',
    'Khalifa City & Al Raha',
    'Mohammed Bin Zayed (MBZ) City',
    'Saadiyat Island',
    'Al Mushrif & Al Bateen'
  ];

  const categories = [
    { id: 'all', nameKey: 'allCategories', emoji: '🏬', route: '/products' },
    { id: 'ramen', nameKey: 'ramen', emoji: '🍜', route: '/products?category=ramen' },
    { id: 'halal-meat', nameKey: 'halalMeat', emoji: '🥩', route: '/products?category=halal-meat' },
    { id: 'kimchi', nameKey: 'kimchi', emoji: '🥬', route: '/products?category=kimchi' },
    { id: 'mandu', nameKey: 'mandu', emoji: '🥟', route: '/products?category=mandu' },
    { id: 'rice', nameKey: 'rice', emoji: '🍚', route: '/products?category=rice' },
    { id: 'drinks', nameKey: 'drinks', emoji: '🧃', route: '/products?category=drinks' },
    { id: 'snacks', nameKey: 'snacks', emoji: '🍿', route: '/products?category=snacks' },
    { id: 'sauces', nameKey: 'sauces', emoji: '🌶️', route: '/products?category=sauces' },
    { id: 'beauty', nameKey: 'beauty', emoji: '✨', route: '/products?category=beauty' },
    { id: 'ready-to-eat', nameKey: 'readyToEat', emoji: '🍱', route: '/products?category=ready-to-eat' },
    { id: 'seafood', nameKey: 'seafood', emoji: '🐟', route: '/products?category=seafood' },
    { id: 'non-muslim', nameKey: 'nonMuslim', emoji: '🥓', route: '/products?category=non-muslim' },
    { id: 'traditional', nameKey: 'traditional', emoji: '🍶', route: '/products?category=traditional' },
    { id: 'frozen', nameKey: 'frozen', emoji: '🧊', route: '/products?category=frozen' }
  ];

  // Professional Live Search Suggestions Filter
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase().trim();

    return products.filter((p) => {
      if (!p) return false;
      const nameEn = String(p.name || '').toLowerCase();
      const nameKo = String(p.nameKo || '').toLowerCase();
      const nameAr = String(p.nameAr || '').toLowerCase();
      const cat = String(p.category || '').toLowerCase();
      return nameEn.includes(query) || nameKo.includes(query) || nameAr.includes(query) || cat.includes(query);
    }).slice(0, 6);
  }, [searchQuery]);

  // Keyboard Navigation Handlers for Live Search
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (!isSearchFocused || searchSuggestions.length === 0) return;
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      if (!isSearchFocused || searchSuggestions.length === 0) return;
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchSuggestions.length) % searchSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchSuggestions[selectedIndex]) {
        navigate(`/product/${searchSuggestions[selectedIndex].id}`);
        setIsSearchFocused(false);
        setSearchQuery('');
      } else if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchFocused(false);
      } else {
        setIsSearchFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const handleSelectSuggestion = (productId) => {
    navigate(`/product/${productId}`);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleCategoryClick = (route) => {
    navigate(route);
  };

  return (
    <header className={`relative bg-white/95 backdrop-blur-md border-b border-[#ECECEC] transition-all duration-300 ${
      isScrolled ? 'shadow-lg border-[#ECECEC]/80' : 'shadow-sm'
    }`}>
      {/* Main Bar: Logo Left | Search Center | Actions & Menu Right */}
      <LayoutContainer className="py-3 flex items-center justify-between gap-3 md:gap-6">
        
        {/* LOGO LEFT */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group shrink-0">
          {brandLogo ? (
            <img
              src={brandLogo}
              alt="Korea Mart UAE Logo"
              className="h-10 md:h-11 w-auto max-w-[140px] object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#0E2A5A] via-[#1E3A6A] to-[#5A3418] text-white rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-md group-hover:scale-105 transition-transform">
              KM
            </div>
          )}
          <div>
            <h1 className="text-lg md:text-xl font-black text-[#0E2A5A] leading-none tracking-tight">{t('storeName')}</h1>
            <span className="text-[9px] md:text-[10px] font-extrabold text-[#5A3418] uppercase tracking-widest block mt-0.5">Abu Dhabi, UAE 🇦🇪</span>
          </div>
        </Link>

        {/* SEARCH CENTER (Shorter max-w-md for optimal desktop layout) */}
        <div className="flex-1 max-w-md hidden md:block relative" ref={searchContainerRef}>
          <div className="flex items-center bg-[#F7F7F7] border border-[#ECECEC] rounded-full p-1 focus-within:border-[#0E2A5A] focus-within:bg-white focus-within:shadow-md transition-all">
            <div className="flex-1 relative flex items-center pl-4">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                className="w-full pr-8 py-1.5 bg-transparent text-xs font-medium text-[#222222] placeholder:text-slate-400 focus:outline-none"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs px-2"
                  aria-label="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsSearchFocused(false);
                }
              }}
              className="bg-[#0E2A5A] hover:bg-[#5A3418] text-white p-2 rounded-full shadow-sm transition-colors mr-0.5 shrink-0"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </div>

          {/* LIVE SEARCH SUGGESTIONS DROPDOWN */}
          <AnimatePresence>
            {isSearchFocused && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECECEC] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-[#ECECEC]"
              >
                <div className="p-2.5 bg-[#F7F7F7] flex items-center justify-between text-[11px] font-bold text-[#0E2A5A]">
                  <span>{t('liveSearchResults')} ({searchSuggestions.length})</span>
                  <span className="text-slate-400 font-normal">{t('useKeysToNavigate')}</span>
                </div>

                {searchSuggestions.map((product, idx) => {
                  const title = getProductTitle(product, lang);
                  const imgUrl = getProductImage(product?.image);
                  const formattedPrice = (Number(product?.price) || 0).toFixed(2);

                  return (
                    <div
                      key={product?.id || idx}
                      onClick={() => handleSelectSuggestion(product.id)}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        selectedIndex === idx ? 'bg-[#0E2A5A]/5' : 'hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#ECECEC] p-1 flex items-center justify-center shrink-0">
                        {imgUrl ? (
                          <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span>🏬</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs text-[#0E2A5A] truncate">{title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-[#5A3418] uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {product?.category || ''}
                          </span>
                          <span className="text-[10px] text-slate-400">{product?.origin || ''}</span>
                        </div>
                      </div>

                      <span className="font-black text-xs text-[#0E2A5A] shrink-0">
                        {formattedPrice} AED
                      </span>
                    </div>
                  );
                })}

                <div
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchFocused(false);
                    }
                  }}
                  className="p-2.5 bg-[#0E2A5A] text-white text-center text-xs font-black hover:bg-[#5A3418] transition-colors cursor-pointer"
                >
                  {t('viewAllSearchResults')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT ACTIONS: [ Language ] [ Deliver To ] [ Cart ] [ Mobile Menu ] */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-[#0E2A5A] hover:bg-[#F7F7F7] rounded-full transition-colors"
            aria-label="Toggle Mobile Search"
          >
            <Search size={20} />
          </button>

          {/* DESKTOP LANGUAGE SELECTOR (Between Search and Deliver To) */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Location Picker (Desktop Only) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsLocModalOpen(!isLocModalOpen)}
              className="flex items-center gap-2 bg-[#F7F7F7] hover:bg-[#ECECEC] px-3 py-1.5 rounded-full text-xs font-bold text-[#0E2A5A] border border-[#ECECEC] transition-colors"
            >
              <MapPin size={14} className="text-amber-600" />
              <div className="text-left rtl:text-right">
                <span className="text-[10px] text-slate-500 block leading-none">Deliver To:</span>
                <span className="truncate max-w-[110px] block">{selectedLocation}</span>
              </div>
              <ChevronDown size={12} />
            </button>

            {isLocModalOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#ECECEC] rounded-xl shadow-xl z-50 p-2 text-xs">
                <div className="px-3 py-1.5 font-black text-[#0E2A5A] border-b border-[#ECECEC] mb-1">
                  Select Abu Dhabi Area
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocModalOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      loc === selectedLocation ? 'bg-[#0E2A5A] text-white font-bold' : 'hover:bg-[#F7F7F7] text-[#222222]'
                    }`}
                  >
                    <span>{loc}</span>
                    {loc === selectedLocation && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#0E2A5A] hover:bg-[#5A3418] text-white px-3 md:px-4 py-2 rounded-full text-xs font-extrabold shadow-md transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#5A3418] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-black">{subtotal.toFixed(2)} AED</span>
          </button>

          {/* Mobile Menu Toggle Button (Hamburger / X) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-[#F7F7F7] text-[#0E2A5A] hover:bg-[#ECECEC] rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </LayoutContainer>

      {/* Expandable Mobile Search Bar Overlay with Live Suggestions */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden relative bg-[#F7F7F7] border-t border-[#ECECEC] px-4 py-2.5 z-40"
            ref={mobileSearchRef}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsMobileSearchOpen(false);
                  setIsSearchFocused(false);
                }
              }}
              className="flex items-center bg-white border border-[#ECECEC] rounded-full px-3 py-1.5 shadow-sm"
            >
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                autoFocus
                className="w-full text-xs font-medium text-[#222222] bg-transparent focus:outline-none"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setSelectedIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsMobileSearchOpen(false);
                      setIsSearchFocused(false);
                    }
                  } else if (e.key === 'Escape') {
                    setIsMobileSearchOpen(false);
                    setIsSearchFocused(false);
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1 mr-1"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="bg-[#0E2A5A] hover:bg-[#5A3418] text-white p-1.5 rounded-full shadow-sm transition-colors shrink-0"
                aria-label="Search"
              >
                <Search size={13} />
              </button>
            </form>

            {/* MOBILE LIVE SEARCH SUGGESTIONS DROPDOWN */}
            <AnimatePresence>
              {isSearchFocused && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-2 bg-white border border-[#ECECEC] rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-[#ECECEC] max-h-72 overflow-y-auto"
                >
                  <div className="p-2 bg-[#F7F7F7] flex items-center justify-between text-[10px] font-black text-[#0E2A5A] uppercase tracking-wider">
                    <span>{t('liveSearchResults')} ({searchSuggestions.length})</span>
                  </div>

                  {searchSuggestions.map((product, idx) => {
                    const title = getProductTitle(product, lang);
                    const imgUrl = getProductImage(product?.image);
                    const formattedPrice = (Number(product?.price) || 0).toFixed(2);

                    return (
                      <div
                        key={product?.id || idx}
                        onClick={() => {
                          handleSelectSuggestion(product.id);
                          setIsMobileSearchOpen(false);
                        }}
                        className={`p-2.5 flex items-center gap-2.5 cursor-pointer transition-colors active:bg-[#0E2A5A]/5 ${
                          selectedIndex === idx ? 'bg-[#0E2A5A]/5' : 'hover:bg-[#F7F7F7]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#F7F7F7] border border-[#ECECEC] p-0.5 flex items-center justify-center shrink-0">
                          {imgUrl ? (
                            <img src={imgUrl} alt={title} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-xs">🏬</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-[#0E2A5A] truncate">{title}</h4>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {product?.category || ''}
                          </span>
                        </div>

                        <span className="font-black text-xs text-[#0E2A5A] shrink-0">
                          {formattedPrice} AED
                        </span>
                      </div>
                    );
                  })}

                  <div
                    onClick={() => {
                      if (searchQuery.trim()) {
                        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                        setIsSearchFocused(false);
                        setIsMobileSearchOpen(false);
                      }
                    }}
                    className="p-2.5 bg-[#0E2A5A] text-white text-center text-xs font-black hover:bg-[#5A3418] transition-colors cursor-pointer"
                  >
                    {t('viewAllSearchResults')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLICKABLE RESPONSIVE CATEGORY NAVIGATION STRIP */}
      <nav className="bg-[#5A3418] text-white text-xs font-extrabold border-t border-amber-900/30">
        <LayoutContainer className="flex items-center justify-between py-2 gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth snap-x snap-mandatory flex-1 select-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.route)}
                className="px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 hover:bg-white/20 active:scale-95 cursor-pointer shrink-0 snap-start text-xs font-extrabold border border-transparent hover:border-amber-400/30"
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{t(cat.nameKey)}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2 rtl:ml-0 rtl:mr-2">
            <button
              onClick={() => handleCategoryClick('/products?sale=true')}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Flame size={12} />
              <span>{t('hotOffers')}</span>
            </button>
          </div>
        </LayoutContainer>
      </nav>

      {/* Minimal Mobile Hamburger Menu (Opens DIRECTLY BELOW Header) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay (Starts below sticky header) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMobileLocOpen(false);
              }}
              className="fixed inset-0 top-[105px] bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide Drawer Panel (Anchored top-full directly below header) */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 rtl:left-auto rtl:right-0 w-84 max-w-[92vw] bg-white z-50 shadow-2xl rounded-br-3xl rtl:rounded-br-none rtl:rounded-bl-3xl border-b border-r rtl:border-r-0 rtl:border-l border-[#ECECEC] flex flex-col justify-between overflow-y-auto md:hidden max-h-[calc(100vh-115px)]"
            >
              <div>
                {/* Mobile Drawer Header with Prominent Red Close X Button at TOP-RIGHT */}
                <div className="p-4 bg-[#0E2A5A] text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {brandLogo ? (
                      <img
                        src={brandLogo}
                        alt="Korea Mart UAE Logo"
                        className="h-8 w-auto object-contain bg-white p-0.5 rounded-md"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#5A3418] text-white rounded-lg flex items-center justify-center font-black text-sm">
                        KM
                      </div>
                    )}
                    <div>
                      <span className="font-black text-sm block leading-tight">{t('storeName')}</span>
                      <span className="text-[9px] text-amber-300 uppercase tracking-wider block font-bold">Abu Dhabi, UAE 🇦🇪</span>
                    </div>
                  </div>

                  {/* PROMINENT TOP-RIGHT RED CLOSE BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileLocOpen(false);
                    }}
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center border border-white/30 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                    aria-label="Close Mobile Menu"
                    title="Close Menu"
                  >
                    <X size={20} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* 2 ONLY CONTROLS: LEFT TOP Language | RIGHT TOP Deliver To */}
                <div className="p-6 space-y-6">
                  <div className="text-[10px] font-black text-[#5A3418] uppercase tracking-widest border-b border-[#ECECEC] pb-2.5">
                    Quick Mobile Settings
                  </div>

                  {/* TOP ROW: LEFT TOP Language | RIGHT TOP Deliver To */}
                  <div className="flex items-start justify-between gap-3 relative pt-1">
                    
                    {/* LEFT TOP: Language Switcher */}
                    <div className="relative shrink-0">
                      <LanguageSelector align="left" />
                    </div>

                    {/* RIGHT TOP: Deliver To / Location Selector */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsMobileLocOpen(!isMobileLocOpen)}
                        className="flex items-center gap-1.5 bg-[#F7F7F7] hover:bg-[#ECECEC] text-[#0E2A5A] px-3 py-1.5 rounded-full text-xs font-bold border border-[#ECECEC] transition-all cursor-pointer shadow-2xs select-none active:scale-95"
                        aria-label="Select Location"
                      >
                        <MapPin size={14} className="text-amber-600 shrink-0" />
                        <span className="truncate max-w-[100px] text-left">{selectedLocation}</span>
                        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isMobileLocOpen ? 'rotate-180 text-[#0E2A5A]' : ''}`} />
                      </button>

                      {/* Fully Responsive Location Dropdown */}
                      <AnimatePresence>
                        {isMobileLocOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-60 max-w-[calc(100vw-3rem)] bg-white border border-[#ECECEC] rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden divide-y divide-[#ECECEC]/40"
                          >
                            <div className="px-3 py-1.5 text-[10px] font-black text-[#0E2A5A] uppercase tracking-wider bg-[#F7F7F7] rounded-xl mb-1">
                              📍 Select Abu Dhabi Area
                            </div>

                            <div className="space-y-0.5 pt-1 max-h-56 overflow-y-auto">
                              {locations.map((loc) => {
                                const isActive = loc === selectedLocation;

                                return (
                                  <button
                                    key={loc}
                                    type="button"
                                    onClick={() => {
                                      setSelectedLocation(loc);
                                      setIsMobileLocOpen(false);
                                    }}
                                    className={`w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer whitespace-normal break-words ${
                                      isActive
                                        ? 'bg-[#0E2A5A] text-white shadow-xs'
                                        : 'hover:bg-[#F7F7F7] text-[#222222]'
                                    }`}
                                  >
                                    <span className="leading-snug pr-2">{loc}</span>
                                    {isActive && (
                                      <span className="text-amber-300 font-black text-xs shrink-0">✓</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </div>
              </div>

              {/* Bottom Copyright Strip */}
              <div className="p-3 border-t border-[#ECECEC] bg-[#F8FAFC] text-center">
                <p className="text-[11px] font-bold text-slate-400">
                  Korea Mart UAE • Abu Dhabi 🇦🇪
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
});
