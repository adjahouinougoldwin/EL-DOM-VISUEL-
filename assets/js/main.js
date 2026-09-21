/* ==========================================================================
   EL DOM VISUEL — Interactions du site
   Aucune dépendance externe. Script exécuté après le chargement du DOM.

   Sommaire :
     1.  Réglages (à personnaliser)
     2.  Petits utilitaires
     3.  En-tête : état au défilement, menu mobile, lien actif
     4.  Barre de progression et retour en haut
     5.  Apparition au défilement
     6.  Compteurs animés
     7.  Réalisations : filtres et visionneuse
     8.  Témoignages : carrousel automatique
     9.  FAQ : accordéon
     10. Formulaire : validation et envoi vers WhatsApp
     11. Divers (année, lien WhatsApp flottant)
   ========================================================================== */

(function () {
  'use strict';

  /* =====================================================
     1. RÉGLAGES — À PERSONNALISER
     ===================================================== */
  var CONFIG = {
    /* Votre numéro WhatsApp au format international, sans « + », sans espace
       et sans tiret. Exemple pour le Bénin : '22997123456'. */
    numeroWhatsApp: '22900000000',

    /* Adresse e-mail affichée dans les messages pré-remplis. */
    emailContact: 'contact@eldomvisuel.com',

    /* Durée d'affichage d'un témoignage (millisecondes). */
    delaiTemoins: 7000
  };

  /* =====================================================
     2. PETITS UTILITAIRES
     ===================================================== */
  function $(selecteur, racine) {
    return (racine || document).querySelector(selecteur);
  }

  function $$(selecteur, racine) {
    return Array.prototype.slice.call((racine || document).querySelectorAll(selecteur));
  }

  /* Limite la fréquence d'appel d'une fonction (défilement, redimensionnement). */
  function limiter(fonction, delai) {
    var minuteur = null;
    return function () {
      var args = arguments;
      var contexte = this;
      if (minuteur) return;
      minuteur = setTimeout(function () {
        minuteur = null;
        fonction.apply(contexte, args);
      }, delai || 100);
    };
  }

  /* =====================================================
     3. EN-TÊTE : ÉTAT AU DÉFILEMENT, MENU MOBILE, LIEN ACTIF
     ===================================================== */
  var entete = $('#entete');
  var nav = $('#nav');
  var burger = $('#burger');
  var liensNav = $$('.nav__lien');
  var sections = liensNav
    .map(function (lien) {
      var cible = lien.getAttribute('href');
      return cible && cible.charAt(0) === '#' ? document.querySelector(cible) : null;
    })
    .filter(Boolean);

  /* Ouvre ou ferme le menu plein écran sur mobile. */
  function definirMenu(ouvert) {
    if (!nav || !burger) return;
    nav.classList.toggle('est-ouvert', ouvert);
    burger.classList.toggle('est-actif', ouvert);
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('est-ouvert', ouvert);
  }

  if (burger) {
    burger.addEventListener('click', function () {
      definirMenu(!nav.classList.contains('est-ouvert'));
    });
  }

  /* Fermeture par la touche Échap. */
  document.addEventListener('keydown', function (evenement) {
    if (evenement.key === 'Escape') {
      definirMenu(false);
      fermerVisionneuse();
    }
  });

  /* Fermeture après un clic sur un lien du menu. */
  liensNav.forEach(function (lien) {
    lien.addEventListener('click', function () {
      definirMenu(false);
    });
  });

  /* Retour à la disposition normale si la fenêtre repasse en grand écran. */
  window.addEventListener('resize', limiter(function () {
    if (window.innerWidth > 900) definirMenu(false);
  }, 200));

  /* Lien actif selon la section visible (scrollspy). */
  function majLienActif() {
    if (!sections.length) return;

    var repere = window.scrollY + (window.innerHeight * 0.35);
    var indexActif = 0;

    sections.forEach(function (section, index) {
      if (section.offsetTop <= repere) indexActif = index;
    });

    /* En bas de page, on met en avant la dernière section atteignable. */
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      indexActif = sections.length - 1;
    }

    liensNav.forEach(function (lien, index) {
      var actif = index === indexActif;
      lien.classList.toggle('est-actif', actif);
      if (actif) {
        lien.setAttribute('aria-current', 'true');
      } else {
        lien.removeAttribute('aria-current');
      }
    });
  }

  /* =====================================================
     4. BARRE DE PROGRESSION ET RETOUR EN HAUT
     ===================================================== */
  var progression = $('#progression');
  var boutonHaut = $('#haut');

  function majDefilement() {
    var hauteurTotale = document.documentElement.scrollHeight - window.innerHeight;
    var position = window.scrollY;
    var ratio = hauteurTotale > 0 ? (position / hauteurTotale) * 100 : 0;

    if (progression) progression.style.width = ratio + '%';
    if (entete) entete.classList.toggle('est-colle', position > 24);
    if (boutonHaut) boutonHaut.classList.toggle('est-visible', position > 600);

    majLienActif();
  }

  window.addEventListener('scroll', limiter(majDefilement, 40), { passive: true });

  if (boutonHaut) {
    boutonHaut.addEventListener('click', function () {
      var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: doux ? 'smooth' : 'auto' });
    });
  }

  /* =====================================================
     5. APPARITION AU DÉFILEMENT
     ===================================================== */
  var elementsRevele = $$('[data-reveal]');

  if ('IntersectionObserver' in window && elementsRevele.length) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add('est-revele');
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elementsRevele.forEach(function (element) {
      observateur.observe(element);
    });
  } else {
    /* Repli : on affiche tout d'un coup si l'observateur n'existe pas. */
    elementsRevele.forEach(function (element) {
      element.classList.add('est-revele');
    });
  }

  /* =====================================================
     6. COMPTEURS ANIMÉS
     ===================================================== */
  var compteurs = $$('[data-compteur]');

  function animerCompteur(element) {
    var cible = parseFloat(element.getAttribute('data-compteur')) || 0;
    var duree = 1600;
    var debut = null;

    function etape(horodatage) {
      if (!debut) debut = horodatage;
      var avancement = Math.min((horodatage - debut) / duree, 1);
      /* Courbe d'accélération douce pour un rendu naturel. */
      var progresse = 1 - Math.pow(1 - avancement, 3);
      element.textContent = Math.round(cible * progresse).toLocaleString('fr-FR');

      if (avancement < 1) {
        requestAnimationFrame(etape);
      } else {
        element.textContent = cible.toLocaleString('fr-FR');
      }
    }

    requestAnimationFrame(etape);
  }

  if (compteurs.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      compteurs.forEach(function (element) {
        element.textContent = parseFloat(element.getAttribute('data-compteur')).toLocaleString('fr-FR');
      });
    } else if ('IntersectionObserver' in window) {
      var observateurCompteurs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            animerCompteur(entree.target);
            observateurCompteurs.unobserve(entree.target);
          }
        });
      }, { threshold: 0.6 });

      compteurs.forEach(function (element) {
        observateurCompteurs.observe(element);
      });
    } else {
      compteurs.forEach(animerCompteur);
    }
  }

  /* =====================================================
     7. RÉALISATIONS : FILTRES ET VISIONNEUSE
     ===================================================== */
  var galerie = $('#galerie');
  var projets = $$('.projet');
  var filtres = $$('.filtre');

  filtres.forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      var categorie = bouton.getAttribute('data-filtre');

      filtres.forEach(function (autre) {
        var actif = autre === bouton;
        autre.classList.toggle('est-actif', actif);
        autre.setAttribute('aria-pressed', actif ? 'true' : 'false');
      });

      projets.forEach(function (projet) {
        var correspond = categorie === 'tout' || projet.getAttribute('data-cat') === categorie;
        projet.classList.toggle('est-masque', !correspond);
      });

      if (galerie) {
        galerie.classList.remove('est-filtre');
        /* Force la réactivation de l'animation d'apparition. */
        void galerie.offsetWidth;
        galerie.classList.add('est-filtre');
      }
    });
  });

  /* --- Visionneuse plein écran --- */
  var visionneuse = $('#visionneuse');
  var visionneuseImg = $('#visionneuseImg');
  var visionneuseLegende = $('#visionneuseLegende');
  var btnFermer = $('#visionneuseFermer');
  var btnPrec = $('#visionneusePrec');
  var btnSuiv = $('#visionneuseSuiv');
  var indexCourant = 0;
  var dernierFocus = null;

  /* Liste des projets actuellement visibles (utile après un filtrage). */
  function projetsVisibles() {
    return projets.filter(function (projet) {
      return !projet.classList.contains('est-masque');
    });
  }

  function afficherProjet(index) {
    var liste = projetsVisibles();
    if (!liste.length) return;

    /* Bouclage circulaire. */
    indexCourant = (index + liste.length) % liste.length;

    var projet = liste[indexCourant];
    var image = $('img', projet);
    if (!image || !visionneuseImg) return;

    visionneuseImg.src = image.currentSrc || image.src;
    visionneuseImg.alt = image.alt || '';

    var detail = projet.getAttribute('data-detail') || '';
    var titre = projet.getAttribute('data-titre') || '';
    if (visionneuseLegende) {
      visionneuseLegende.textContent = titre + (detail ? ' — ' + detail : '');
    }
  }

  function ouvrirVisionneuse(projet) {
    if (!visionneuse) return;

    dernierFocus = document.activeElement;
    var liste = projetsVisibles();
    indexCourant = Math.max(0, liste.indexOf(projet));

    afficherProjet(indexCourant);

    visionneuse.hidden = false;
    document.body.classList.add('est-ouvert');

    /* Petite pause pour laisser le navigateur appliquer « hidden = false ». */
    requestAnimationFrame(function () {
      visionneuse.classList.add('est-visible');
    });

    if (btnFermer) btnFermer.focus();
  }

  function fermerVisionneuse() {
    if (!visionneuse || visionneuse.hidden) return;

    visionneuse.classList.remove('est-visible');
    document.body.classList.remove('est-ouvert');

    setTimeout(function () {
      visionneuse.hidden = true;
      if (dernierFocus && typeof dernierFocus.focus === 'function') dernierFocus.focus();
    }, 260);
  }

  projets.forEach(function (projet) {
    projet.addEventListener('click', function () {
      ouvrirVisionneuse(projet);
    });

    /* Ouverture au clavier (Entrée ou Espace) sur les vignettes. */
    projet.addEventListener('keydown', function (evenement) {
      if (evenement.key === 'Enter' || evenement.key === ' ') {
        evenement.preventDefault();
        ouvrirVisionneuse(projet);
      }
    });
  });

  if (btnFermer) btnFermer.addEventListener('click', fermerVisionneuse);
  if (btnPrec) btnPrec.addEventListener('click', function () { afficherProjet(indexCourant - 1); });
  if (btnSuiv) btnSuiv.addEventListener('click', function () { afficherProjet(indexCourant + 1); });

  /* Clic sur le fond sombre : fermeture. */
  if (visionneuse) {
    visionneuse.addEventListener('click', function (evenement) {
      if (evenement.target === visionneuse) fermerVisionneuse();
    });
  }

  /* Navigation au clavier dans la visionneuse. */
  document.addEventListener('keydown', function (evenement) {
    if (!visionneuse || visionneuse.hidden) return;

    if (evenement.key === 'ArrowRight') {
      evenement.preventDefault();
      afficherProjet(indexCourant + 1);
    }
    if (evenement.key === 'ArrowLeft') {
      evenement.preventDefault();
      afficherProjet(indexCourant - 1);
    }
  });

  /* Navigation par balayage tactile. */
  if (visionneuse) {
    var departX = 0;

    visionneuse.addEventListener('touchstart', function (evenement) {
      departX = evenement.changedTouches[0].clientX;
    }, { passive: true });

    visionneuse.addEventListener('touchend', function (evenement) {
      var ecart = evenement.changedTouches[0].clientX - departX;
      if (Math.abs(ecart) > 55) {
        afficherProjet(ecart < 0 ? indexCourant + 1 : indexCourant - 1);
      }
    }, { passive: true });
  }

  /* =====================================================
     8. TÉMOIGNAGES : CARROUSEL AUTOMATIQUE
     ===================================================== */
  var temoins = $$('.temoin');
  var conteneurPoints = $('#temoinsPoints');
  var compteurTemoin = 0;
  var minuteurTemoin = null;

  if (temoins.length && conteneurPoints) {
    temoins.forEach(function (temoin, index) {
      var point = document.createElement('button');
      point.type = 'button';
      point.className = 'temoin-point' + (index === 0 ? ' est-actif' : '');
      point.setAttribute('aria-label', 'Afficher le témoignage ' + (index + 1) + ' sur ' + temoins.length);
      point.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

      point.addEventListener('click', function () {
        afficherTemoin(index);
        relancerMinuteur();
      });

      conteneurPoints.appendChild(point);
    });
  }

  var pointsTemoins = $$('.temoin-point');

  function afficherTemoin(index) {
    if (!temoins.length) return;

    compteurTemoin = (index + temoins.length) % temoins.length;

    temoins.forEach(function (temoin, i) {
      temoin.classList.toggle('est-actif', i === compteurTemoin);
    });

    pointsTemoins.forEach(function (point, i) {
      var actif = i === compteurTemoin;
      point.classList.toggle('est-actif', actif);
      point.setAttribute('aria-pressed', actif ? 'true' : 'false');
    });
  }

  function relancerMinuteur() {
    if (minuteurTemoin) clearInterval(minuteurTemoin);

    if (temoins.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      minuteurTemoin = setInterval(function () {
        afficherTemoin(compteurTemoin + 1);
      }, CONFIG.delaiTemoins);
    }
  }

  /* Mise en pause au survol, pour laisser le temps de lire. */
  var blocTemoins = $('#temoins');
  if (blocTemoins) {
    blocTemoins.addEventListener('mouseenter', function () {
      if (minuteurTemoin) clearInterval(minuteurTemoin);
    });
    blocTemoins.addEventListener('mouseleave', relancerMinuteur);
  }

  relancerMinuteur();

  /* =====================================================
     9. FAQ : ACCORDÉON (une seule réponse ouverte à la fois)
     ===================================================== */
  var questions = $$('.question');

  questions.forEach(function (question) {
    var bouton = $('.question__bouton', question);
    if (!bouton) return;

    bouton.addEventListener('click', function () {
      var etaitOuverte = question.classList.contains('est-ouvert');

      questions.forEach(function (autre) {
        autre.classList.remove('est-ouvert');
        var autreBouton = $('.question__bouton', autre);
        if (autreBouton) autreBouton.setAttribute('aria-expanded', 'false');
      });

      if (!etaitOuverte) {
        question.classList.add('est-ouvert');
        bouton.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =====================================================
     10. FORMULAIRE : VALIDATION ET ENVOI VERS WHATSAPP
     ===================================================== */
  var formulaire = $('#formulaire');
  var statut = $('#statut');

  function marquerChamp(champ, message) {
    var bloc = champ.closest('.champ');
    if (!bloc) return;

    var zoneErreur = $('[data-erreur]', bloc);

    if (message) {
      bloc.classList.add('est-invalide');
      champ.setAttribute('aria-invalid', 'true');
      if (zoneErreur) zoneErreur.textContent = message;
    } else {
      bloc.classList.remove('est-invalide');
      champ.removeAttribute('aria-invalid');
      if (zoneErreur) zoneErreur.textContent = '';
    }
  }

  /* Vérifie un champ et renvoie true si la valeur est acceptable. */
  function validerChamp(champ) {
    var valeur = (champ.value || '').trim();

    if (champ.hasAttribute('required') && !valeur) {
      marquerChamp(champ, 'Ce champ est obligatoire.');
      return false;
    }

    if (champ.type === 'email' && valeur && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) {
      marquerChamp(champ, 'Adresse e-mail invalide.');
      return false;
    }

    if (champ.type === 'tel' && valeur && valeur.replace(/[^\d]/g, '').length < 8) {
      marquerChamp(champ, 'Numéro trop court.');
      return false;
    }

    if (champ.id === 'message' && valeur && valeur.length < 12) {
      marquerChamp(champ, 'Décrivez votre projet en quelques mots de plus (12 caractères minimum).');
      return false;
    }

    marquerChamp(champ, '');
    return true;
  }

  if (formulaire) {
    var champs = $$('input, select, textarea', formulaire);

    /* Nettoyage de l'erreur dès que l'utilisateur corrige. */
    champs.forEach(function (champ) {
      champ.addEventListener('input', function () {
        var bloc = champ.closest('.champ');
        if (bloc && bloc.classList.contains('est-invalide')) validerChamp(champ);
      });

      champ.addEventListener('blur', function () {
        if (champ.hasAttribute('required')) validerChamp(champ);
      });
    });

    formulaire.addEventListener('submit', function (evenement) {
      evenement.preventDefault();

      var premierInvalide = null;

      champs.forEach(function (champ) {
        if (!validerChamp(champ) && !premierInvalide) premierInvalide = champ;
      });

      if (premierInvalide) {
        premierInvalide.focus();
        if (statut) {
          statut.textContent = 'Merci de corriger les champs signalés avant l\'envoi.';
        }
        return;
      }

      /* Construction du message pré-rempli. */
      var donnees = new FormData(formulaire);
      var lignes = [
        'Bonjour EL DOM VISUEL,',
        '',
        'Nom : ' + (donnees.get('nom') || '—'),
        'Téléphone : ' + (donnees.get('tel') || 'non renseigné'),
        'Projet : ' + (donnees.get('service') || '—'),
        'Budget : ' + (donnees.get('budget') || 'à définir'),
        '',
        'Détails :',
        (donnees.get('message') || '—'),
        '',
        'Message envoyé depuis votre site.'
      ];

      var texte = encodeURIComponent(lignes.join('\n'));
      var lien = 'https://wa.me/' + CONFIG.numeroWhatsApp + '?text=' + texte;

      window.open(lien, '_blank', 'noopener');

      if (statut) {
        statut.textContent = 'Merci ' + (donnees.get('nom') || '') +
          ' ! WhatsApp s\'ouvre avec votre message. Si rien ne se passe, écrivez-nous à ' +
          CONFIG.emailContact + '.';
      }

      formulaire.reset();
    });
  }

  /* =====================================================
     11. DIVERS
     ===================================================== */
  /* Année courante dans le pied de page. */
  var annee = $('#annee');
  if (annee) annee.textContent = new Date().getFullYear();

  /* Lien WhatsApp flottant. */
  var lienWhatsApp = $('#whatsapp');
  if (lienWhatsApp) {
    var messageFlottant = encodeURIComponent(
      'Bonjour EL DOM VISUEL, je souhaite un devis pour un projet visuel.'
    );
    lienWhatsApp.href = 'https://wa.me/' + CONFIG.numeroWhatsApp + '?text=' + messageFlottant;
    lienWhatsApp.target = '_blank';
    lienWhatsApp.rel = 'noopener';
  }

  /* Premier calcul de l'état de la page. */
  majDefilement();
})();
