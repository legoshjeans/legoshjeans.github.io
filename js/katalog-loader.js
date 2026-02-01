const jsonFiles = [
  'data/katalog1.json',
  'data/katalog2.json',
  'data/katalog3.json'
];

let allProducts = [];

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

function allProducts.forEach(p => {
  const stars = '★'.repeat(Math.floor(p.rating || 4)) +
                '☆'.repeat(5 - Math.floor(p.rating || 4));

  container.insertAdjacentHTML('beforeend', `
    <div class="product-card">
      
      <div class="product-image-wrap">
        ${p.diskon ? `<div class="badge-discount">${p.diskon}</div>` : ''}
        <img src="${p.gambar}" alt="${p.nama}">
      </div>

      <h3>${p.nama}</h3>
      <p>${p.deskripsi}</p>

      <div class="rating">
        ${stars} <span>${p.rating || 4.5}</span>
      </div>

      <a href="${p.link}" target="_blank">Lihat Detail</a>
    </div>
  `);
});

}

document.addEventListener('DOMContentLoaded', loadJSONFiles);
