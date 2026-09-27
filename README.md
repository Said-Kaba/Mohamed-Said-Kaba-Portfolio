# Portfolio : Mohamed Said Kaba

Site statique (HTML/CSS/JS, sans build) bilingue FR/EN. Tout le contenu est dans `content/*.js`, le code n'a pas besoin d'être touché pour mettre le site à jour.

## Aperçu en local

Double-cliquer sur `index.html` suffit (aucun serveur nécessaire).

## Mettre à jour le contenu

Chaque texte est un objet bilingue `{ "fr": "...", "en": "..." }`.

| Je veux... | Fichier |
|---|---|
| Ajouter une réalisation / un projet | `content/projects.js` → copier un bloc dans `items` |
| Ajouter un outil ou une démo | `content/tools.js` → nouveau bloc dans `items` ; démo : `"media": { "type": "image" ou "video", "src": "assets/media/xxx.gif" }` |
| Modifier profil, chiffres clés, parcours | `content/profile.js` |
| Compétences, formations, certifications | `content/skills.js`, `content/education.js` |
| Coordonnées, libellés, ordre des sections | `content/site.js` |
| Activer la section Vidéos / YouTube (phase 2) | `content/videos.js` → `"enabled": true` et retirer `"enabled": false` de la section `videos` dans `content/site.js` |
| Afficher le bouton CV | déposer les PDF dans `cv/` (voir `cv/README.md`) |

Les images et démos vont dans `assets/media/` (à créer).

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/pages.yml` publie le site à chaque push sur `main`.
À faire une seule fois : dépôt GitHub → Settings → Pages → Source : **GitHub Actions**.
Adresse : https://said-kaba.github.io/Mohamed-Said-Kaba-Portfolio/

## Règle de rédaction

Ne rien affirmer sans fait concret (chiffre, projet, outil nommé). Dates réelles : JESA août 2024 - juillet 2026, Cap Ingénierie depuis septembre 2026.
