// Revia – formulaire de liste d'attente (appel direct à l'API REST Supabase, sans bibliothèque)
(function () {
  'use strict';

  var form = document.getElementById('waitlist-form');
  if (!form) return;
  var msg = document.getElementById('form-msg');
  var cfg = window.REVIA_CONFIG || {};

  var fields = {
    email: { input: document.getElementById('email'), err: document.getElementById('email-err') },
    consent: { input: document.getElementById('consent'), err: document.getElementById('consent-err') }
  };

  function setError(name, text) {
    var f = fields[name];
    if (text) {
      f.err.textContent = text;
      f.err.hidden = false;
      f.input.setAttribute('aria-invalid', 'true');
    } else {
      f.err.textContent = '';
      f.err.hidden = true;
      f.input.removeAttribute('aria-invalid');
    }
  }

  function status(text, ok) {
    msg.textContent = text;
    msg.className = 'msg ' + (ok ? 'msg--ok' : 'msg--err');
  }

  // « Vendre sur Revia » / « Devenir vendeur » présélectionnent le rôle vendeur.
  document.querySelectorAll('[data-role]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = form.querySelector('input[name="role"][value="' + a.getAttribute('data-role') + '"]');
      if (r) r.checked = true;
    });
  });

  var roleParam = new URLSearchParams(location.search).get('role');
  if (roleParam) {
    var pre = form.querySelector('input[name="role"][value="' + roleParam + '"]');
    if (pre) pre.checked = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status('', true);

    var email = fields.email.input.value.trim().toLowerCase();
    var first = null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('email', 'Erreur : saisissez une adresse e-mail valide, par exemple marie@email.com.');
      first = first || fields.email.input;
    } else setError('email', '');

    if (!fields.consent.input.checked) {
      setError('consent', 'Erreur : cochez la case pour accepter d\'être contacté·e.');
      first = first || fields.consent.input;
    } else setError('consent', '');

    if (first) { first.focus(); return; }
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
      return status('Le service d\'inscription n\'est pas encore configuré. Merci de réessayer plus tard.', false);
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status('Envoi en cours…', true);

    var role = form.querySelector('input[name="role"]:checked');
    var country = document.getElementById('country').value.trim();

    fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': cfg.supabaseAnonKey,
        'Authorization': 'Bearer ' + cfg.supabaseAnonKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email: email,
        role: role && role.value === 'vendeur' ? 'vendeur' : 'client',
        origin_country: country || null,
        consent: true,
        source: 'home'
      })
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        return status('Merci ! Vous êtes sur la liste. Nous vous écrivons dès l\'ouverture.', true);
      }
      return res.json().catch(function () { return {}; }).then(function (body) {
        // 23505 = e-mail déjà inscrit (contrainte d'unicité)
        if (body.code === '23505') return status('Vous êtes déjà sur la liste, merci !', true);
        status('Une erreur est survenue. Merci de réessayer.', false);
      });
    }).catch(function () {
      status('Connexion impossible. Vérifiez votre réseau et réessayez.', false);
    }).then(function () { btn.disabled = false; });
  });
})();
