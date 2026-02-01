const fs = require('fs');
const path = require('path');

// Folder tempat JSON
const dataFolder = path.join(__dirname, 'data');

// Ambil semua file JSON
const files = fs.readdirSync(dataFolder).filter(f => f.endsWith('.json'));

let allItems = [];

// Loop tiap file JSON
files.forEach(file => {
  const filePath = path.join(dataFolder, file);
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  allItems = allItems.concat(jsonData);
});

// Opsional: urutkan produk terbaru dulu (bisa disesuaikan)
allItems.sort((a, b) => {
  const dateA = a.tanggal ? new Date(a.tanggal) : new Date();
  const dateB = b.tanggal ? new Date(b.tanggal) : new Date();
  return dateB - dateA;
});

// Generate RSS
let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>Legosh Jeans</title>
<link>https://legoshjeans.github.io</link>
<description>Katalog Produk Legosh Jeans</description>
`;

allItems.forEach(item => {
  rss += `
  <item>
    <title>${item.nama}</title>
    <link>${item.link}</link>
    <description>
      <![CDATA[
        <p>${item.deskripsi}</p>
        <p>Kategori: ${item.kategori}</p>
        <p>Harga: Rp ${item.harga}</p>
        <p>Diskon: ${item.diskon}</p>
        <p>Rating: ${item.rating} ⭐</p>
        <img src="${item.gambar}" alt="${item.nama}" width="300"/>
      ]]>
    </description>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <guid>${item.link}</guid>
  </item>
  `;
});

rss += `
</channel>
</rss>
`;

// Simpan RSS di root repo
fs.writeFileSync(path.join(__dirname, 'rss.xml'), rss);

console.log('✅ RSS berhasil dibuat!');
