const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const katalogFolder = './js'; // folder tempat katalog JSON
const baseURL = 'https://legoshjeans.github.io/'; // domain kamu
const rssFile = 'rss.xml'; // output
const siteTitle = 'Legosh Jeans';
const siteDescription = 'Daftar produk terbaru Legosh Jeans';
// ==================

// Ambil semua file JSON katalog
const katalogFiles = fs.readdirSync(katalogFolder).filter(f => f.endsWith('.json'));

let items = [];

katalogFiles.forEach(file => {
  const filePath = path.join(katalogFolder, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  data.forEach(prod => {
    const title = prod.title || prod.slug;
    const description = prod.description || `Deskripsi singkat ${title}`;
    const link = baseURL + prod.slug + '.html';
    const pubDate = new Date().toUTCString();

    items.push(`
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`);
  });
});

// Buat RSS XML
const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <link>${baseURL}</link>
    <description>${siteDescription}</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items.join('')}
  </channel>
</rss>`;

// Simpan rss.xml
fs.writeFileSync(rssFile, rssContent.trim());
console.log(`✅ RSS feed berhasil dibuat: ${rssFile}`);
