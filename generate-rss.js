const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const katalogFolder = './js'; // folder JSON katalog
const baseURL = 'https://legoshjeans.github.io/'; // domain
const rssFile = 'rss.xml'; // file output
const siteTitle = 'Legosh Jeans';
const siteDescription = 'Daftar produk terbaru Legosh Jeans';
// ==================

// Fungsi buat slug otomatis dari title
function slugify(text) {
  return text
    .toString()
    .normalize('NFD')                  // hilangkan aksen
    .replace(/[\u0300-\u036f]/g, '')  // hilangkan karakter khusus
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')       // hanya huruf, angka dan spasi
    .replace(/\s+/g, '-');            // ganti spasi jadi -
}

// Ambil semua file JSON
const katalogFiles = fs.readdirSync(katalogFolder).filter(f => f.endsWith('.json'));
let items = [];

katalogFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(katalogFolder, file), 'utf-8'));

  data.forEach(prod => {
    if (!prod.title) return; // skip jika tidak ada title

    const title = prod.title.trim();
    const description = prod.description ? prod.description.trim() : `Deskripsi singkat ${title}`;
    const slug = slugify(title);
    const link = baseURL + slug + '.html';
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
