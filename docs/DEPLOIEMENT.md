# Déploiement pas à pas

Ordre conseillé : Supabase → GitHub → Vercel.

## 1. Supabase (base de données)

Voir [SUPABASE.md](SUPABASE.md). Vous en sortez avec `SUPABASE_URL` et `SUPABASE_ANON_KEY`.

## 2. GitHub (code et documentation)

1. Créez un dépôt vide sur github.com (par exemple `revia-site`), sans README.
2. Dans le dossier du projet :

```bash
git init
git add .
git commit -m "Home page Revia"
git branch -M main
git remote add origin https://github.com/<votre-compte>/revia-site.git
git push -u origin main
```

Le fichier `.env` est ignoré par `.gitignore` : vos clés ne partent pas sur GitHub.

## 3. Vercel (hébergement)

1. Sur vercel.com, **Add New → Project**, puis **Import** du dépôt GitHub.
2. Framework : **Other**. Les réglages (`buildCommand`, `outputDirectory`) viennent de `vercel.json`.
3. **Environment Variables** : ajoutez `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SITE_URL` (adresse publique du site) (Production, Preview, Development).
4. **Deploy**. Chaque `git push` sur `main` redéploie le site automatiquement.

## 4. Domaine personnalisé (facultatif)

Vercel → Project → **Settings → Domains** : ajoutez votre domaine et suivez les enregistrements DNS indiqués.

## 5. Vérification

- Ouvrir le site, remplir le formulaire avec un e-mail de test.
- Supabase → Table Editor → `waitlist` : la ligne doit apparaître.
- Un deuxième envoi du même e-mail doit afficher « Vous êtes déjà sur la liste ».

## Dépannage

| Symptôme | Cause probable |
|---|---|
| « Le service d'inscription n'est pas encore configuré » | Variables absentes sur Vercel : ajoutez-les puis **Redeploy** |
| Erreur à l'envoi | `schema.sql` non exécuté, ou RLS sans politique d'insertion |
| Formulaire bloqué dans la console (CSP) | URL Supabase hors `*.supabase.co` : adaptez `connect-src` dans `vercel.json` |
| Les pages `/accessibilite` etc. donnent une erreur 404 | Vérifiez que `outputDirectory` vaut `dist` et que `cleanUrls` est à `true` |
