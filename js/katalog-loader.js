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

function renderProducts() {
  const container = document.getElementById('catalog');
  container.innerHTML = '';

  allProducts.forEach(p => {
    container.insertAdjacentHTML('beforeend', `
      <div class="product-card">
        <img src="${p.gambar}" alt="${p.nama}">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
        <a href="${p.link}" target="_blank">Lihat Detail</a>
      </div>
    `);
  });
}

document.addEventListener('DOMContentLoaded', loadJSONFiles);
