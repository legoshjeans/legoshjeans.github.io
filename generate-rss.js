const fs = require('fs');
const path = require('path');

// CONFIG
const katalogFolder = './js';
const baseURL = 'https://legoshjeans.github.io/produk.html?slug=';
const rssFile = 'rss.xml';
const siteTitle = 'Legosh Jeans';
const siteDescription = 'Daftar produk terbaru';

// Slug harus sama dengan loader JS
function generateSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g,'-').replace(/[^\w-]+/g,'');
}

// Ambil semua JSON
const katalogFiles = fs.readdirSync(katalogFolder).filter(f => f.endsWith('.json'));
let items = [];

katalogFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(katalogFolder, file), 'utf-8'));

  data.forEach(prod => {
    // Sesuaikan key dengan loader JS, misal 'name' atau 'title'
    const title = prod.title || prod.name; 
    if (!title) return;

    const slug = generateSlug(title); // slug sama persis
    const link = baseURL + slug;
    const description = prod.description || `Deskripsi singkat ${title}`;
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

// Buat RSS
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

fs.writeFileSync(rssFile, rssContent.trim());
console.log(`✅ RSS feed berhasil dibuat: ${rssFile}`);
