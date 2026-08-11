import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SEOMeta } from '../../components/common/SEOMeta';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductModal } from '../../components/product/ProductModal';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { products } from '../../data/products';
import { Filter, SlidersHorizontal, Grid, List, RotateCcw, ShieldCheck, Flame, Home, ArrowLeft } from 'lucide-react';

import { LayoutContainer } from '../../components/layout/LayoutContainer';

export function ProductsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedDept, setSelectedDept] = useState(initialCategory);
  const [onlySale, setOnlySale] = useState(searchParams.get('sale') === 'true');
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [maxPrice, setMaxPrice] = useState(150);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync category param with selected state
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedDept(cat);
    } else if (!searchParams.get('search')) {
      setSelectedDept('all');
    }
  }, [searchParams]);

  // Fast loading skeleton for smooth UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDept, onlySale, onlyHalal, maxPrice, selectedDiscounts, sortBy]);

  const departments = [
    { id: 'all', name: t('allCategories') },
    { id: 'ramen', name: t('ramen') },
    { id: 'halal-meat', name: t('halalMeat') },
    { id: 'kimchi', name: t('kimchi') },
    { id: 'mandu', name: t('mandu') },
    { id: 'rice', name: t('rice') },
    { id: 'drinks', name: t('drinks') },
    { id: 'snacks', name: t('snacks') },
    { id: 'sauces', name: t('sauces') },
    { id: 'beauty', name: t('beauty') },
    { id: 'ready-to-eat', name: t('readyToEat') },
    { id: 'seafood', name: t('seafood') },
    { id: 'non-muslim', name: t('nonMuslim') },
    { id: 'traditional', name: t('traditional') },
    { id: 'frozen', name: t('frozen') }
  ];

  const handleDiscountToggle = (val) => {
    setSelectedDiscounts((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };

  const handleResetFilters = () => {
    setSelectedDept('all');
    setOnlySale(false);
    setOnlyHalal(false);
    setMaxPrice(150);
    setSelectedDiscounts([]);
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  const handleDeptSelect = (deptId) => {
    setSelectedDept(deptId);
    if (deptId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', deptId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Advanced & Defensive Filtering
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((p) => {
      if (!p) return false;

      // Search query match
      if (query) {
        const nameEn = String(p.name || '').toLowerCase();
        const nameKo = String(p.nameKo || '').toLowerCase();
        const nameAr = String(p.nameAr || '').toLowerCase();
        const category = String(p.category || '').toLowerCase();
        const description = String(p.description || '').toLowerCase();

        const matchesSearch =
          nameEn.includes(query) ||
          nameKo.includes(query) ||
          nameAr.includes(query) ||
          category.includes(query) ||
          description.includes(query);

        if (!matchesSearch) return false;
      }

      // Dept match
      if (selectedDept !== 'all') {
        const pCat = String(p.category || '').toLowerCase();
        const pName = String(p.name || '').toLowerCase();
        const pId = String(p.id || '').toLowerCase();

        if (selectedDept === 'halal-meat') {
          const isMeat = pCat === 'halal-meat' || (pCat === 'frozen' && p.isHalal && (pId.includes('meat') || pName.includes('beef') || pName.includes('galbi') || pName.includes('ribs') || pName.includes('brisket')));
          if (!isMeat) return false;
        } else if (selectedDept === 'non-muslim') {
          const isNonMuslim = pCat === 'non-muslim' || p.isHalal === false || p.isNonMuslim === true;
          if (!isNonMuslim) return false;
        } else if (selectedDept === 'mandu') {
          const isMandu = pCat === 'mandu' || pId.includes('mandu') || pName.includes('mandu') || pName.includes('gyoza') || pName.includes('dumpling');
          if (!isMandu) return false;
        } else if (selectedDept === 'seafood') {
          const isSeafood = pCat === 'seafood' || pName.includes('shrimp') || pName.includes('seaweed') || pName.includes('fish') || pName.includes('laver') || pName.includes('anchovy');
          if (!isSeafood) return false;
        } else if (selectedDept === 'ready-to-eat') {
          const isReady = pCat === 'ready-to-eat' || pName.includes('cup') || pName.includes('hetbahn') || pName.includes('instant') || pName.includes('tteokbokki') || pName.includes('bowl');
          if (!isReady) return false;
        } else if (selectedDept === 'traditional') {
          const isTrad = pCat === 'traditional' || pName.includes('tea') || pName.includes('oil') || pName.includes('gochujang') || pName.includes('paste') || pName.includes('rice');
          if (!isTrad) return false;
        } else if (selectedDept === 'frozen') {
          const isFrozen = pCat === 'frozen' || pCat === 'halal-meat' || pCat === 'mandu' || pId.includes('meat') || pId.includes('frozen');
          if (!isFrozen) return false;
        } else if (pCat !== selectedDept.toLowerCase()) {
          return false;
        }
      }

      // Sale match
      if (onlySale && !p.isSale && !p.originalPrice) return false;
      // Halal match
      if (onlyHalal && !p.isHalal) return false;
      // Price match
      if (typeof p.price === 'number' && p.price > maxPrice) return false;

      // Discount match
      if (selectedDiscounts.length > 0) {
        if (!p.originalPrice || typeof p.originalPrice !== 'number' || typeof p.price !== 'number') return false;
        const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        const matchesDisc = selectedDiscounts.some((d) => disc >= d);
        if (!matchesDisc) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = Number(a?.price) || 0;
      const priceB = Number(b?.price) || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (Number(b?.rating) || 0) - (Number(a?.rating) || 0);
      return 0; // default featured
    });
  }, [searchQuery, selectedDept, onlySale, maxPrice, selectedDiscounts, onlyHalal, sortBy]);

  return (
    <>
      <SEOMeta title="All Products & Grocery Catalog | Korea Mart UAE" />

      <div className="bg-[#F7F7F7] py-6 border-b border-[#ECECEC]">
        <LayoutContainer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0E2A5A]">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Korean Grocery Catalog'}
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              {searchQuery
                ? `Showing items matching "${searchQuery}" delivered across Abu Dhabi`
                : 'Browse 500+ direct imports delivered across Abu Dhabi'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-[#0E2A5A] hover:bg-[#5A3418] px-4.5 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer border-0"
              title="Go back to previous page"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0E2A5A] bg-white hover:bg-slate-100 px-4 py-2.5 rounded-full border border-[#ECECEC] shadow-sm transition-all active:scale-95 no-underline"
              title="Go to Home"
            >
              <Home size={15} />
              <span>Home</span>
            </Link>
          </div>
        </LayoutContainer>
      </div>

      <LayoutContainer className="my-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters (Reference Style) */}
          <aside className="bg-white border border-[#ECECEC] rounded-2xl p-5 h-fit space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <div className="flex items-center gap-2 font-black text-[#0E2A5A]">
                <Filter size={18} />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#5A3418] hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Clear All</span>
              </button>
            </div>

            {/* Departments */}
            <div>
              <h3 className="font-extrabold text-xs text-[#0E2A5A] uppercase tracking-wider mb-3">
                Departments
              </h3>
              <div className="space-y-1">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleDeptSelect(dept.id)}
                    className={`w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                      selectedDept === dept.id
                        ? 'bg-[#0E2A5A] text-white font-bold'
                        : 'text-[#222222] hover:bg-[#F7F7F7]'
                    }`}
                  >
                    <span>{dept.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-[#ECECEC] pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xs text-[#0E2A5A] uppercase tracking-wider">
                  Max Price
                </h3>
                <span className="text-xs font-black text-[#5A3418]">{maxPrice} AED</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0E2A5A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>10 AED</span>
                <span>200+ AED</span>
              </div>
            </div>

            {/* Halal Certified Filter */}
            <div className="border-t border-[#ECECEC] pt-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyHalal}
                  onChange={(e) => setOnlyHalal(e.target.checked)}
                  className="rounded text-[#0E2A5A] focus:ring-0"
                />
                <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  <span>100% Halal Certified Only</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="rounded text-[#0E2A5A] focus:ring-0"
                />
                <span className="text-xs font-extrabold text-red-700 flex items-center gap-1">
                  <Flame size={14} />
                  <span>Hot Deals & Sales Only</span>
                </span>
              </label>
            </div>

            {/* Discount Percent Checkboxes (Reference Style) */}
            <div className="border-t border-[#ECECEC] pt-4">
              <h3 className="font-extrabold text-xs text-[#0E2A5A] uppercase tracking-wider mb-2.5">
                Discount
              </h3>
              <div className="space-y-2">
                {[10, 20, 30].map((disc) => (
                  <label key={disc} className="flex items-center gap-2 text-xs font-semibold text-[#222222] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(disc)}
                      onChange={() => handleDiscountToggle(disc)}
                      className="rounded text-[#0E2A5A] focus:ring-0"
                    />
                    <span>{disc}% OFF or more</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#ECECEC] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="text-xs font-extrabold text-[#0E2A5A]">
                Showing <span className="text-[#5A3418] font-black">{filteredProducts.length}</span> Products
              </div>

              <div className="flex items-center gap-4">
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#F7F7F7] border border-[#ECECEC] text-[#0E2A5A] font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="featured">Featured / Bestsellers</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border border-[#ECECEC] rounded-lg p-0.5 bg-[#F7F7F7]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#0E2A5A] text-white shadow-sm' : 'text-slate-500'}`}
                    aria-label="Grid View"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#0E2A5A] text-[#5A3418] shadow-sm' : 'text-slate-500'}`}
                    aria-label="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid / List */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#ECECEC] rounded-2xl p-12 text-center">
                <span className="text-4xl mb-2 block">🔍</span>
                <h3 className="text-lg font-black text-[#0E2A5A] mb-1">
                  {searchQuery ? `No products match "${searchQuery}"` : 'No products match your filter'}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  {searchQuery ? 'Try searching for another keyword or clear active filters.' : 'Try clearing filters or adjusting your price slider.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0E2A5A] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#5A3418] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </LayoutContainer>

      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
