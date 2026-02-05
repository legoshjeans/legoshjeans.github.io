const fs = require("fs");

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

const katalog = JSON.parse(fs.readFileSync("data/katalog1.json"));

let isiProduk = "";

katalog.forEach(p => {
  const id = slug(p.nama);

  isiProduk += `
<div class="produk" id="${id}" style="display:none">

<h1>${p.nama}</h1>
<img src="${p.gambar}" width="300">
<p>${p.deskripsi}</p>
<p>Harga: ${p.harga}</p>
<a href="${p.link}" target="_blank">Beli di Shopee</a>

<meta data-og="title" content="${p.nama}">
<meta data-og="desc" content="${p.deskripsi}">
<meta data-og="img" content="${p.gambar}">
<meta data-og="url" content="${p.link}">

<script type="application/ld+json">
{
 "@context": "https://schema.org/",
 "@type": "Product",
 "name": "${p.nama}",
 "image": "${p.gambar}",
 "description": "${p.deskripsi}",
 "offers": {
   "@type": "Offer",
   "url": "${p.link}",
   "priceCurrency": "IDR",
   "price": "${p.harga}",
   "availability": "https://schema.org/InStock"
 },
 "aggregateRating": {
   "@type": "AggregateRating",
   "ratingValue": "${p.rating}",
   "reviewCount": "100"
 }
}
</script>

</div>
`;
});

const html = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:image" content="">
<meta property="og:url" content="">
<meta property="og:type" content="product">
<link rel="canonical" href="">

<title>Produk</title>
</head>
<body>

${isiProduk}

<script>
const id = new URLSearchParams(location.search).get("id");
if (id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";

    const ogTitle = el.querySelector("meta[data-og='title']").content;
    const ogDesc  = el.querySelector("meta[data-og='desc']").content;
    const ogImg   = el.querySelector("meta[data-og='img']").content;
    const ogUrl   = el.querySelector("meta[data-og='url']").content;

    document.title = ogTitle;
    document.querySelector("meta[property='og:title']").content = ogTitle;
    document.querySelector("meta[property='og:description']").content = ogDesc;
    document.querySelector("meta[property='og:image']").content = ogImg;
    document.querySelector("meta[property='og:url']").content = ogUrl;
    document.querySelector("link[rel='canonical']").href = location.href;
  }
}
</script>

</body>
</html>
`;

fs.writeFileSync("produk.html", html);
console.log("produk.html berhasil dibuat!");
