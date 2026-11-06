# Accessibilité (RGAA 4.1.2 / WCAG 2.1 AA)

Référentiel visé : RGAA 4.1.2 (106 critères). Les tests doivent combiner contrôles automatisés et vérifications manuelles.

## Statut honnête

Le site est **conçu** pour viser le niveau AA, mais il n'a **pas été audité** par un auditeur indépendant. La déclaration publique (`public/accessibilite.html`) l'indique : « non évalué ». Une déclaration « conforme » n'est possible qu'après un audit RGAA complet. Les pages légales contiennent des champs `[à renseigner]` (surlignés) à compléter avant l'ouverture au public.

## Ce qui est en place

| Thème RGAA | Mise en œuvre |
|---|---|
| Structure (9) | repères `header`, `nav`, `main`, `footer` ; un seul `h1` par page ; titres sans saut de niveau ; listes sémantiques |
| Navigation (12) | lien d'évitement ; navigation visible aussi sur mobile ; ordre de tabulation logique ; `<title>` unique par page |
| Couleurs (3) | contraste texte ≥ 4,5:1 (couleur de texte et de boutons `--terra-deep`) ; aucune information par la couleur seule |
| Formulaires (11) | étiquettes visibles, champs obligatoires signalés (`*` et `aria-required`), erreurs textuelles liées par `aria-describedby`, `aria-invalid`, focus renvoyé au premier champ en erreur, message de statut `role="status"`, `autocomplete` adapté |
| Images (1) | images décoratives avec `alt=""` et SVG `aria-hidden` |
| Présentation (10) | tailles en `rem` ; pas de défilement horizontal à 320 px ; focus visible à fort contraste ; `prefers-reduced-motion` ; mode contraste forcé |
| Liens (6) | intitulés explicites, aucun lien mort ; zones de clic ≥ 24 px |
| Tableaux (5) | panier et grille des frais de livraison : `caption`, `th scope="col"` et `scope="row"` |
| Navigation (12) | menu principal, moteur de recherche (`role="search"`), plan du site, fil d'Ariane, lien courant (`aria-current`) |
| Éléments interactifs | FAQ en `details/summary` natifs ; filtres et tri avec étiquettes visibles ; résultats annoncés (`role="status"`) |
| Multimédia / cadres | sans objet (aucune vidéo, son, cadre) |

## Contrôles automatisés réalisés

Script Playwright exécuté sur 17 pages (bureau et mobile) : contraste de chaque texte, ordre des titres, étiquettes des champs, `alt`, identifiants uniques, liens vides ou morts, ancres, repères, taille des cibles, défilement horizontal à 320 px, ordre de tabulation, scénarios du formulaire (erreurs, succès, doublon, erreur réseau).

## À faire avant l'ouverture

1. Audit RGAA complet par un professionnel (grille officielle).
2. Tests réels avec NVDA, VoiceOver, TalkBack, navigation clavier seule, zoom 200 %.
3. Compléter l'adresse de contact et la déclaration d'accessibilité avec le résultat de l'audit.
4. Vérifier avec un juriste l'obligation applicable (RGAA, ou loi européenne sur l'accessibilité des produits et services pour le commerce en ligne).
5. À chaque nouvelle page : rejouer les contrôles ci-dessus.

## Règles pour les contributions

- Un bouton fait une action, un lien mène à une page.
- Toute image informative a un `alt` pertinent ; toute image décorative `alt=""`.
- Jamais de `outline: none` sans remplaçant.
- Tester au clavier avant de fusionner.
