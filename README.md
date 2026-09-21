# EL DOM VISUEL — Site officiel

Site vitrine **one-page** du studio de création visuelle EL DOM VISUEL : miniatures,
photographie, vidéo, montage et identité de marque.

## Aperçu

| | |
|---|---|
| **Type** | Site statique (HTML + CSS + JavaScript, aucune dépendance, aucune compilation) |
| **Langue** | Français |
| **Thème** | Sombre, accents dorés |
| **Responsive** | Oui — mobile, tablette, ordinateur |
| **Poids** | ~1,5 Mo (dont ~1,4 Mo d'images) |

## Structure des fichiers

```
.
├── index.html                 # Page unique (toutes les sections)
├── favicon.svg                # Icône du site (diaphragme doré)
├── robots.txt                 # Indexation moteurs de recherche
├── sitemap.xml                # Plan du site
└── assets/
    ├── css/style.css          # Feuille de style complète (commentée)
    ├── js/main.js             # Interactions (commenté)
    └── img/                   # Visuels du site (8 images)
        ├── hero.jpg           # Image d'accueil
        ├── miniature.jpg      # Réalisation — miniatures
        ├── portrait.jpg       # Réalisation — photo & section À propos
        ├── clip.jpg           # Réalisation — clip musical
        ├── mariage.jpg        # Réalisation — mariage
        ├── montage.jpg        # Réalisation — post-production
        ├── branding.jpg       # Réalisation — identité de marque
        └── evenement.jpg      # Réalisation — conférence
```

## Sections de la page

1. **Accueil** — titre principal, boutons d'action, chiffres clés animés
2. **Services** — 6 prestations détaillées
3. **Réalisations** — galerie filtrable avec visionneuse plein écran
4. **Méthode** — les 4 étapes d'un projet
5. **À propos** — présentation du studio et points forts
6. **Témoignages** — carrousel automatique
7. **Tarifs** — 3 formules (Essentiel / Studio / Signature)
8. **FAQ** — 5 questions en accordéon
9. **Contact** — coordonnées + formulaire qui envoie vers WhatsApp

## ✏️ À personnaliser avant la mise en ligne

Trois endroits contiennent des informations provisoires à remplacer :

### 1. Le numéro WhatsApp — `assets/js/main.js`

```js
const CONFIG = {
  numeroWhatsApp: '22900000000',   // ← votre numéro, format international, sans "+"
  emailContact: 'contact@eldomvisuel.com',
  delaiTemoins: 7000
};
```

Format attendu : indicatif pays + numéro, **sans** `+`, espace ni tiret.
Exemple : `22997123456`.

### 2. Les coordonnées affichées — `index.html`

Recherchez `22900000000` et `contact@eldomvisuel.com` (ils apparaissent dans la
section **Contact** et dans le **pied de page**) ainsi que la ville :

```html
<span>Abomey-Calavi, Bénin — interventions sur site</span>
```

Les liens de réseaux sociaux sont juste sous `<div class="contact__reseaux">` :
remplacez `href="#"` par vos vraies URL (Facebook, Instagram, TikTok, YouTube).

### 3. Le domaine — `index.html`, `robots.txt`, `sitemap.xml`

Remplacez `https://eldomvisuel.com` par votre adresse réelle (balises `canonical`,
Open Graph, JSON-LD, sitemap).

### Contenu à ajuster éventuellement

- **Chiffres clés** (`data-compteur="180"` etc.) dans la section Accueil
- **Tarifs** dans la section `#tarifs`
- **Témoignages** — remplacez-les par de vrais retours clients
- **Images** — remplacez les fichiers du dossier `assets/img/` en gardant les mêmes
  noms, ou changez les chemins dans `index.html`. Format conseillé : JPEG ou WebP,
  largeur 1600 px, moins de 300 Ko.

## Lancer le site en local

Aucune installation n'est nécessaire. Deux options :

```bash
# Option 1 — Python (déjà installé sur la plupart des systèmes)
python3 -m http.server 8000

# Option 2 — Node.js
npx serve .
```

Puis ouvrez <http://localhost:8000>.

## Mettre le site en ligne (gratuit)

### GitHub Pages

1. Poussez le contenu de ce dépôt sur la branche `main`.
2. Sur GitHub : **Settings → Pages**.
3. *Source* : `Deploy from a branch` — *Branch* : `main` — dossier `/ (root)`.
4. Enregistrez. Le site sera disponible à
   `https://adjahouinougoldwin.github.io/EL-DOM-VISUEL-/` en une minute environ.

### Netlify / Vercel

Glissez-déposez le dossier du projet sur <https://app.netlify.com/drop>, ou
connectez le dépôt GitHub : aucune commande de build n'est requise,
le dossier de publication est la racine (`.`).

## Fonctionnalités techniques

- Navigation collante avec lien actif suivi au défilement (*scrollspy*)
- Menu plein écran sur mobile, fermeture par `Échap` ou clic sur un lien
- Animations d'apparition au défilement et compteurs animés
- Galerie filtrable par catégorie
- Visionneuse plein écran : flèches du clavier, balayage tactile, `Échap`
- Formulaire de contact qui pré-remplit un message WhatsApp
- Respect de `prefers-reduced-motion` (animations désactivées si l'utilisateur le demande)
- Feuille d'impression pour un rendu propre à l'impression
- Balisage sémantique, `aria-*`, lien d'évitement, focus visibles
- SEO : métadonnées, Open Graph, données structurées schema.org

## Compatibilité

Chrome, Edge, Firefox, Safari — versions récentes (ordinateur et mobile).
Les propriétés CSS modernes utilisées (`:has` non requis, `svh`, `mask-image`)
disposent de replis ou sont purement décoratives.

## Licence

Tous droits réservés © EL DOM VISUEL.
