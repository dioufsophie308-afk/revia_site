// Revia – catalogue (filtres), fiche produit (ajout) et panier simulé. Sans bibliothèque.
(function () {
  'use strict';

  var KEY = 'revia-panier', DKEY = 'revia-destination';
  var eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function read(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  function cart() { var c = read(KEY, {}); return c && typeof c === 'object' && !Array.isArray(c) ? c : {}; }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  function badge() {
    var c = cart(), n = Object.keys(c).reduce(function (t, k) { return t + (parseInt(c[k], 10) || 0); }, 0);
    $$('.cart-count').forEach(function (e) { e.textContent = n ? ' (' + n + ')' : ''; });
  }
  badge();

  /* ---------- Catalogue ---------- */
  var filters = $('#filters');
  if (filters) {
    var items = $$('#results > li'), count = $('#count'), empty = $('#empty');
    filters.hidden = false;
    var noscript = $('#noscript-filters'); if (noscript) noscript.hidden = true;

    var params = new URLSearchParams(location.search);
    ['q', 'categorie', 'origine', 'prix', 'destination', 'tri'].forEach(function (k) {
      var f = filters.elements[k]; if (f && params.get(k)) f.value = params.get(k);
    });

    var apply = function (announce) {
      var f = filters.elements, q = norm(f.q.value).split(/\s+/).filter(Boolean);
      var cat = f.categorie.value, org = f.origine.value, dest = f.destination.value;
      var max = parseFloat(String(f.prix.value).replace(',', '.')); max = isNaN(max) ? Infinity : max * 100;
      var shown = items.filter(function (li) {
        var d = li.dataset;
        var ok = (!cat || d.cat === cat) && (!org || d.pays === org || d.cont === org) &&
          (parseInt(d.prix, 10) <= max) && (!dest || d.ship.split(' ').indexOf(dest) > -1) &&
          q.every(function (w) { return d.txt.indexOf(w) > -1; });
        li.hidden = !ok; return ok;
      });
      var tri = f.tri.value, list = $('#results');
      var sorted = shown.slice().sort(function (a, b) {
        if (tri === 'prix-asc') return a.dataset.prix - b.dataset.prix;
        if (tri === 'prix-desc') return b.dataset.prix - a.dataset.prix;
        if (tri === 'nom') return a.dataset.nom.localeCompare(b.dataset.nom, 'fr');
        return a.dataset.idx - b.dataset.idx;
      });
      sorted.forEach(function (li) { list.appendChild(li); });
      items.filter(function (li) { return li.hidden; }).forEach(function (li) { list.appendChild(li); });
      empty.hidden = shown.length > 0;
      if (announce !== false) count.textContent = shown.length === 0 ? 'Aucun produit trouvé.' : shown.length + (shown.length > 1 ? ' produits affichés' : ' produit affiché') + ' sur ' + items.length + '.';
      var p = new URLSearchParams();
      ['q', 'categorie', 'origine', 'prix', 'destination', 'tri'].forEach(function (k) { if (f[k].value) p.set(k, f[k].value); });
      try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '')); } catch (e) { /* ignore */ }
    };
    filters.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    filters.addEventListener('reset', function () { setTimeout(function () { apply(); }, 0); });
    apply(false);
    count.textContent = $$('#results > li:not([hidden])').length + ' produits affichés sur ' + items.length + '.';
  }

  /* ---------- Fiche produit ---------- */
  var add = $('#add-form');
  if (add) {
    add.addEventListener('submit', function (e) {
      e.preventDefault();
      var slug = add.dataset.slug, stock = parseInt(add.dataset.stock, 10), q = $('#qty'), msg = $('#add-status');
      var n = parseInt(q.value, 10), c = cart(), have = parseInt(c[slug], 10) || 0;
      msg.className = 'msg';
      if (!(n >= 1)) { msg.textContent = 'Erreur : indiquez une quantité d\'au moins 1.'; msg.classList.add('msg--err'); q.focus(); return; }
      if (have + n > stock) { msg.textContent = 'Erreur : stock insuffisant. Il reste ' + stock + ' exemplaires, dont ' + have + ' déjà dans votre panier.'; msg.classList.add('msg--err'); q.focus(); return; }
      c[slug] = have + n; write(KEY, c); badge();
      msg.textContent = 'Ajouté au panier : ' + n + ' × ' + add.dataset.nom + '. ';
      msg.classList.add('msg--ok');
      var a = el('a', { href: add.dataset.cartHref, text: 'Voir le panier' }); msg.appendChild(a);
    });
  }

  /* ---------- Panier ---------- */
  var root = $('#cart-root');
  if (root) {
    var data = JSON.parse($('#catalogue-data').textContent);
    var prod = {}; data.produits.forEach(function (p) { prod[p.slug] = p; });
    var dests = data.destinations;
    var tpl = $('#tpl-link').content.firstElementChild.getAttribute('href');
    var status = $('#cart-status');
    var dest = read(DKEY, 'FR'); if (!dests.some(function (d) { return d.code === dest; })) dest = 'FR';

    var say = function (t, err) { status.textContent = t; status.className = 'msg ' + (err ? 'msg--err' : 'msg--ok'); };

    var render = function () {
      var c = cart(), slugs = Object.keys(c).filter(function (s) { return prod[s] && c[s] > 0; });
      root.textContent = '';
      if (!slugs.length) {
        root.appendChild(el('p', { text: 'Votre panier est vide.' }));
        root.appendChild(el('p', {}, [el('a', { class: 'btn btn--green', href: $('#tpl-cat').content.firstElementChild.getAttribute('href'), text: 'Voir le catalogue' })]));
        return;
      }
      var sel = el('select', { id: 'dest', name: 'dest' });
      dests.forEach(function (d) { var o = el('option', { value: d.code, text: d.nom }); if (d.code === dest) o.selected = true; sel.appendChild(o); });
      root.appendChild(el('div', { class: 'field-group' }, [el('label', { for: 'dest', text: 'Destination de livraison' }), sel]));

      var tbody = el('tbody');
      var table = el('table', { class: 'carttable' }, [
        el('caption', { text: 'Articles du panier' }),
        el('thead', {}, [el('tr', {}, ['Produit', 'Prix unitaire', 'Quantité', 'Total', 'Action'].map(function (h) { return el('th', { scope: 'col', text: h }); }))]),
        tbody
      ]);
      var rows = {};
      slugs.forEach(function (s) {
        var p = prod[s];
        var qty = el('input', { type: 'number', id: 'q-' + s, min: '1', max: String(p.stock), value: String(c[s]), inputmode: 'numeric' });
        var link = el('a', { href: tpl.replace('__SLUG__', s), text: p.nom });
        var cellP = el('th', { scope: 'row' }, [link, el('br'), el('span', { class: 'small', text: p.vendeur })]);
        var warn = el('span', { class: 'err', hidden: '' });
        var tot = el('td', { class: 'tot' });
        var rm = el('button', { type: 'button', class: 'btn btn--ghost btn--sm' });
        rm.appendChild(document.createTextNode('Retirer'));
        rm.appendChild(el('span', { class: 'sr', text: ' ' + p.nom + ' du panier' }));
        var tr = el('tr', {}, [cellP, el('td', { text: eur.format(p.prix / 100) }),
          el('td', {}, [el('label', { class: 'sr', for: 'q-' + s, text: 'Quantité de ' + p.nom }), qty, warn]), tot, el('td', {}, [rm])]);
        tbody.appendChild(tr); rows[s] = { qty: qty, tot: tot, warn: warn, p: p };
        qty.addEventListener('change', function () {
          var n = parseInt(qty.value, 10);
          if (!(n >= 1) || n > p.stock) { qty.value = Math.min(Math.max(n || 1, 1), p.stock); say('Quantité corrigée : entre 1 et ' + p.stock + ' pour ' + p.nom + '.', true); }
          var cc = cart(); cc[s] = parseInt(qty.value, 10); write(KEY, cc); badge(); update(true);
        });
        rm.addEventListener('click', function () {
          var cc = cart(); delete cc[s]; write(KEY, cc); badge(); render();
          say(p.nom + ' retiré du panier.', false); var h = $('#cart-title'); h.focus();
        });
      });
      root.appendChild(el('div', { class: 'tablewrap' }, [table]));

      var dl = el('dl', { class: 'summary' });
      var sub = el('dd'), shipP = el('dd'), ship = el('dt', { text: 'Livraison' }), totd = el('dd', { class: 'grand' });
      [['Sous-total articles', sub], [null, shipP], ['Total TTC (démonstration)', totd]].forEach(function (r, i) {
        if (i === 1) { dl.appendChild(ship); dl.appendChild(shipP); } else { dl.appendChild(el('dt', { text: r[0] })); dl.appendChild(r[1]); }
      });
      root.appendChild(dl);
      var note = el('p', { class: 'help', id: 'delay' }); root.appendChild(note);
      var go = el('button', { type: 'button', class: 'btn btn--terra', text: 'Commander' });
      root.appendChild(go);
      go.addEventListener('click', function () {
        var ok = Object.keys(rows).some(function (s) { return prod[s].livrable.indexOf(dest) > -1; });
        if (!ok) return say('Erreur : aucun article ne peut être livré vers cette destination.', true);
        say('Démonstration : le paiement et les comptes ne sont pas encore disponibles. Aucune commande n\'a été passée.', false);
      });

      var update = function (announce) {
        var subtotal = 0, any = false, bad = [];
        Object.keys(rows).forEach(function (s) {
          var r = rows[s], n = parseInt(r.qty.value, 10) || 1, ok = r.p.livrable.indexOf(dest) > -1;
          r.tot.textContent = ok ? eur.format(n * r.p.prix / 100) : '—';
          r.warn.hidden = ok; r.warn.textContent = ok ? '' : ' Non livrable vers cette destination.';
          if (ok) { subtotal += n * r.p.prix; any = true; } else bad.push(r.p.nom);
        });
        var d = dests.filter(function (x) { return x.code === dest; })[0];
        var sp = any ? d.prix : 0;
        sub.textContent = eur.format(subtotal / 100);
        ship.textContent = 'Livraison vers ' + d.nom;
        shipP.textContent = any ? eur.format(sp / 100) : 'Aucune livraison possible';
        totd.textContent = eur.format((subtotal + sp) / 100);
        note.textContent = any ? 'Délai estimé : ' + d.delai + ' (estimation de démonstration). Frais par commande, séparés des commissions et frais de service.' : 'Aucun article du panier n\'est livrable vers cette destination.';
        if (announce) say('Total mis à jour : ' + eur.format((subtotal + sp) / 100) + '.', false);
        if (bad.length && announce) say('Attention : non livrable vers cette destination : ' + bad.join(', ') + '. Total mis à jour : ' + eur.format((subtotal + sp) / 100) + '.', true);
      };
      sel.addEventListener('change', function () { dest = sel.value; write(DKEY, dest); update(true); });
      update(false);
    };
    render();
  }
})();
