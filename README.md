# Portfolio — Mohamed Said Kaba

Site statique (HTML/CSS/JS, sans build) bilingue FR/EN. Tout le contenu est dans `content/*.json`, le code n'a pas besoin d'être touché pour mettre le site à jour.

## Aperçu en local

```
python -m http.server 8000
```
puis ouvrir http://localhost:8000 (le double-clic sur `index.html` ne marche pas : les fichiers JSON sont chargés par le navigateur).

## Mettre à jour le contenu

Chaque texte est un objet bilingue `{ "fr": "...", "en": "..." }`.

| Je veux... | Fichier |
|---|---|
| Ajouter une réalisation / un projet | `content/projects.json` → copier un bloc dans `items` |
| Ajouter un outil ou une démo | `content/tools.json` → nouveau bloc dans `items` ; démo : `"media": { "type": "image" ou "video", "src": "assets/media/xxx.gif" }` |
| Modifier profil, chiffres clés, parcours | `content/profile.json` |
| Compétences, formations, certifications | `content/skills.json`, `content/education.json` |
| Coordonnées, libellés, ordre des sections | `content/site.json` |
| Activer la section Vidéos / YouTube (phase 2) | `content/videos.json` → `"enabled": true` et retirer `"enabled": false` de la section `videos` dans `content/site.json` |
| Afficher le bouton CV | déposer les PDF dans `cv/` (voir `cv/README.md`) |

Les images et démos vont dans `assets/media/` (à créer).

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/pages.yml` publie le site à chaque push sur `main`.
À faire une seule fois : dépôt GitHub → Settings → Pages → Source : **GitHub Actions**.
Adresse : https://said-kaba.github.io/Mohamed-Said-Kaba-Portfolio/

## Règle de rédaction

Ne rien affirmer sans fait concret (chiffre, projet, outil nommé). Dates réelles : JESA août 2024 – juillet 2026, Cap Ingénierie depuis septembre 2026.
