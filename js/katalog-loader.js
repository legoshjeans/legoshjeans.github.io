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
// RATING
// ===============================
function renderStars(rating = 4.5) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// ===============================
// FILTER KATEGORI (AMAN)
// ===============================
function applyCategoryFilter(products) {
  const kategoriEl = document.getElementById('filterKategori');
  let hasil = [...products];

  if (kategoriEl && kategoriEl.value !== 'all') {
    hasil = hasil.filter(p =>
      (p.kategori || '').toLowerCase() === kategoriEl.value
    );
  }

  return hasil;
}

// ===============================
// RENDER PRODUK
// ===============================
function renderProducts() {
  const container = document.getElementById('katalog');
  const searchInput = document.getElementById('search-input');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!container) return;

  container.innerHTML = '';

  const keyword = searchInput ? searchInput.value.toLowerCase() : '';

  // FILTER SEARCH AMAN (tidak bikin JS mati)
  let filtered = allProducts.filter(p => {
    const nama = (p.nama || '').toLowerCase();
    const desk = (p.deskripsi || '').toLowerCase();
    const kat  = (p.kategori || '').toLowerCase();

    return (
      nama.includes(keyword) ||
      desk.includes(keyword) ||
      kat.includes(keyword)
    );
  });

  // FILTER KATEGORI
  filtered = applyCategoryFilter(filtered);

  const showProducts = filtered.slice(0, visibleCount + batchSize);
  visibleCount += batchSize;

  showProducts.forEach(p => {
    const rating = p.rating || (Math.random() * (5 - 4) + 4).toFixed(1);

    container.insertAdjacentHTML('beforeend', `
      <article class="product-card"
        itemscope itemtype="https://schema.org/Product">

        <div class="product-image-wrap">
          ${p.diskon ? `<div class="badge-discount">${p.diskon}</div>` : ''}
          <img src="${p.gambar || 'img/noimage.jpg'}"
               alt="${p.nama || 'Produk Legosh'}"
               loading="lazy"
               itemprop="image">
        </div>

        <h3 itemprop="name">${p.nama || 'Produk Legosh'}</h3>

        <p itemprop="description">${p.deskripsi || ''}</p>

        <div class="rating"
          itemprop="aggregateRating"
          itemscope itemtype="https://schema.org/AggregateRating">
          ${renderStars(rating)}
          <span itemprop="ratingValue">${rating}</span>
          <meta itemprop="reviewCount" content="120">
        </div>

        <div itemprop="offers"
             itemscope itemtype="https://schema.org/Offer">
          <meta itemprop="priceCurrency" content="IDR" />
          <meta itemprop="price" content="${p.harga || 0}" />
          <meta itemprop="availability"
                content="https://schema.org/InStock" />
          <a href="${p.link}" target="_blank" rel="noopener"
             itemprop="url">Lihat Detail</a>
        </div>

      </article>
    `);
  });

  // LOAD MORE BUTTON
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
// JSON-LD SCHEMA (RICH SNIPPET)
// ===============================
function generateSchema(products) {
  const old = document.getElementById('product-schema');
  if (old) old.remove();

  const schemaData = products.map(p => ({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.nama || 'Produk Legosh',
    "image": p.gambar || '',
    "description": p.deskripsi || '',
    "category": p.kategori || '',
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IDR",
      "price": p.harga || 0,
      "availability": "https://schema.org/InStock",
      "url": p.link || ''
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating || 4.5,
      "reviewCount": 120
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
});
