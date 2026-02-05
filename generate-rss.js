const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const katalogFolder = './js'; // folder JSON katalog
const baseURL = 'https://legoshjeans.github.io/produk.html?slug='; // URL loader JS
const rssFile = 'rss.xml'; // output
const siteTitle = 'Legosh Jeans';
const siteDescription = 'Daftar produk terbaru Legosh Jeans';
// ==================

// Fungsi buat slug otomatis dari title
function slugify(text) {
  if (!text) return 'produk-tanpa-nama'; // fallback jika title kosong
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-');
}

// Ambil semua file JSON
const katalogFiles = fs.readdirSync(katalogFolder).filter(f => f.endsWith('.json'));
let items = [];

katalogFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(katalogFolder, file), 'utf-8'));

  data.forEach(prod => {
    // Pastikan title ada, kalau tidak skip
    const title = prod.title ? prod.title.trim() : null;
    if (!title) return; 

    // Description fallback
    const description = prod.description ? prod.description.trim() : `Deskripsi singkat ${title}`;

    // Slug aman
    const slug = slugify(title);

    // URL sesuai loader JS
    const link = baseURL + slug;

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
    <link>https://legoshjeans.github.io/produk.html</link>
    <description>${siteDescription}</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items.join('')}
  </channel>
</rss>`;

// Simpan rss.xml
fs.writeFileSync(rssFile, rssContent.trim());
console.log(`✅ RSS feed berhasil dibuat: ${rssFile}`);
