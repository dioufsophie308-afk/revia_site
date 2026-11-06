# SEO

## En place

- `<title>`, description et un seul `h1` par page, uniques.
- URLs descriptives : `/catalogue`, `/produit/miel-de-manuka`, `/a-propos`.
- Balise `canonical` sur les pages indexables, `sitemap.xml` et `robots.txt` générés au build.
- Données structurées : `Organization` et `WebSite` (recherche) sur l'accueil, `BreadcrumbList` sur le catalogue et les fiches produit.
- Fil d'Ariane visible, maillage interne (catégories, continents, produits similaires), plan du site.
- Aucune image bitmap : pas de poids inutile ; futurs `alt` descriptifs pour les photos informatives.

## Contenu de démonstration

Les produits et vendeurs sont fictifs. Tant que `demo` vaut `true` dans `data/products.json` :

- le catalogue et les fiches produit portent `noindex` et sont absents du sitemap ;
- les données structurées `Product` ne sont pas émises ;
- le panier est toujours en `noindex` et interdit dans `robots.txt`.

Au passage en production : mettre `demo` à `false` avec des produits réels, définir `SITE_URL` (domaine réel) sur Vercel et soumettre le sitemap à la Search Console.

## À faire

- Recherche de mots-clés par langue, pays et catégorie, à valider avec des données de recherche réelles.
- Contenus originaux sur les traditions, matériaux et usages, sans stéréotypes ni allégations non vérifiées.
- Suivi des impressions, clics, indexation, Core Web Vitals et conversions avec des outils respectant le cadre de consentement.
