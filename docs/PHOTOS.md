# Photos des produits

Le site est prévu pour des photos façon Pinterest / Instagram : portrait 4:5, coins arrondis, mosaïque à hauteurs variables. **Les photos sont facultatives** : tant qu'un produit n'a pas de photo, son illustration colorée s'affiche. Dès qu'une photo existe, elle la remplace partout (accueil, catalogue, fiche produit).

## Ajouter des photos

1. Déposez les photos (JPG, PNG ou WebP) dans `photos-source/`. Le **nom du fichier est l'identifiant du produit** (liste ci-dessous), par exemple `photos-source/miel-de-manuka.jpg`.
2. Lancez `npm run photos` (Python 3 et Pillow). Chaque photo est recadrée en 4:5, redimensionnée à 640 × 800 px et convertie en WebP, avec un objectif de **60 Ko maximum**. Le résultat est écrit dans `public/assets/photos/`.
3. Lancez `npm run build` : le build affiche le nombre de photos prises en compte (par exemple `photos : 19/19`) et vérifie le budget de poids.
4. Poussez sur GitHub : Vercel redéploie.

## Droits d'auteur

Utilisez uniquement des photos **dont vous avez les droits** : vos propres photos, celles de vos producteurs partenaires (avec leur accord écrit), ou des banques d'images à licence libre (Unsplash, Pexels, Pixabay : relire la licence en vigueur). Ne reprenez pas d'images trouvées sur Pinterest ou Instagram : elles appartiennent à leurs auteurs. Notez l'auteur et la source de chaque image dans `photos-source/CREDITS.md`.

Une photo qui ne montre pas le vrai produit vendu peut induire en erreur l'acheteur : sur un site réel, chaque fiche doit montrer le produit réel du vendeur.

## Accessibilité et poids

- Dans les listes, la photo est décorative (`alt=""`) car le nom du produit est écrit juste à côté. Sur la fiche produit, son texte alternatif est « nom du produit, pays ».
- Les photos sont chargées au fur et à mesure du défilement (`loading="lazy"`), sauf celle de la fiche produit.
- Budget de poids par page : **300 Ko** (styles, scripts et photos affichées compris). Le build échoue au-delà.

## Identifiants des produits

| Identifiant | Produit |
|---|---|
| `melange-epices-ras-el-hanout` | Mélange d’épices ras el hanout (Maroc) |
| `beurre-de-karite-brut` | Beurre de karité brut (Ghana) |
| `tissu-wax-6-yards` | Tissu wax, coupon de 6 yards (Sénégal) |
| `panier-tresse-paille` | Panier tressé en fibres naturelles (Sénégal) |
| `huile-olive-vierge-extra` | Huile d’olive vierge extra (Grèce) |
| `assiette-ceramique-peinte` | Assiette en céramique peinte à la main (Portugal) |
| `echarpe-laine-ecosse` | Écharpe en laine tissée (Royaume-Uni) |
| `the-vert-sencha` | Thé vert sencha (Japon) |
| `foulard-soie-thailande` | Foulard en soie (Thaïlande) |
| `service-the-porcelaine` | Service à thé en porcelaine (Chine) |
| `pate-curry-vert` | Pâte de curry vert (Thaïlande) |
| `coffret-thes-asie` | Coffret cadeau de thés d’Asie (Japon) |
| `sirop-erable-canada` | Sirop d’érable (Canada) |
| `vanille-mexique` | Gousses de vanille (Mexique) |
| `sac-textile-tisse` | Sac en textile tissé (Guatemala) |
| `bijou-argent-mexique` | Bague en argent ciselé (Mexique) |
| `miel-de-manuka` | Miel de manuka (Nouvelle-Zélande) |
| `plaid-laine-merinos` | Plaid en laine mérinos (Nouvelle-Zélande) |
| `collier-perle-tahiti` | Collier avec perle de culture de Tahiti (Polynésie française) |
