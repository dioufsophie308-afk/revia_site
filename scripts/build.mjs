// Build sans dépendance (Node >= 18).
//  - copie public/ vers dist/ (ou dist-html/ avec RELATIVE=1 : pages ouvrables par double-clic)
//  - génère catalogue, fiches produit, panier, pages de contenu, plan du site, sitemap.xml, robots.txt
//  - insère en-tête/pied de page, balises canoniques, données structurées
//  - génère config.js depuis SUPABASE_URL / SUPABASE_ANON_KEY, calcule le poids des pages
import { cpSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { dirname, join, relative as relPath } from 'node:path';
import { pages } from './content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const relative = process.env.RELATIVE === '1';
const out = join(root, relative ? 'dist-html' : 'dist');
const SITE = (process.env.SITE_URL || 'https://www.revia.example').replace(/\/$/, '');
if (!process.env.SITE_URL) console.warn('Avertissement : SITE_URL absent, URL de démonstration utilisée pour canonical et sitemap (' + SITE + ').');

const products = JSON.parse(readFileSync(join(root, 'data/products.json'), 'utf8'));
const shipping = JSON.parse(readFileSync(join(root, 'data/shipping.json'), 'utf8'));
const DEMO = products.demo !== false;
const P = products.produits;
const PBY = Object.fromEntries(P.map((p) => [p.slug, p]));

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'produit'), { recursive: true });
cpSync(join(root, 'public'), out, { recursive: true });

