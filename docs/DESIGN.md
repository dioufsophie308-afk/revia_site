# Design

Maquette Figma : <https://www.figma.com/design/DlY665Zsddgcu7nzNrMLXJ> (page « Home – Desktop 1440 »).

## Couleurs

| Nom | Hex | Usage |
|---|---|---|
| Crème | `#F6EFE6` | fond |
| Blanc | `#FFFFFF` | cartes |
| Vert | `#2F5D50` | actions principales, bandeau vendeurs |
| Vert profond | `#1F3D34` | annonce, pied de page |
| Terracotta | `#BF5A33` | pastilles décoratives |
| Terracotta foncé | `#A0441D` | texte et boutons (contraste ≥ 5:1) |
| Rose | `#B0506A` | accents |
| Moutarde | `#E3B565` | titres du pied de page |
| Encre | `#2B2622` | texte |
| Taupe | `#6B6058` | texte secondaire |
| Sable | `#E6DCCF` | fonds secondaires |

Ces couleurs sont les variables CSS de `public/styles.css` (`:root`) et la collection de variables « Revia / Couleurs » dans Figma.

## Typographies

La maquette Figma utilise Playfair Display et DM Sans. **Le site utilise des polices système** (voir [ECOCONCEPTION.md](ECOCONCEPTION.md)) : Georgia pour les titres, la police du système pour le texte. Si l'identité visuelle l'exige plus tard, héberger un sous-ensemble WOFF2 de polices sur le site, sans service externe.

## Sections de la home page

1. Barre d'annonce
2. Navigation
3. Hero : titre, recherche, populaires, visuel globe
4. Bande de confiance
5. Catégories
6. Cinq continents
7. Comment ça marche
8. Appel aux vendeurs
9. Liste d'attente
10. Pied de page

## Logo

Emblème : globe blanc sur disque vert avec point terracotta. Fichier : `public/assets/logo-emblem.svg`. Remplacez-le par le logo officiel quand il existe (même nom de fichier).

## Responsive

Écart avec la maquette : la barre de recherche (non fonctionnelle) est remplacée par deux boutons, et « Se connecter » est retiré tant que les comptes n'existent pas. Points de rupture : 1100, 860, 560 et 420 px. La maquette Figma couvre le bureau (1440 px) ; le mobile est géré en CSS.
