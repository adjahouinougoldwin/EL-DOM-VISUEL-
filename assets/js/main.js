/* ==========================================================================
   EL DOM VISUEL — Interactions du site
   --------------------------------------------------------------------------
   Sommaire
   1.  Configuration
   2.  En-tête collant
   3.  Menu mobile
   4.  Apparition au défilement
   5.  Compteurs animés
   6.  Lien de navigation actif (scrollspy)
   7.  Filtres de la galerie
   8.  Visionneuse (lightbox)
   9.  Témoignages en rotation
   10. Bouton retour en haut
   11. Formulaire vers WhatsApp
   12. Divers (année, défilement doux)
   ========================================================================== */
'use strict';

(function () {

  /* ---------------------------- 1. CONFIGURATION -------------------------- */
  const CONFIG = {
    // ⚠️ À REMPLACER par votre numéro WhatsApp au format international, sans « + », espaces ni tirets.
    // Exemple pour le Bénin : '22912345678'
    numeroWhatsApp: '22900000000',

    // ⚠️ À REMPLACER par votre adresse e-mail de secours
    emailContact: 'contact@eldomvisuel.com',

    delaiTemoins: 7000   // durée d'affichage de chaque témoignage (ms)
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduireMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------- 2. EN-TÊTE COLLANT --------------------------- */
  const entete = $('#entete');
  const haut = $('#haut');

  function majEntete() {
    const y = window.scrollY;
    if (entete) entete.classList.toggle('est-colle', y > 40);
    if (haut) haut.classList.toggle('visible', y > 700);
  }

  /* --------------------------- 3. MENU MOBILE ----------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');

  function fermerMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('ouvert');
    burger.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const ouvert = nav.classList.toggle('ouvert');
      burger.classList.toggle('ouvert', ouvert);
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = ouvert ? 'hidden' : '';
    });

    // Fermer après un clic sur un lien
    $$('a', nav).forEach(lien => lien.addEventListener('click', fermerMenu));

    // Fermer avec la touche Échap
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') fermerMenu();
    });

    // Réinitialiser au retour en mode bureau
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) fermerMenu();
    });
  }

  /* --------------------- 4. APPARITION AU DÉFILEMENT ---------------------- */
  const elementsReveal = $$('[data-reveal]');

  if (reduireMouvement || !('IntersectionObserver' in window)) {
    elementsReveal.forEach(el => el.classList.add('visible'));
  } else {
    const observateur = new IntersectionObserver((entrees, obs) => {
      entrees.forEach((entree, i) => {
        if (!entree.isIntersecting) return;
        // Léger décalage pour un effet en cascade
        setTimeout(() => entree.target.classList.add('visible'), i * 70);
        obs.unobserve(entree.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elementsReveal.forEach(el => observateur.observe(el));
  }

  /* -------------------------- 5. COMPTEURS ANIMÉS ------------------------- */
  const compteurs = $$('[data-compteur]');

  function animerCompteur(el) {
    const cible = parseInt(el.dataset.compteur, 10) || 0;
    if (reduireMouvement) { el.textContent = cible; return; }

    const duree = 1500;
    const debut = performance.now();

    function etape(maintenant) {
      const progression = Math.min((maintenant - debut) / duree, 1);
      // Courbe d'accélération douce
      const valeur = Math.round(cible * (1 - Math.pow(1 - progression, 3)));
      el.textContent = valeur;
      if (progression < 1) requestAnimationFrame(etape);
      else el.textContent = cible;
    }
    requestAnimationFrame(etape);
  }

  if (compteurs.length && 'IntersectionObserver' in window) {
    const obsCompteur = new IntersectionObserver((entrees, obs) => {
      entrees.forEach(entree => {
        if (!entree.isIntersecting) return;
        animerCompteur(entree.target);
        obs.unobserve(entree.target);
      });
    }, { threshold: 0.5 });
    compteurs.forEach(el => obsCompteur.observe(el));
  } else {
    compteurs.forEach(el => { el.textContent = el.dataset.compteur; });
  }

  /* -------------------- 6. LIEN DE NAVIGATION ACTIF ---------------------- */
  const sections = $$('main section[id]');
  const liensNav = $$('.nav__liste a');

  function majLienActif() {
    const position = window.scrollY + 140;
    let courante = '';
    sections.forEach(section => {
      if (section.offsetTop <= position) courante = section.id;
    });
    liensNav.forEach(lien => {
      lien.classList.toggle('actif', lien.getAttribute('href') === '#' + courante);
    });
  }

  /* --------------------- 7. FILTRES DE LA GALERIE ------------------------ */
  const boutonsFiltre = $$('.filtre');
  const projets = $$('.projet');

  boutonsFiltre.forEach(bouton => {
    bouton.addEventListener('click', () => {
      boutonsFiltre.forEach(b => b.classList.remove('actif'));
      bouton.classList.add('actif');

      const choix = bouton.dataset.filtre;
      projets.forEach(projet => {
        const correspond = choix === 'tout' || projet.dataset.cat === choix;
        projet.classList.toggle('masque', !correspond);
        if (correspond) {
          projet.classList.remove('visible');
          // Petite ré-entrée animée
          requestAnimationFrame(() => {
            setTimeout(() => projet.classList.add('visible'), 40);
          });
        }
      });
    });
  });

  /* --------------------------- 8. VISIONNEUSE ---------------------------- */
  const visionneuse = $('#visionneuse');
  const vImg = $('#visionneuseImg');
  const vLegende = $('#visionneuseLegende');
  let indexCourant = 0;
  let dernierFocus = null;

  function projetsVisibles() {
    return projets.filter(p => !p.classList.contains('masque'));
  }

  function afficherProjet(index) {
    const liste = projetsVisibles();
    if (!liste.length) return;
    indexCourant = (index + liste.length) % liste.length;

    const projet = liste[indexCourant];
    const img = $('img', projet);
    const titre = $('h3', projet);
    const cat = $('.projet__cat', projet);

    if (!img) return;
    vImg.src = img.getAttribute('src');
    vImg.alt = img.getAttribute('alt') || '';
    vLegende.textContent = (cat ? cat.textContent + ' — ' : '') + (titre ? titre.textContent : '');
  }

  function ouvrirVisionneuse(projet) {
    if (!visionneuse) return;
    dernierFocus = document.activeElement;
    const liste = projetsVisibles();
    afficherProjet(liste.indexOf(projet));
    visionneuse.hidden = false;
    document.body.style.overflow = 'hidden';
    const fermer = $('#visionneuseFermer');
    if (fermer) fermer.focus();
  }

  function fermerVisionneuse() {
    if (!visionneuse || visionneuse.hidden) return;
    visionneuse.hidden = true;
    document.body.style.overflow = '';
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }

  if (visionneuse) {
    projets.forEach(projet => {
      projet.setAttribute('tabindex', '0');
      projet.setAttribute('role', 'button');
      projet.addEventListener('click', () => ouvrirVisionneuse(projet));
      projet.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          ouvrirVisionneuse(projet);
        }
      });
    });

    const btnFermer = $('#visionneuseFermer');
    const btnPrec = $('#visionneusePrec');
    const btnSuiv = $('#visionneuseSuiv');

    if (btnFermer) btnFermer.addEventListener('click', fermerVisionneuse);
    if (btnPrec) btnPrec.addEventListener('click', () => afficherProjet(indexCourant - 1));
    if (btnSuiv) btnSuiv.addEventListener('click', () => afficherProjet(indexCourant + 1));
    visionneuse.addEventListener('click', e => { if (e.target === visionneuse) fermerVisionneuse(); });

    document.addEventListener('keydown', e => {
      if (visionneuse.hidden) return;
      if (e.key === 'Escape') fermerVisionneuse();
      if (e.key === 'ArrowLeft') afficherProjet(indexCourant - 1);
      if (e.key === 'ArrowRight') afficherProjet(indexCourant + 1);
    });

    // Navigation au glissement (mobile)
    let departX = null;
    visionneuse.addEventListener('touchstart', e => { departX = e.changedTouches[0].clientX; }, { passive: true });
    visionneuse.addEventListener('touchend', e => {
      if (departX === null) return;
      const delta = e.changedTouches[0].clientX - departX;
      if (Math.abs(delta) > 55) afficherProjet(indexCourant + (delta < 0 ? 1 : -1));
      departX = null;
    }, { passive: true });
  }

  /* ---------------------- 9. TÉMOIGNAGES EN ROTATION --------------------- */
  const temoins = $$('.temoin');
  const zonePoints = $('#temoinsPoints');
  let temoinActif = 0;
  let minuteurTemoins = null;

  function afficherTemoin(index) {
    if (!temoins.length) return;
    temoinActif = (index + temoins.length) % temoins.length;
    temoins.forEach((t, i) => t.classList.toggle('actif', i === temoinActif));
    if (zonePoints) {
      $$('button', zonePoints).forEach((p, i) => p.classList.toggle('actif', i === temoinActif));
    }
  }

  function demarrerRotation() {
    if (temoins.length < 2 || reduireMouvement) return;
    arreterRotation();
    minuteurTemoins = setInterval(() => afficherTemoin(temoinActif + 1), CONFIG.delaiTemoins);
  }

  function arreterRotation() {
    if (minuteurTemoins) clearInterval(minuteurTemoins);
    minuteurTemoins = null;
  }

  if (temoins.length && zonePoints) {
    temoins.forEach((_, i) => {
      const point = document.createElement('button');
      point.type = 'button';
      point.setAttribute('aria-label', 'Afficher le témoignage ' + (i + 1));
      point.addEventListener('click', () => { afficherTemoin(i); demarrerRotation(); });
      zonePoints.appendChild(point);
    });

    afficherTemoin(0);
    demarrerRotation();

    const zone = $('#temoins');
    if (zone) {
      zone.addEventListener('mouseenter', arreterRotation);
      zone.addEventListener('mouseleave', demarrerRotation);
    }
    document.addEventListener('visibilitychange', () => {
      document.hidden ? arreterRotation() : demarrerRotation();
    });
  }

  /* --------------------- 10. BOUTON RETOUR EN HAUT ----------------------- */
  if (haut) {
    haut.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduireMouvement ? 'auto' : 'smooth' });
    });
  }

  /* ------------------- 11. FORMULAIRE VERS WHATSAPP ---------------------- */
  const formulaire = $('#formulaire');
  const statut = $('#statut');

  if (formulaire) {
    formulaire.addEventListener('submit', e => {
      e.preventDefault();

      const donnees = new FormData(formulaire);
      const nom     = (donnees.get('nom') || '').toString().trim();
      const tel     = (donnees.get('tel') || '').toString().trim();
      const service = (donnees.get('service') || '').toString().trim();
      const budget  = (donnees.get('budget') || '').toString().trim();
      const message = (donnees.get('message') || '').toString().trim();

      if (!nom || !service || !message) {
        if (statut) {
          statut.textContent = 'Merci de remplir les champs marqués d\'un astérisque (*).';
          statut.classList.add('erreur');
        }
        formulaire.reportValidity();
        return;
      }

      const lignes = [
        'Bonjour EL DOM VISUEL,',
        '',
        'Nom : ' + nom
      ];
      if (tel)     lignes.push('Téléphone : ' + tel);
      lignes.push('Service souhaité : ' + service);
      if (budget)  lignes.push('Budget : ' + budget);
      lignes.push('', 'Projet :', message);
      lignes.push('', '— Message envoyé depuis le site eldomvisuel.com');

      const texte = encodeURIComponent(lignes.join('\n'));
      const url = 'https://wa.me/' + CONFIG.numeroWhatsApp + '?text=' + texte;

      if (statut) {
        statut.classList.remove('erreur');
        statut.textContent = 'Ouverture de WhatsApp… Si rien ne se passe, écrivez-nous à ' + CONFIG.emailContact + '.';
      }

      window.open(url, '_blank', 'noopener');
    });
  }

  /* ------------------------------ 12. DIVERS ----------------------------- */
  const annee = $('#annee');
  if (annee) annee.textContent = new Date().getFullYear();

  // Défilement doux pour les ancres internes
  $$('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', e => {
      const id = lien.getAttribute('href');
      if (!id || id === '#') return;
      const cible = document.querySelector(id);
      if (!cible) return;
      e.preventDefault();
      const decalage = entete ? entete.offsetHeight + 16 : 0;
      const position = cible.getBoundingClientRect().top + window.scrollY - decalage + 10;
      window.scrollTo({ top: position, behavior: reduireMouvement ? 'auto' : 'smooth' });
      // Mettre à jour l'URL sans casser le défilement
      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  // Écouteurs de défilement regroupés (performances)
  let enAttente = false;
  function surDefilement() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(() => {
      majEntete();
      majLienActif();
      enAttente = false;
    });
  }

  window.addEventListener('scroll', surDefilement, { passive: true });
  majEntete();
  majLienActif();

})();
