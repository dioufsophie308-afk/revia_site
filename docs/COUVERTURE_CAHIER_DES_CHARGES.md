# Couverture du cahier des charges

Rapport entre le cahier des charges « Revia, marketplace internationale » et ce dépôt. Ce site est une **démonstration front-end** : il n'a ni comptes, ni paiement, ni expédition, ni gestion réelle des vendeurs.

| Exigence (section) | État | Détail |
|---|---|---|
| Accueil : proposition de valeur, régions, catégories, sélection, accès vendeur (6) | Fait | Page d'accueil, liens vers le catalogue filtré |
| Catalogue : recherche, filtres catégorie/origine/prix/destination, tri (6) | Fait | Données de démonstration (19 produits) |
| Fiche produit : origine, vendeur, prix, stock, frais et délais, retours, réglementaire (6) | Fait | Vendeurs et valeurs fictifs |
| Panier et commande : prix détaillé, frais et délais avant confirmation (6) | Partiel | Panier simulé ; pas de paiement |
| Compte acheteur (6) | Non fait | MVP technique |
| Espace vendeur (6) | Non fait | Page d'information et liste d'attente vendeurs |
| Pages de confiance : à propos, FAQ, contact, confidentialité, cookies, CGV/CGU, retours (6) | Fait (gabarits) | CGV, mentions et confidentialité à compléter et à faire valider |
| SEO : titres, descriptions, URLs, sitemap, robots, données structurées (7) | Fait | Voir [SEO.md](SEO.md) |
| Accessibilité WCAG 2.1 AA / RGAA 4.1.2 (8) | Conçu, non audité | Voir [ACCESSIBILITE.md](ACCESSIBILITE.md) |
| Éco-conception (9) | Fait | Voir [ECOCONCEPTION.md](ECOCONCEPTION.md) |
| RGPD, consentement, droits (10) | Partiel | Aucun traceur ; formulaire avec consentement ; durée de conservation et contact à renseigner |
| Sécurité (10) | Partiel | RLS Supabase, en-têtes HTTP, CSP ; comptes et rôles à venir |
| Validation juridique (10) | À faire | CGV, mentions, règles par catégorie, douane, TVA |
| Modèle économique, feuille de route, indicateurs (11 à 13) | Hors périmètre du site | Aucune hypothèse tarifaire affichée sur le site |
