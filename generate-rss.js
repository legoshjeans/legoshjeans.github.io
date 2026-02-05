const fs = require('fs');
const path = require('path');

const folder = './produk'; // folder HTML produk
const baseURL = 'https://example.com/'; // ganti dengan domain kamu

let items = '';

// Loop semua file HTML di folder produk
fs.readdirSync(folder).forEach(file => {
  if (file.endsWith('.html')) {
    const title = path.basename(file, '.html'); // ambil nama file tanpa .html
    const link = baseURL + file;
    const pubDate = new Date().toUTCString();

    items += `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <description>Deskripsi singkat ${title}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`;
  }
});

// Buat RSS XML
const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Toko Saya</title>
    <link>${baseURL}</link>
    <description>Daftar produk terbaru</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

// Simpan sebagai rss.xml
fs.writeFileSync('rss.xml', rss.trim());
console.log('RSS feed berhasil dibuat! ✅');
