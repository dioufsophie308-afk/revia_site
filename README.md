# Revia.

> **Vos origines, toujours à portée de main.**

Revia est une marketplace des produits traditionnels du monde entier (alimentation, vêtements, accessoires, cosmétiques, artisanat, décoration, cadeaux culturels), pensée pour les diasporas et les curieux. Ce dépôt contient une **démonstration front-end** : accueil, catalogue avec filtres, fiches produit, panier simulé, pages de confiance et liste d'attente. Produits, vendeurs, prix et frais sont fictifs.

| Brique | Outil | Rôle |
|---|---|---|
| Design | Figma | Maquette de la home page ([voir la maquette](https://www.figma.com/design/DlY665Zsddgcu7nzNrMLXJ)) |
| Code | HTML / CSS / JS | Site statique, sans framework ni dépendance, écoconçu et accessible |
| Base de données | Supabase | Table `waitlist` protégée par RLS |
| Hébergement | Vercel | Déploiement automatique à chaque `git push` |
| Documentation | GitHub | Ce dépôt et le dossier [`docs/`](docs) |

## Démarrage rapide

Prérequis : Node.js 18 ou plus.

```bash
cp .env.example .env     # puis renseignez les deux variables Supabase
export $(grep -v '^#' .env | xargs)
npm run dev              # http://localhost:3000
```

Sans variables Supabase, le site s'affiche normalement et le formulaire indique que l'inscription n'est pas configurée.

Pour obtenir une version HTML à ouvrir directement par double-clic (sans serveur) : `npm run build:html`, puis ouvrir `dist-html/index.html`.

## Structure

```
public/            accueil, pages d'information, styles.css, main.js (liste d'attente), shop.js (catalogue, panier), assets/
data/              produits et frais de livraison de démonstration
scripts/content.mjs  pages de contenu (à propos, FAQ, retours, cookies, CGV…)
partials/          en-tête et pied de page communs
scripts/build.mjs  copie public/ → dist/ et génère config.js depuis l'environnement
scripts/serve.mjs  serveur local
photos-source/     photos d'origine ; `npm run photos` les convertit dans public/assets/photos/
supabase/schema.sql  table waitlist + sécurité RLS
vercel.json        build, en-têtes de sécurité
docs/              architecture, Supabase, déploiement, design
.github/workflows  contrôle automatique (syntaxe + build)
```

## Mise en ligne (résumé)

1. Supabase : créer un projet, exécuter `supabase/schema.sql`.
2. GitHub : pousser ce dépôt.
3. Vercel : importer le dépôt, ajouter `SUPABASE_URL` et `SUPABASE_ANON_KEY`, déployer.

Le pas-à-pas détaillé est dans [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md).

## Avant l'ouverture au public

Compléter les champs surlignés `[à renseigner]` des pages `mentions-legales`, `confidentialite` et `accessibilite`, et faire réaliser un audit RGAA (voir [`docs/ACCESSIBILITE.md`](docs/ACCESSIBILITE.md)).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Supabase et sécurité](docs/SUPABASE.md)
- [Déploiement](docs/DEPLOIEMENT.md)
- [Design et charte](docs/DESIGN.md)
- [Accessibilité RGAA](docs/ACCESSIBILITE.md)
- [Photos des produits](docs/PHOTOS.md)
- [Écoconception](docs/ECOCONCEPTION.md)
- [SEO](docs/SEO.md)
- [Couverture du cahier des charges](docs/COUVERTURE_CAHIER_DES_CHARGES.md)

## Licence

© 2026 Revia. Tous droits réservés.
