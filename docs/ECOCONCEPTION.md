# Écoconception (RGESN)

Objectif : une page d'accueil légère, durable, utilisable sur un appareil ancien et une connexion lente.

## Mesures (page d'accueil)

| Indicateur | Valeur |
|---|---|
| Requêtes | 6 (HTML, CSS, 2 scripts, config, logo) |
| Poids avant compression | environ 53 Ko (catalogue 56 Ko, fiche produit 40 Ko) |
| Ressources tierces | 0 |
| Polices chargées | 0 (polices système) |
| Cookies / traceurs | 0 |

Valeurs recalculées à chaque build : `npm run build` affiche le poids et met à jour la page publique `/ecoconception`.

## Choix

- Polices système (Georgia et sans-serif du système) à la place de Playfair Display / DM Sans : aucune police à télécharger.
- Catalogue, filtres et panier sans aucune requête réseau supplémentaire : tout est calculé dans la page.
- Images de démonstration en SVG inline (aucun fichier à télécharger).
- Bibliothèque Supabase supprimée : le formulaire appelle directement l'API REST avec `fetch` (environ 1,5 Ko de JavaScript au lieu de plus de 100 Ko).
- Pas de framework, pas d'image bitmap, pas de vidéo, pas de lecture automatique, pas de carrousel.
- Contenu lisible sans JavaScript ; le script ne sert qu'au formulaire.
- Mise en cache longue des assets, cache d'un jour pour CSS et JS ; compression par Vercel (Brotli/gzip).
- Aucun outil de mesure d'audience.

## Budget à respecter

Le build échoue si une page dépasse son budget (HTML, CSS, JS et logo, hors photos).

| Page | Poids maximal (non compressé) |
|---|---|
| Accueil, catalogue, fiche produit (photos affichées comprises) | 300 Ko |
| Photographies produit (futur) | à fixer après mesure : AVIF/WebP, dimensions adaptées, `loading="lazy"` |

## Pour le catalogue (futur)

- Images AVIF ou WebP, dimensions réelles, `loading="lazy"`, `width` et `height` renseignés.
- Pagination plutôt que défilement infini.
- Pas de script tiers sans justification écrite.
- Choisir une région d'hébergement (Vercel, Supabase) à faible intensité carbone quand c'est possible.
- Mesurer avant chaque mise en production (Ecoindex, ou le build).
