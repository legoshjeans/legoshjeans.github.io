// ===============================
// KONFIGURASI
// ===============================
const jsonFiles = [
  'data/katalog1.json',
  'data/katalog2.json',
  'data/katalog3.json'
];

const batchSize = 1; // tampil 6 dulu
let allProducts = [];
let visibleCount = 0;

// ===============================
// LOAD JSON
// ===============================
async function loadJSONFiles() {
  for (const file of jsonFiles) {
    try {
      const res = await fetch(file);
      const data = await res.json();
      allProducts = allProducts.concat(data);
    } catch (err) {
      console.error('Gagal load:', file, err);
    }
  }
  renderProducts();
}

// ===============================
// RATING BINTANG
// ===============================
function renderStars(rating = 4.5) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ===============================
// RENDER PRODUK
// ===============================
function renderProducts() {
  const container = document.getElementById('catalog');
  const searchInput = document.getElementById('search-input');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!container) return;

  container.innerHTML = '';

  const keyword = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = allProducts.filter(p =>
    p.nama.toLowerCase().includes(keyword) ||
    (p.deskripsi && p.deskripsi.toLowerCase().includes(keyword)) ||
    (p.kategori && p.kategori.toLowerCase().includes(keyword))
  );

  const showProducts = filtered.slice(0, visibleCount + batchSize);
  visibleCount += batchSize;

  showProducts.forEach(p => {
    const rating = p.rating || (Math.random() * (5 - 4) + 4).toFixed(1);

    container.insertAdjacentHTML('beforeend', `
      <div class="product-card">

        <div class="product-image-wrap">
          ${p.diskon ? `<div class="badge-discount">${p.diskon}</div>` : ''}
          <img src="${p.gambar}" alt="${p.nama}" loading="lazy">
        </div>

        <h3>${p.nama}</h3>
        <p>${p.deskripsi || ''}</p>

        <div class="rating">
          ${renderStars(rating)}
          <span>${rating}</span>
        </div>

        <a href="${p.link}" target="_blank" rel="noopener">Lihat Detail</a>
      </div>
    `);
  });

  // ===============================
  // LOGIKA TOMBOL LOAD MORE
  // ===============================
  if (loadMoreBtn) {
    if (filtered.length <= batchSize) {
      loadMoreBtn.style.display = 'none';
    } else if (visibleCount >= filtered.length) {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.textContent = 'Semua produk sudah ditampilkan';
      loadMoreBtn.disabled = true;
    } else {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.disabled = false;
    }
  }

  generateSchema(filtered);
}

// ===============================
// LOAD MORE
// ===============================
function loadMore() {
  renderProducts();
}

// ===============================
// SEARCH
// ===============================
function filterProducts() {
  visibleCount = 0;
  renderProducts();
}

// ===============================
// SEO JSON-LD PRODUCT
// ===============================
function generateSchema(products) {
  const old = document.getElementById('product-schema');
  if (old) old.remove();

  const schemaData = products.map(p => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.nama,
    "image": p.gambar,
    "description": p.deskripsi,
    "brand": p.toko || "Store",
    "category": p.kategori,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": p.harga || "0",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating || 4.5,
      "reviewCount": Math.floor(Math.random() * 900 + 100)
    }
  }));

  const script = document.createElement('script');
  script.id = 'product-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemaData, null, 2);
  document.body.appendChild(script);
}

// ===============================
// EVENT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  loadJSONFiles();

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMore);

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', filterProducts);
});
