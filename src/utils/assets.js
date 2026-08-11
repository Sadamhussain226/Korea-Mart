// Dynamic Asset Loader for Korea Mart UAE
// Automatically imports and resolves all product images and banner images from src/assets

const productModules = import.meta.glob('../assets/products/*', { eager: true });
const bannerModules = import.meta.glob('../assets/banners/*', { eager: true });

// Map of filename -> resolved URL
const productMap = {};
Object.entries(productModules).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  productMap[filename] = module.default || module;
});

const bannerMap = {};
Object.entries(bannerModules).forEach(([path, module]) => {
  const filename = path.split('/').pop();
  bannerMap[filename] = module.default || module;
});

export const getProductImage = (filename) => {
  if (!filename) return null;
  return productMap[filename] || null;
};

export const getBannerImage = (filename) => {
  if (!filename) return null;
  return bannerMap[filename] || null;
};

export const heroSlides = [
  getBannerImage('slide1.jpg'),
  getBannerImage('slide2.jpg'),
  getBannerImage('slide3.jpg'),
  getBannerImage('slide4.jpg'),
  getBannerImage('slide5.jpg'),
  getBannerImage('slide6.jpg'),
  getBannerImage('slide7.jpg'),
  getBannerImage('slide8.jpg')
].filter(Boolean);

export const brandLogo = getBannerImage('PNG.jpg') || getBannerImage('Logo.png') || null;

export const allBannerImages = Object.values(bannerMap);
export const allProductImageFiles = Object.keys(productMap);