/* ---------- Outils ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (c) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(c / 100);
const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const enc = encodeURIComponent;
const write = (rel, content) => { const p = join(out, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); };

/* Visuels « nature morte » en tons neutres (illustrations, remplacées par les photos quand elles existent). */
const PALS = [
  { top: '#EFE9DE', bot: '#E1D7C6', a: '#C4B198', b: '#8C7054', c: '#F7F2E9', ink: '#2B2622' },   // sable
  { top: '#EBE9E4', bot: '#D9D6CE', a: '#AAA69B', b: '#6C6961', c: '#F5F3EF', ink: '#2B2622' },   // pierre
  { top: '#EEE0D5', bot: '#DCC6B6', a: '#B98F76', b: '#87604C', c: '#F8EFE8', ink: '#2B2622' },   // argile
  { top: '#E6E8DF', bot: '#D2D7C8', a: '#9BA48C', b: '#66705A', c: '#F2F3EC', ink: '#2B2622' },   // sauge
  { top: '#4B4741', bot: '#37332E', a: '#D2C6B5', b: '#A99B88', c: '#EAE3D7', ink: '#F4EFE7' }    // fusain
];
const hash = (s) => [...s].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
const palOf = (p) => PALS[[0, 1, 2, 3, 0, 2, 1, 3, 4][hash(p.slug) % 9]];
const SCENES = {
  'Alimentation': (c) => `<ellipse cx="100" cy="196" rx="52" ry="7" fill="#000" opacity=".12"/><rect x="62" y="104" width="76" height="90" rx="14" fill="${c.a}"/><rect x="66" y="84" width="68" height="22" rx="8" fill="${c.b}"/><rect x="74" y="128" width="52" height="38" rx="6" fill="${c.c}" opacity=".92"/><path d="M82 142h36M82 152h24" stroke="${c.b}" stroke-width="2" stroke-linecap="round"/><path d="M146 196c4-18 12-30 26-38-2 16-10 30-26 38z" fill="${c.b}" opacity=".55"/><path d="M40 196c-2-14 4-24 14-30 2 12-3 23-14 30z" fill="${c.b}" opacity=".4"/>`,
  'Vêtements et textiles': (c) => `<ellipse cx="100" cy="206" rx="64" ry="7" fill="#000" opacity=".1"/><rect x="40" y="150" width="120" height="48" rx="10" fill="${c.b}"/><rect x="46" y="112" width="112" height="46" rx="10" fill="${c.a}"/><rect x="52" y="76" width="104" height="44" rx="10" fill="${c.c}"/><g stroke="${c.b}" stroke-width="2.5" stroke-linecap="round" opacity=".55"><path d="M64 88h80M64 98h80M64 108h80"/></g><g stroke="${c.c}" stroke-width="2.5" stroke-linecap="round" opacity=".6"><path d="M58 126h92M58 136h92M58 146h92"/></g><g stroke="${c.a}" stroke-width="2.5" stroke-linecap="round" opacity=".6"><path d="M52 164h96M52 174h96M52 184h96"/></g>`,
  'Accessoires et bijoux': (c) => `<ellipse cx="100" cy="196" rx="58" ry="10" fill="#000" opacity=".12"/><ellipse cx="100" cy="176" rx="62" ry="22" fill="${c.a}"/><ellipse cx="100" cy="170" rx="62" ry="20" fill="${c.c}" opacity=".5"/><circle cx="100" cy="122" r="40" fill="none" stroke="${c.b}" stroke-width="9"/><circle cx="100" cy="122" r="40" fill="none" stroke="${c.c}" stroke-width="2" opacity=".5"/><circle cx="100" cy="80" r="11" fill="${c.c}"/><circle cx="97" cy="77" r="4" fill="#fff" opacity=".8"/>`,
  'Cosmétiques et bien-être': (c) => `<ellipse cx="100" cy="196" rx="56" ry="8" fill="#000" opacity=".12"/><rect x="52" y="124" width="96" height="70" rx="16" fill="${c.a}"/><rect x="48" y="104" width="104" height="28" rx="12" fill="${c.b}"/><rect x="62" y="150" width="76" height="26" rx="6" fill="${c.c}" opacity=".9"/><path d="M72 163h56" stroke="${c.b}" stroke-width="2" stroke-linecap="round"/><ellipse cx="164" cy="190" rx="14" ry="9" fill="${c.b}" opacity=".5"/><ellipse cx="38" cy="192" rx="9" ry="6" fill="${c.a}" opacity=".7"/>`,
  'Artisanat': (c) => `<ellipse cx="100" cy="204" rx="50" ry="7" fill="#000" opacity=".12"/><path d="M86 70h28l-4 26c28 14 40 42 40 70 0 20-14 36-50 36s-50-16-50-36c0-28 12-56 40-70z" fill="${c.a}"/><path d="M86 70h28l-1 8H87z" fill="${c.b}"/><path d="M70 150c18 8 42 8 60 0" stroke="${c.b}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><path d="M70 168c18 8 42 8 60 0" stroke="${c.c}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/><g stroke="${c.b}" stroke-width="2" stroke-linecap="round" opacity=".6"><path d="M96 70c-2-22-12-38-20-48M104 70c2-22 10-34 22-44M100 70c0-16 2-32 6-44"/></g>`,
  'Décoration': (c) => `<ellipse cx="100" cy="196" rx="62" ry="8" fill="#000" opacity=".12"/><ellipse cx="100" cy="150" rx="68" ry="44" fill="${c.a}"/><ellipse cx="100" cy="146" rx="56" ry="35" fill="${c.c}"/><ellipse cx="100" cy="146" rx="40" ry="24" fill="none" stroke="${c.a}" stroke-width="2.5"/><ellipse cx="100" cy="146" rx="22" ry="12" fill="${c.b}" opacity=".35"/><path d="M168 130c10-14 8-28 0-40 12 4 20 18 16 32-2 8-8 10-16 8z" fill="${c.b}" opacity=".5"/>`,
  'Cadeaux et objets culturels': (c) => `<ellipse cx="100" cy="204" rx="62" ry="8" fill="#000" opacity=".12"/><rect x="48" y="112" width="104" height="86" rx="8" fill="${c.a}"/><rect x="42" y="92" width="116" height="26" rx="8" fill="${c.b}"/><rect x="94" y="92" width="12" height="106" fill="${c.c}" opacity=".9"/><path d="M100 92c-6-22-26-28-30-18s14 18 30 18zM100 92c6-22 26-28 30-18s-14 18-30 18z" fill="${c.c}"/>`
};
const bottle = (c) => `<ellipse cx="100" cy="198" rx="40" ry="6" fill="#000" opacity=".12"/><rect x="78" y="112" width="44" height="86" rx="14" fill="${c.a}"/><path d="M90 112V82h20v30z" fill="${c.a}"/><rect x="88" y="66" width="24" height="18" rx="5" fill="${c.b}"/><rect x="82" y="132" width="36" height="40" rx="5" fill="${c.c}" opacity=".92"/><path d="M88 146h24M88 156h14" stroke="${c.b}" stroke-width="2" stroke-linecap="round"/>`;
const tin = (c) => `<ellipse cx="100" cy="198" rx="54" ry="8" fill="#000" opacity=".12"/><rect x="56" y="112" width="88" height="84" rx="10" fill="${c.a}"/><ellipse cx="100" cy="112" rx="44" ry="11" fill="${c.b}"/><ellipse cx="100" cy="109" rx="44" ry="11" fill="${c.c}" opacity=".5"/><rect x="68" y="136" width="64" height="34" rx="5" fill="${c.c}" opacity=".92"/><path d="M78 150h44M78 160h28" stroke="${c.b}" stroke-width="2" stroke-linecap="round"/>`;
const tote = (c) => `<ellipse cx="100" cy="204" rx="52" ry="7" fill="#000" opacity=".12"/><path d="M72 118c0-34 56-34 56 0" fill="none" stroke="${c.b}" stroke-width="7" stroke-linecap="round"/><rect x="52" y="112" width="96" height="92" rx="8" fill="${c.a}"/><g stroke="${c.c}" stroke-width="3" opacity=".6"><path d="M52 140h96M52 160h96M52 180h96"/></g><g stroke="${c.b}" stroke-width="3" opacity=".5"><path d="M76 112v92M100 112v92M124 112v92"/></g>`;
const basket = (c) => `<ellipse cx="100" cy="204" rx="62" ry="8" fill="#000" opacity=".12"/><path d="M52 124h96l-10 76H62z" fill="${c.a}"/><ellipse cx="100" cy="124" rx="48" ry="11" fill="${c.b}"/><g stroke="${c.c}" stroke-width="3" opacity=".55"><path d="M58 146h84M62 168h76M64 186h72"/></g><g stroke="${c.b}" stroke-width="3" opacity=".5"><path d="M78 126l-6 74M100 130v70M122 126l6 74"/></g><path d="M64 124c6-46 66-46 72 0" fill="none" stroke="${c.b}" stroke-width="6" stroke-linecap="round"/>`;
const necklace = (c) => `<ellipse cx="100" cy="196" rx="58" ry="10" fill="#000" opacity=".12"/><path d="M38 70c6 70 30 102 62 102s56-32 62-102" fill="none" stroke="${c.b}" stroke-width="3.5" stroke-linecap="round"/><circle cx="100" cy="172" r="15" fill="${c.c}"/><circle cx="96" cy="168" r="5" fill="#fff" opacity=".8"/><circle cx="100" cy="172" r="15" fill="none" stroke="${c.b}" stroke-width="4"/>`;
const wax = (c) => `<ellipse cx="100" cy="206" rx="64" ry="7" fill="#000" opacity=".1"/><rect x="42" y="96" width="116" height="104" rx="12" fill="${c.a}"/><g fill="${c.c}" opacity=".75"><circle cx="70" cy="122" r="12"/><circle cx="130" cy="122" r="12"/><circle cx="100" cy="152" r="12"/><circle cx="70" cy="180" r="12"/><circle cx="130" cy="180" r="12"/></g><g fill="none" stroke="${c.b}" stroke-width="3" opacity=".6"><circle cx="70" cy="122" r="19"/><circle cx="130" cy="122" r="19"/><circle cx="100" cy="152" r="19"/><circle cx="70" cy="180" r="19"/><circle cx="130" cy="180" r="19"/></g>`;
const pick = (p, c) => {
  const t = (p.nom + ' ' + p.slug).toLowerCase();
  if (p.categorie === 'Alimentation' && /huile|sirop|vinaigre/.test(t)) return bottle(c);
  if (p.categorie === 'Alimentation' && /th[eé]/.test(t)) return tin(c);
  if (p.categorie === 'Cadeaux et objets culturels' && /th[eé]/.test(t)) return tin(c);
  if (/\bsac\b/.test(t)) return tote(c);
  if (/panier/.test(t)) return basket(c);
  if (/collier/.test(t)) return necklace(c);
  if (/wax/.test(t)) return wax(c);
  return (SCENES[p.categorie] || SCENES['Décoration'])(c);
};
const art = (p) => {
  const c = palOf(p);
  const scene = pick(p, c);
  return `<svg class="art" style="background:linear-gradient(${c.top},${c.bot})" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><circle cx="160" cy="40" r="70" fill="#fff" opacity=".16"/><g transform="translate(0 14)">${scene}</g></svg>`;
};
/* Photos : si public/assets/photos/<slug>.webp existe, elle remplace l'illustration. */
const hasPhoto = (slug) => existsSync(join(root, 'public', 'assets', 'photos', `${slug}.webp`));
const media = (p, { alt = '', eager = false } = {}) => hasPhoto(p.slug)
  ? `<img class="photo" src="/assets/photos/${p.slug}.webp" alt="${esc(alt)}" width="640" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
  : art(p);
const card = (p, i, h = 3) => `<li class="card prod" data-idx="${i}" data-nom="${esc(norm(p.nom))}" data-cat="${esc(p.categorie)}" data-pays="${esc(p.pays)}" data-cont="${esc(p.continent)}" data-prix="${p.prix}" data-ship="${p.livrable.join(' ')}" data-txt="${esc(norm([p.nom, p.pays, p.continent, p.categorie, p.description].join(' ')))}">
  <div class="pimg">${media(p)}</div>
  <div class="pbody"><p class="small">${esc(p.pays)} · ${esc(p.categorie)}</p><h${h}><a class="stretch" href="/produit/${p.slug}">${esc(p.nom)}</a></h${h}><p class="price">${eur(p.prix)}</p><p class="meta">${esc(p.unite)}</p></div>
