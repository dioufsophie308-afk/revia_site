# Architecture

```
Visiteur ──► Vercel (fichiers statiques, dist/)
                │
                └─ main.js ──► Supabase (API REST, table waitlist, RLS)
```

## Choix techniques

- **Site statique sans framework** : rapide, gratuit à héberger, aucune dépendance à maintenir. On passera à Next.js ou Astro quand le catalogue produits arrivera.
- **Pas de serveur à nous** : le navigateur parle directement à Supabase avec la clé publique « anon ». La sécurité repose sur les règles RLS (voir [SUPABASE.md](SUPABASE.md)).
- **Build minimal** (`scripts/build.mjs`) : copie `public/` vers `dist/` et écrit `config.js` avec les variables d'environnement, pour ne rien coder en dur dans le dépôt.
- **Aucune bibliothèque** : `main.js` appelle l'API REST de Supabase avec `fetch` (voir [ECOCONCEPTION.md](ECOCONCEPTION.md)).
- **Pages communes** : `partials/header.html` et `footer.html` sont insérés dans chaque page par le build.

## Pages générées

`scripts/build.mjs` génère, depuis `data/products.json` et `data/shipping.json` : le catalogue (rendu complet, filtré côté navigateur), une fiche par produit (`/produit/<slug>`), le panier, les pages de contenu (`scripts/content.mjs`), le plan du site, `sitemap.xml` et `robots.txt`.

- **Catalogue** : les 19 produits sont dans le HTML ; `shop.js` filtre et trie sans requête réseau. Sans JavaScript, tous les produits restent visibles.
- **Panier** : simulé, stocké dans le navigateur (`localStorage`), calcul du sous-total, des frais et du délai par destination. Aucun paiement.
- **Version double-clic** : `npm run build:html` produit `dist-html/` avec des liens relatifs.

## Flux du formulaire

1. L'utilisateur saisit son e-mail, choisit client ou vendeur, coche le consentement.
2. `main.js` valide le format et l'accord (erreurs liées aux champs), puis envoie un `POST` vers `/rest/v1/waitlist`.
3. Supabase applique la contrainte d'unicité : un doublon renvoie le code `23505` (HTTP 409), affiché comme « déjà inscrit ».

## Évolutions prévues

- Catalogue produits et pays (tables `products`, `sellers`, `countries`).
- Authentification (Supabase Auth) pour comptes clients et vendeurs.
- Paiement et livraison.
