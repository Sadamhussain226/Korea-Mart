import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { getProductImage } from '../../utils/assets';
import { getProductTitle, getProductDesc } from '../../utils/translator';
import { ProductGraphic } from './ProductGraphic';
import { X, Plus, Minus, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';

export function ProductModal({ product, onClose }) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const title = getProductTitle(product, lang);
  const desc = getProductDesc(product, lang);
  const imageUrl = getProductImage(product.image);

  const handleAdd = () => {
    addToCart(product, qty);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{title}</h2>
            <p>{product.origin} • {product.weight}</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px' }}>
            {imageUrl ? (
              <img src={imageUrl} alt={title} style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '180px', height: '180px' }}>
                <ProductGraphic type={product.svgType} />
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {product.isHalal && <span className="badge badge-halal">🌙 {t('halal')}</span>}
              {product.isBestseller && <span className="badge badge-bestseller">🔥 {t('bestseller')}</span>}
              {product.spicyLevel > 0 && <span className="badge badge-spicy">🌶️ {t('spicy')} Lvl {product.spicyLevel}</span>}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              {desc}
            </p>

            <div className="price-box" style={{ marginBottom: '1.25rem' }}>
              <span className="current-price" style={{ fontSize: '1.5rem' }}>
                {product.price.toFixed(2)} {t('currency')}
              </span>
              {product.originalPrice && (
                <span className="old-price">{product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Qty:</span>
              <div className="qty-controls">
                <button type="button" className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: '800', width: '24px', textAlign: 'center' }}>{qty}</span>
                <button type="button" className="qty-btn" onClick={() => setQty(qty + 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleAdd}
              style={{ background: 'var(--secondary-navy)', marginTop: 0 }}
            >
              <ShoppingBag size={18} />
              <span>{t('addToCart')} ({(product.price * qty).toFixed(2)} {t('currency')})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