</li>`;
const demoNote = '<p class="demo-note"><strong>Démonstration :</strong> produits, vendeurs, prix et frais fictifs. Aucune commande réelle n’est possible.</p>';
const crumbs = (items) => `<nav class="crumbs" aria-label="Fil d’Ariane"><ol>${items.map((c, i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(c[0])}</span></li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`).join('')}</ol></nav>`;
const breadcrumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE + (c[1] || '/') })) });
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

const head = ({ title, desc, noindex, extra = '' }) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} – Revia.</title>
  <meta name="description" content="${esc(desc)}">
  ${noindex ? '<meta name="robots" content="noindex">\n  ' : ''}<meta name="theme-color" content="#2F5D50">
  <link rel="icon" href="/assets/logo-emblem.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  ${extra}
</head>
<body>
  <a class="skip" href="#contenu">Aller au contenu</a>

<!--@header-->
`;
const foot = '\n<!--@footer-->\n</body>\n</html>\n';
const sitemapEntries = []; // {url, indexable}

/* ---------- Catalogue ---------- */
const cats = [...new Set(P.map((p) => p.categorie))].sort((a, b) => a.localeCompare(b, 'fr'));
const continents = ['Afrique', 'Amériques', 'Asie', 'Europe', 'Océanie'];
const originOpts = continents.map((c) => {
  const pays = [...new Set(P.filter((p) => p.continent === c).map((p) => p.pays))].sort((a, b) => a.localeCompare(b, 'fr'));
  return `<optgroup label="${c}"><option value="${c}">${c} (tous les pays)</option>${pays.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}</optgroup>`;
}).join('');
const crumbCat = [['Accueil', '/'], ['Catalogue', '/catalogue']];
write('catalogue.html', head({ title: 'Catalogue', desc: 'Parcourez les produits traditionnels du monde entier : filtrez par catégorie, origine, prix et destination de livraison.', noindex: DEMO, extra: ld(breadcrumbLd(crumbCat)) }) + `
  <main id="contenu" tabindex="-1" class="wrap">
    ${crumbs(crumbCat)}
    <h1>Catalogue</h1>
    ${demoNote}
    <form id="filters" class="filters" hidden>
      <fieldset>
        <legend>Filtrer et trier les produits</legend>
        <div class="filters__grid">
          <div class="field-group"><label for="f-q">Recherche</label><input id="f-q" name="q" type="search" autocomplete="off"></div>
          <div class="field-group"><label for="f-cat">Catégorie</label><select id="f-cat" name="categorie"><option value="">Toutes</option>${cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select></div>
          <div class="field-group"><label for="f-org">Origine</label><select id="f-org" name="origine"><option value="">Toutes</option>${originOpts}</select></div>
          <div class="field-group"><label for="f-prix">Prix maximum (€)</label><input id="f-prix" name="prix" type="number" min="0" step="1" inputmode="numeric"></div>
          <div class="field-group"><label for="f-dest">Livrable vers</label><select id="f-dest" name="destination"><option value="">Toutes destinations</option>${shipping.destinations.map((d) => `<option value="${d.code}">${esc(d.nom)}</option>`).join('')}</select></div>
          <div class="field-group"><label for="f-tri">Trier par</label><select id="f-tri" name="tri"><option value="">Pertinence</option><option value="prix-asc">Prix croissant</option><option value="prix-desc">Prix décroissant</option><option value="nom">Nom (A à Z)</option></select></div>
        </div>
        <p class="btnrow"><button class="btn btn--green" type="submit">Appliquer</button><button class="btn btn--ghost" type="reset">Réinitialiser</button></p>
      </fieldset>
    </form>
    <p id="noscript-filters" class="help">Le filtrage nécessite JavaScript : tous les produits sont affichés ci-dessous.</p>
    <p id="count" class="count" role="status"></p>
    <ul id="results" class="grid grid--prod" role="list">
${P.map((p, i) => card(p, i, 2)).join('\n')}
    </ul>
    <p id="empty" hidden>Aucun produit ne correspond à votre recherche. Essayez moins de filtres ou <a href="/catalogue">réinitialisez la recherche</a>. Vous pouvez aussi <a href="/contact">nous suggérer un produit</a>.</p>
  </main>
` + foot);
sitemapEntries.push({ url: '/catalogue', indexable: !DEMO, title: 'Catalogue' });

/* ---------- Fiches produit ---------- */
P.forEach((p) => {
  const dests = shipping.destinations;
  const ok = dests.filter((d) => p.livrable.includes(d.code)), ko = dests.filter((d) => !p.livrable.includes(d.code));
  const similar = P.filter((x) => x.slug !== p.slug && (x.continent === p.continent || x.categorie === p.categorie)).slice(0, 3);
  const items = [['Accueil', '/'], ['Catalogue', '/catalogue'], [p.nom, `/produit/${p.slug}`]];
  const jsonld = [breadcrumbLd(items)];
  if (!DEMO) jsonld.push({ '@context': 'https://schema.org', '@type': 'Product', name: p.nom, description: p.description, offers: { '@type': 'Offer', priceCurrency: 'EUR', price: (p.prix / 100).toFixed(2), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } });
  write(`produit/${p.slug}.html`, head({ title: p.nom, desc: `${p.nom} – ${p.pays}. ${p.description}`, noindex: DEMO, extra: jsonld.map(ld).join('\n  ') }) + `
  <main id="contenu" tabindex="-1" class="wrap">
    ${crumbs(items)}
    ${demoNote}
    <div class="pdp">
      <div class="pdp__img">${media(p, { alt: `${p.nom}, ${p.pays}`, eager: true })}</div>
      <div class="pdp__info">
        <p class="small">${esc(p.pays)} · ${esc(p.continent)} · ${esc(p.categorie)}</p>
        <h1>${esc(p.nom)}</h1>
        <p class="price price--lg">${eur(p.prix)} <span class="meta">TTC · ${esc(p.unite)}</span></p>
        <p>${esc(p.description)}</p>
        <p>${p.stock > 5 ? `En stock (${p.stock} disponibles)` : `Stock limité : ${p.stock} disponibles`}</p>
        <form id="add-form" data-slug="${p.slug}" data-stock="${p.stock}" data-nom="${esc(p.nom)}" data-cart-href="/panier" novalidate>
          <div class="field-group qty"><label for="qty">Quantité</label><input id="qty" name="qty" type="number" min="1" max="${p.stock}" value="1" inputmode="numeric"></div>
          <button class="btn btn--terra" type="submit">Ajouter au panier</button>
          <p id="add-status" class="msg" role="status"></p>
        </form>
        <noscript><p class="err">JavaScript est nécessaire pour utiliser le panier de démonstration.</p></noscript>
      </div>
    </div>

    <section aria-labelledby="h-histoire"><h2 id="h-histoire">Histoire et savoir-faire</h2><p>${esc(p.histoire)}</p></section>
    <section aria-labelledby="h-car"><h2 id="h-car">Caractéristiques</h2><dl class="specs"><dt>Origine</dt><dd>${esc(p.pays)}</dd>${p.details.map((d) => `<dt>${esc(d.label)}</dt><dd>${esc(d.valeur)}</dd>`).join('')}</dl></section>
    <section aria-labelledby="h-vend"><h2 id="h-vend">Vendeur</h2><p><strong>${esc(p.vendeur.nom)}</strong> – ${esc(p.vendeur.lieu)}.</p><p class="help">Vendeur fictif de démonstration. Sur le site réel, cette rubrique présentera l’identité du vendeur et les éléments de vérification disponibles.</p></section>
    <section aria-labelledby="h-liv"><h2 id="h-liv">Livraison</h2>
      <div class="tablewrap"><table class="carttable"><caption>Frais et délais estimés par destination (démonstration)</caption><thead><tr><th scope="col">Destination</th><th scope="col">Frais</th><th scope="col">Délai estimé</th></tr></thead><tbody>${ok.map((d) => `<tr><th scope="row">${esc(d.nom)}</th><td>${eur(d.prix)}</td><td>${esc(d.delai)}</td></tr>`).join('')}</tbody></table></div>
      ${ko.length ? `<p>Non livrable vers : ${ko.map((d) => esc(d.nom)).join(', ')}.</p>` : '<p>Livrable vers toutes les destinations proposées.</p>'}
    </section>
    <section aria-labelledby="h-ret"><h2 id="h-ret">Retours</h2><p>Retour possible sous 14 jours, hors exceptions légales. Voir <a href="/retours-livraison">Retours et livraison</a>.</p></section>
    <section aria-labelledby="h-reg"><h2 id="h-reg">Informations réglementaires</h2><p>${esc(p.reglementaire)}</p></section>
    <section aria-labelledby="h-sim"><h2 id="h-sim">Autres produits à découvrir</h2><ul class="grid grid--prod" role="list">${similar.map((x) => card(x, 0)).join('')}</ul></section>
  </main>
` + foot);
  sitemapEntries.push({ url: `/produit/${p.slug}`, indexable: !DEMO, title: p.nom, group: 'Produits' });
});

/* ---------- Panier ---------- */
const catalogueJson = JSON.stringify({ produits: P.map((p) => ({ slug: p.slug, nom: p.nom, prix: p.prix, stock: p.stock, livrable: p.livrable, vendeur: p.vendeur.nom })), destinations: shipping.destinations }).replace(/</g, '\\u003c');
write('panier.html', head({ title: 'Panier', desc: 'Votre panier de démonstration : détail du prix, des frais et des délais de livraison.', noindex: true }) + `
  <main id="contenu" tabindex="-1" class="wrap">
    ${crumbs([['Accueil', '/'], ['Panier', '/panier']])}
    <h1 id="cart-title" tabindex="-1">Panier</h1>
    ${demoNote}
    <p id="cart-status" class="msg" role="status"></p>
    <div id="cart-root"><noscript><p class="err">JavaScript est nécessaire pour utiliser le panier de démonstration.</p></noscript></div>
    <template id="tpl-link"><a href="/produit/__SLUG__"></a></template>
    <template id="tpl-cat"><a href="/catalogue"></a></template>
    <script type="application/json" id="catalogue-data">${catalogueJson}</script>
  </main>
` + foot);
sitemapEntries.push({ url: '/panier', indexable: false, title: 'Panier' });

/* ---------- Pages de contenu ---------- */
for (const pg of pages) {
  write(`${pg.slug}.html`, head({ title: pg.title, desc: pg.desc }) + `
  <main id="contenu" tabindex="-1" class="prose">${pg.body}
  </main>
` + foot);
  sitemapEntries.push({ url: '/' + pg.slug, indexable: true, title: pg.title });
}

/* ---------- Pages statiques de public/ et plan du site ---------- */
const publicHtml = readdirSync(join(root, 'public')).filter((f) => f.endsWith('.html'));
const titleOf = (f) => (readFileSync(join(root, 'public', f), 'utf8').match(/<title>([^<]*?)(?: – Revia\.)?<\/title>/) || [])[1] || f;
for (const f of publicHtml) {
  const url = f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, '');
  if (!sitemapEntries.some((e) => e.url === url)) sitemapEntries.push({ url, indexable: true, title: f === 'index.html' ? 'Accueil' : titleOf(f) });
}
const list = (arr) => `<ul>${arr.map((e) => `<li><a href="${e.url}">${esc(e.title)}</a></li>`).join('')}</ul>`;
const main = sitemapEntries.filter((e) => !e.group && e.url !== '/panier');
write('plan-du-site.html', head({ title: 'Plan du site', desc: 'Toutes les pages du site Revia.' }) + `
  <main id="contenu" tabindex="-1" class="prose">
    <h1>Plan du site</h1>
    <h2>Pages</h2>${list(main.sort((a, b) => (a.url === '/') ? -1 : (b.url === '/') ? 1 : a.title.localeCompare(b.title, 'fr')))}
    <h2>Produits de démonstration</h2>${list(sitemapEntries.filter((e) => e.group === 'Produits'))}
    <h2>Panier</h2><ul><li><a href="/panier">Panier</a></li></ul>
  </main>
` + foot);
sitemapEntries.push({ url: '/plan-du-site', indexable: true, title: 'Plan du site' });

/* ---------- Accueil : sélection et données structurées ---------- */
const mosaicSlugs = ['tissu-wax-6-yards', 'assiette-ceramique-peinte', 'bijou-argent-mexique', 'the-vert-sencha'];
const mosaic = `<ul class="mosaic" role="list">${mosaicSlugs.map((s) => PBY[s]).filter(Boolean).map((p) => `<li class="tile" style="--c:${palOf(p).top}">${media(p)}<span class="tag"><b>${esc(p.categorie.split(' ')[0])}</b> ${esc(p.continent)}</span></li>`).join('')}</ul>`;
const selection = ['tissu-wax-6-yards', 'the-vert-sencha', 'huile-olive-vierge-extra', 'sirop-erable-canada']
  .map((s) => P.find((p) => p.slug === s)).filter(Boolean);
const homeLd = [
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'Revia', slogan: 'Vos origines, toujours à portée de main.', url: SITE + '/', logo: SITE + '/assets/logo-emblem.svg' },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Revia', url: SITE + '/', inLanguage: 'fr', potentialAction: { '@type': 'SearchAction', target: SITE + '/catalogue?q={search_term_string}', 'query-input': 'required name=search_term_string' } }
];

/* ---------- config.js ---------- */
const url = (process.env.SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_ANON_KEY || '').trim();
if (/service_role/i.test(key)) { console.error('ERREUR : ne mettez jamais la clé service_role dans le site. Utilisez la clé « anon / public ».'); process.exit(1); }
if (!url || !key) console.warn('Avertissement : SUPABASE_URL ou SUPABASE_ANON_KEY manquant. Le site se construit, mais le formulaire de liste d’attente sera désactivé.');
write('config.js', 'window.REVIA_CONFIG = ' + JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key }) + ';\n');

/* ---------- robots.txt et sitemap.xml ---------- */
const today = new Date().toISOString().slice(0, 10);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /panier\n\nSitemap: ${SITE}/sitemap.xml\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.filter((e) => e.indexable).map((e) => `  <url><loc>${SITE}${e.url === '/' ? '/' : e.url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);

/* ---------- Post-traitement de toutes les pages ---------- */
const header = readFileSync(join(root, 'partials/header.html'), 'utf8');
const footer = readFileSync(join(root, 'partials/footer.html'), 'utf8');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const relUrl = (u, depth) => {
  const prefix = '../'.repeat(depth);
  const [pathQ, hash] = u.split('#');
  const [p0, q] = pathQ.split('?');
  let p = p0;
  if (p === '/') p = 'index.html';
  else { p = p.slice(1); if (!/\.[a-z0-9]+$/i.test(p)) p += '.html'; }
  return prefix + p + (q ? '?' + q : '') + (hash !== undefined ? '#' + hash : '');
};

const ASSET_V = Object.fromEntries(['styles.css', 'main.js', 'shop.js', 'config.js'].map((f) => [f, createHash('md5').update(readFileSync(join(out, f))).digest('hex').slice(0, 8)]));
const files = walk(out).filter((f) => f.endsWith('.html'));
for (const f of files) {
  const rel = relPath(out, f).split('\\').join('/');
  const depth = rel.split('/').length - 1;
  const pageUrl = rel === 'index.html' ? '/' : '/' + rel.replace(/\.html$/, '');
  let html = readFileSync(f, 'utf8').replace('<!--@header-->', header).replace('<!--@footer-->', footer);
  if (rel === 'index.html') html = html.replace('<!--@mosaic-->', mosaic).replace('<!--@jsonld-->', JSON.stringify(homeLd).replace(/</g, '\\u003c'))
    .replace('<!--@selection-->', `    <section class="section" id="selection" aria-labelledby="t-sel">
      <div class="section__head"><p class="eyebrow">Sélection</p><h2 id="t-sel">À découvrir</h2><p class="sub">Quatre produits de démonstration, pour montrer ce que contiendront les fiches : origine, vendeur, prix et livraison.</p></div>
      <ul class="grid grid--prod" role="list">${selection.map((p, i) => card(p, i, 3)).join('')}</ul>
      <p><a class="btn btn--green" href="/catalogue">Voir tout le catalogue</a></p>
    </section>`);
  if (!/<script src="\/shop\.js"/.test(html)) html = html.replace('</head>', '  <script src="/shop.js" defer></script>\n</head>');
  html = html.replace(/(href|src)="(\/(?:styles\.css|main\.js|shop\.js|config\.js))"/g, (m, a, u) => `${a}="${u}?v=${ASSET_V[u.slice(1)]}"`);
  if (!/name="robots" content="noindex"/.test(html) && !/rel="canonical"/.test(html)) html = html.replace('</head>', `  <link rel="canonical" href="${SITE}${pageUrl}">\n</head>`);
  // lien courant dans la navigation
  html = html.replace(new RegExp(`(<a href="${pageUrl.replace(/[/.]/g, '\\$&')}")(>)`, 'g'), (m, a, b, off) => off > html.indexOf('class="nav__links"') && off < html.indexOf('</header>') ? `${a} aria-current="page"${b}` : m);
  if (relative) {
    html = html.replace(/(href|src|action)="(\/(?!\/)[^"]*)"/g, (m, attr, u) => `${attr}="${relUrl(u, depth)}"`);
  }
  writeFileSync(f, html);
}

