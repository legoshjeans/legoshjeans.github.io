// ===============================
// KONFIGURASI
// ===============================
const jsonFiles = [
  'data/katalog1.json',
  'data/katalog2.json',
  'data/katalog3.json'
];

const batchSize = 14;
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
// FILTER KATEGORI + SORT HARGA
// ===============================
function applyCategoryAndSort(products) {
  const kategoriEl = document.getElementById('filterKategori');
  const sortEl = document.getElementById('sortHarga');

  let hasil = [...products];

  if (kategoriEl && kategoriEl.value !== 'all') {
    hasil = hasil.filter(p =>
      p.kategori &&
      p.kategori.toLowerCase() === kategoriEl.value
    );
  }

  if (sortEl) {
    if (sortEl.value === 'termurah') {
      hasil.sort((a, b) => (a.harga || 0) - (b.harga || 0));
    } else if (sortEl.value === 'termahal') {
      hasil.sort((a, b) => (b.harga || 0) - (a.harga || 0));
    }
  }

  return hasil;
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

  let filtered = allProducts.filter(p =>
    p.nama.toLowerCase().includes(keyword) ||
    (p.deskripsi && p.deskripsi.toLowerCase().includes(keyword)) ||
    (p.kategori && p.kategori.toLowerCase().includes(keyword))
  );

  // 🔥 TERAPKAN FILTER KATEGORI & SORT
  filtered = applyCategoryAndSort(filtered);

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
        <p>Rp ${(p.harga || 0).toLocaleString()}</p>
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
  // LOGIKA LOAD MORE
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

  const kategoriEl = document.getElementById('filterKategori');
  if (kategoriEl) {
    kategoriEl.addEventListener('change', () => {
      visibleCount = 0;
      renderProducts();
    });
  }

  const sortEl = document.getElementById('sortHarga');
  if (sortEl) {
    sortEl.addEventListener('change', () => {
      visibleCount = 0;
      renderProducts();
    });
  }
});
