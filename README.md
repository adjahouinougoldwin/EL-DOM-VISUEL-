# EL DOM VISUEL — Site officiel

Site vitrine **one-page** du studio de création visuelle **EL DOM VISUEL** :
miniatures, photographie, vidéo, montage et identité de marque.

> Votre image. **Notre signature.**

## Aperçu

| | |
|---|---|
| **Type** | Site statique — HTML, CSS, JavaScript, aucune dépendance, aucune compilation |
| **Langue** | Français |
| **Thème** | Sombre, accents dorés |
| **Responsive** | Oui — mobile, tablette, ordinateur |
| **Poids** | ~1,8 Mo, dont ~1,7 Mo d'images |

## Structure des fichiers

```
.
├── index.html                 # Page unique (toutes les sections)
├── favicon.svg                # Icône du site
├── robots.txt                 # Indexation par les moteurs de recherche
├── sitemap.xml                # Plan du site
└── assets/
    ├── css/
    │   └── style.css          # Feuille de style unique et commentée
    ├── js/
    │   └── main.js            # Interactions, commentées, sans dépendance
    └── img/
        ├── logo.svg           # Logo (objectif + lecture, doré)
        ├── hero.jpg           # Accueil
        ├── miniature.jpg      # Réalisation — miniature gaming
        ├── podcast.jpg        # Réalisation — miniature podcast
        ├── portrait.jpg       # Réalisation — portrait studio
        ├── clip.jpg           # Réalisation — tournage de clip
        ├── mariage.jpg        # Réalisation — mariage
        ├── montage.jpg        # Réalisation — post-production
        ├── branding.jpg       # Réalisation — identité de marque
        ├── evenement.jpg      # Réalisation — conférence
        └── about.jpg          # Section « À propos »
```

## Sections de la page

1. **Accueil** — titre, accroche, boutons d'action, quatre chiffres clés animés
2. **Bandeau défilant** — les spécialités du studio
3. **Services** — six prestations détaillées
4. **Réalisations** — galerie filtrable par catégorie, avec visionneuse plein écran
5. **Méthode** — les quatre étapes d'un projet
6. **À propos** — présentation du studio et points forts
7. **Témoignages** — carrousel automatique (mise en pause au survol)
8. **Tarifs** — trois formules : Essentiel, Studio, Signature
9. **FAQ** — cinq questions en accordéon
10. **Contact** — coordonnées et formulaire qui prépare un message WhatsApp

## ✏️ À personnaliser avant la mise en ligne

### 1. Le numéro WhatsApp et l'e-mail — `assets/js/main.js`

En haut du fichier, dans `CONFIG` :

```js
var CONFIG = {
  numeroWhatsApp: '22900000000',            // ← votre numéro, format international
  emailContact: 'contact@eldomvisuel.com',
  delaiTemoins: 7000
};
```

Le numéro s'écrit **sans** `+`, sans espace et sans tiret. Exemple : `22997123456`.
Ce numéro alimente le bouton flottant WhatsApp et le formulaire de contact.

### 2. Les coordonnées affichées — `index.html`

Recherchez `22900000000` et `contact@eldomvisuel.com` : ils apparaissent dans la
section **Contact**, dans le pied de page et dans les données structurées (JSON-LD).
La ville est indiquée juste en dessous :

```html
<p>Abomey-Calavi, Bénin — interventions sur site</p>
```

Les liens de réseaux sociaux se trouvent sous `<div class="contact__reseaux">` :
remplacez les `href="#"` par vos vraies adresses (Facebook, Instagram, TikTok, YouTube).

### 3. Le domaine — `index.html`, `robots.txt`, `sitemap.xml`

Remplacez `https://eldomvisuel.com` par votre adresse réelle (balises `canonical`,
Open Graph, JSON-LD et sitemap).

### 4. Le contenu

- **Chiffres clés** — attributs `data-compteur="180"`, `45`, `48`, `98` dans la section Accueil
- **Tarifs** — section `#tarifs` (`25 000` et `85 000` FCFA)
- **Témoignages** — à remplacer par de vrais retours clients (section `#temoignages`)
- **Images** — remplacez les fichiers de `assets/img/` en gardant les mêmes noms, ou
  modifiez les chemins dans `index.html`. Format conseillé : JPEG ou WebP, 1600 px de
  large, moins de 300 Ko.

## Lancer le site en local

Aucune installation n'est nécessaire :

```bash
# Option 1 — Python
python3 -m http.server 8000

# Option 2 — Node.js
npx serve .
```

Puis ouvrez <http://localhost:8000>.

## Mettre le site en ligne (gratuit)

### GitHub Pages

1. Le contenu du dépôt doit être sur la branche `main`.
2. Sur GitHub : **Settings → Pages**.
3. *Source* : `Deploy from a branch` — *Branch* : `main` — dossier `/ (root)`.
4. Enregistrez. Le site est publié à l'adresse
   `https://adjahouinougoldwin.github.io/EL-DOM-VISUEL-/` en une minute environ.

### Netlify / Vercel

Glissez-déposez le dossier du projet sur <https://app.netlify.com/drop>, ou connectez
le dépôt GitHub : aucune commande de compilation n'est requise, le dossier à publier
est la racine (`.`).

## Fonctionnalités techniques

- En-tête collant avec lien actif suivi au défilement (*scrollspy*) et barre de progression
- Menu plein écran sur mobile : fermeture par `Échap`, par un lien ou au redimensionnement
- Apparition progressive des blocs au défilement et compteurs animés (une seule fois)
- Galerie filtrable par catégorie, animée à chaque changement de filtre
- Visionneuse plein écran : flèches du clavier, balayage tactile, `Échap`, clic sur le fond
- Formulaire validé côté client (messages d'erreur par champ) puis envoi vers WhatsApp
- Respect de `prefers-reduced-motion` : animations neutralisées si l'utilisateur le demande
- Feuille d'impression : FAQ dépliée, éléments flottants masqués
- Balisage sémantique, attributs `aria-*`, lien d'évitement, focus toujours visible
- SEO : titre, description, Open Graph, données structurées schema.org
- Aucun script ni feuille de style externe, hormis les polices Google Fonts
  (repli sur les polices système si elles sont indisponibles)

## Compatibilité

Chrome, Edge, Firefox et Safari récents, sur ordinateur comme sur mobile.
Les fonctions modernes utilisées (`mask-image`, `grid-template-rows` animé, `svh`)
sont décoratives ou disposent d'un comportement de repli acceptable.

## Licence

Tous droits réservés © EL DOM VISUEL.