/* ---------- Poids des pages (page Écoconception) ---------- */
const size = (f) => statSync(join(out, f)).size;
const BUDGET_KB = 300;
const photosOf = (f) => [...new Set((readFileSync(join(out, f), 'utf8').match(/assets\/photos\/[\w.-]+\.webp/g) || []))];
const homeFiles = ['index.html', 'styles.css', 'main.js', 'shop.js', 'config.js', 'assets/logo-emblem.svg', ...photosOf('index.html')];
const homeKb = Math.round(homeFiles.reduce((n, f) => n + size(f), 0) / 1024);
const shared = ['styles.css', 'shop.js', 'assets/logo-emblem.svg'].reduce((n, f) => n + size(f), 0);
const pageKb = (f) => Math.round((size(f) + shared + photosOf(f).reduce((n, x) => n + size(x), 0)) / 1024);
const nPhotos = existsSync(join(out, 'assets', 'photos')) ? readdirSync(join(out, 'assets', 'photos')).filter((x) => x.endsWith('.webp')).length : 0;
const eco = join(out, 'ecoconception.html');
writeFileSync(eco, readFileSync(eco, 'utf8')
  .replace('<!--@weight-->', String(homeKb)).replace('<!--@requests-->', String(homeFiles.length))
  .replace('<!--@w-catalogue-->', String(pageKb('catalogue.html'))).replace('<!--@w-produit-->', String(pageKb('produit/miel-de-manuka.html'))));
console.log(`Build terminé → ${relPath(root, out)}/ | accueil ${homeKb} Ko (${homeFiles.length} requêtes), catalogue ${pageKb('catalogue.html')} Ko, produit ${pageKb('produit/miel-de-manuka.html')} Ko, panier ${pageKb('panier.html')} Ko | photos : ${nPhotos}/${P.length}`);
const budget = { 'index.html': [homeKb, BUDGET_KB], 'catalogue.html': [pageKb('catalogue.html'), BUDGET_KB], 'produit/miel-de-manuka.html': [pageKb('produit/miel-de-manuka.html'), BUDGET_KB] };
for (const [k, [v, max]] of Object.entries(budget)) if (v > max) { console.error(`Budget dépassé : ${k} = ${v} Ko (max ${max} Ko)`); process.exitCode = 1; }
