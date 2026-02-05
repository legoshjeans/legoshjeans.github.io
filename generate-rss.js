const fs = require('fs');

const files = [
  'data/katalog1.json',
  'data/katalog2.json',
  'data/katalog3.json'
];

let items = '';

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file));
  data.forEach(p => {
    items += `
<item>
  <title>${p.nama}</title>
  <link>https://legoshjeans.github.io/produk.html?id=${p.id}</link>
  <description>${p.deskripsi}</description>
  <guid>${p.id}</guid>
</item>`;
  });
});

const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>Legosh Jeans Produk Terbaru</title>
<link>https://legoshjeans.github.io</link>
<description>Katalog produk terbaru</description>
${items}
</channel>
</rss>`;

fs.writeFileSync('rss.xml', rss);
console.log('RSS berhasil dibuat!');

