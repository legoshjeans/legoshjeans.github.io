// ===============================
// KONFIGURASI
// ===============================
const BASE_PATH = window.location.origin;

const jsonFiles = [
  '/data/katalog1.json',
  '/data/katalog2.json',
  '/data/katalog3.json'
];

const batchSize = 14;
let allProducts = [];
let visibleCount = batchSize;

// ===============================
// ACAK URUTAN PRODUK (Fisher-Yates)
// ===============================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===============================
// LOAD JSON
// ===============================
async function loadJSONFiles() {
  for (const file of jsonFiles) {
    try {
      const res = await fetch(BASE_PATH + file);
      const data = await res.json();
      allProducts = allProducts.concat(data);
    } catch (err) {
      console.error('Gagal load:', file, err);
    }
  }

  // ACAK SEKALI SETELAH SEMUA PRODUK TERKUMPUL
  shuffleArray(allProducts);

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
  const kategoriEl = document.getElementById('filterKategori');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!container) return;

  container.innerHTML = '';

  const keyword = searchInput ? searchInput.value.toLowerCase() : '';
  const kategori = kategoriEl ? kategoriEl.value.toLowerCase() : 'all';

  // FILTER
  const filtered = allProducts.filter(p => {
    const cocokKeyword =
      p.nama.toLowerCase().includes(keyword) ||
      (p.deskripsi && p.deskripsi.toLowerCase().includes(keyword));

    const cocokKategori =
      kategori === 'all' ||
      (p.kategori && p.kategori.toLowerCase() === kategori);

    return cocokKeyword && cocokKategori;
  });

  const showProducts = filtered.slice(0, visibleCount);

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
<a 
  href="/produk.html?id=${p.id}" 
  class="detail-link" 
  data-link="${p.link}"
>
  Lihat Detail
</a>
      </div>
    `);
  });

  // LOAD MORE BUTTON
  if (loadMoreBtn) {
    if (visibleCount >= filtered.length) {
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
  visibleCount += batchSize;
  renderProducts();
}

// ===============================
// SEARCH & FILTER
// ===============================
function filterProducts() {
  visibleCount = batchSize;
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
    "brand": {
      "@type": "Brand",
      "name": "Legosh"
    },
    "category": p.kategori,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": p.harga || "0",
      "availability": "https://schema.org/InStock",
      "url": p.link
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
  if (kategoriEl) kategoriEl.addEventListener('change', filterProducts);
});
// ===============================
// REDIRECT SAAT KLIK DETAIL
// ===============================
document.addEventListener('click', function(e) {
  const link = e.target.closest('.detail-link');
  if (!link) return;

  e.preventDefault(); // hentikan buka URL id
  const tujuan = link.getAttribute('data-link');
  window.location.href = tujuan; // lompat ke Shopee
});





