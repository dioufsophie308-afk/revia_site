# Supabase

## Mise en place

1. Sur [supabase.com](https://supabase.com), **New project** (région proche de vos utilisateurs, par exemple Paris).
2. **SQL Editor → New query** : collez le contenu de `supabase/schema.sql`, puis **Run**.
3. **Project Settings → API** : notez l'**URL du projet** et la clé **anon / public**.

## Table `waitlist`

| Colonne | Type | Remarque |
|---|---|---|
| id | uuid | clé primaire générée |
| email | text | format vérifié, unique sans tenir compte de la casse |
| role | text | `client` ou `vendeur` |
| origin_country | text | facultatif, 80 caractères maximum |
| consent | boolean | doit être `true` |
| source | text | endroit d'inscription (`home`) |
| created_at | timestamptz | date d'inscription |

## Sécurité

- La clé `anon` est **publique par conception** : elle est visible dans le navigateur. Ce qui protège les données, ce sont les règles **RLS**.
- Le rôle `anon` a **uniquement le droit d'insérer** : il ne peut ni lire, ni modifier, ni supprimer. Les e-mails ne sont donc pas accessibles depuis le site.
- **Ne mettez jamais la clé `service_role`** dans le site ni dans Vercel côté navigateur : elle contourne la RLS. `build.mjs` refuse de construire si la clé contient ce mot.

## Consulter et exporter les inscrits

**Table Editor → waitlist**, puis **Export** (CSV).

## RGPD

Le formulaire demande un consentement explicite. Prévoyez : une page de confidentialité, une adresse de contact pour les demandes de suppression, et la suppression des lignes concernées depuis le Table Editor.
