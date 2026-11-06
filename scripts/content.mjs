// Pages de contenu (texte). Les champs « todo » signalent ce que l'équipe doit renseigner.
const todo = (t) => `<span class="todo">[${t}]</span>`;
const contact = todo('adresse e-mail de contact à renseigner');

export const pages = [
  {
    slug: 'a-propos',
    title: 'À propos',
    desc: 'Revia relie producteurs, artisans et acheteurs du monde entier autour de produits authentiques et traditionnels.',
    body: `
    <h1>À propos de Revia</h1>
    <p class="lead">Un monde où chacun, où qu'il vive, peut retrouver les produits de chez soi et découvrir ceux des autres cultures.</p>
    <h2>Notre mission</h2>
    <p>Relier producteurs, commerçants, artisans et consommateurs du monde entier, en facilitant la découverte et l'achat de produits authentiques, avec des informations fiables et des conditions de vente transparentes.</p>
    <h2>Pour qui ?</h2>
    <ul>
      <li>Les personnes qui vivent loin de leur pays d'origine et cherchent des produits de chez elles.</li>
      <li>Les curieux qui veulent comprendre l'origine, l'histoire et l'usage d'un produit avant de l'acheter.</li>
      <li>Les artisans, producteurs et commerçants qui veulent atteindre des acheteurs au-delà de leur clientèle locale.</li>
    </ul>
    <h2>Ce que nous voulons rendre visible</h2>
    <ul>
      <li>L'origine du produit et l'identité du vendeur.</li>
      <li>L'histoire du savoir-faire et les informations de traçabilité disponibles.</li>
      <li>Le prix total, les frais, les délais estimés, les retours et les restrictions par destination.</li>
    </ul>
    <h2>Accessibilité et sobriété numérique</h2>
    <p>Elles font partie du produit dès le départ : voir la page <a href="/accessibilite">Accessibilité</a> et la page <a href="/ecoconception">Écoconception</a>.</p>
    <h2>Où en sommes-nous ?</h2>
    <p>Revia est en phase de conception. Ce site est une démonstration : les produits, vendeurs, prix et frais sont fictifs, et aucune commande réelle n'est possible. Vous pouvez <a href="/?role=client#liste-attente">rejoindre la liste d'attente</a>.</p>`
  },
  {
    slug: 'vendeurs',
    title: 'Vendre sur Revia',
    desc: 'Artisans, producteurs et commerçants : présentez votre savoir-faire sur Revia et rejoignez la liste d’attente vendeurs.',
    body: `
    <h1>Vendre sur Revia</h1>
    <p class="lead">Présentez votre savoir-faire et touchez des acheteurs au-delà de votre clientèle locale.</p>
    <p>L'espace vendeur n'est pas encore ouvert. Voici le parcours prévu, qui sera confirmé après les entretiens avec les premiers vendeurs.</p>
    <h2>Le parcours prévu</h2>
    <ol>
      <li><strong>Inscription et vérification</strong> : présentation de votre activité et justificatifs adaptés à votre pays.</li>
      <li><strong>Catalogue</strong> : vos produits, avec photos, origine, histoire du savoir-faire et informations réglementaires.</li>
      <li><strong>Stocks et commandes</strong> : suivi depuis un espace simple.</li>
      <li><strong>Livraison</strong> : options, frais et délais par destination, affichés à l'acheteur avant le paiement.</li>
      <li><strong>Paiements et assistance</strong> : via un prestataire de paiement adapté aux marketplaces.</li>
    </ol>
    <h2>Ce que Revia attend de vous</h2>
    <ul>
      <li>Des informations exactes sur l'origine, les matières et les ingrédients.</li>
      <li>Le respect des règles applicables à votre catégorie : alimentaire, cosmétiques, douane, TVA.</li>
      <li>Des délais et des frais de livraison réalistes.</li>
    </ul>
    <p>Les conditions de rémunération (commission, services optionnels) seront précisées avant l'ouverture.</p>
    <p><a class="btn btn--terra" href="/?role=vendeur#liste-attente">Rejoindre la liste d'attente vendeurs</a></p>`
  },
  {
    slug: 'faq',
    title: 'Questions fréquentes',
    desc: 'Réponses aux questions fréquentes sur Revia : commandes, livraison, retours, vendeurs et données personnelles.',
    body: `
    <h1>Questions fréquentes</h1>
    <details><summary>Puis-je acheter sur Revia aujourd'hui ?</summary><p>Non. Ce site est une démonstration : produits, vendeurs, prix et frais sont fictifs. Le panier est simulé et aucun paiement n'est possible.</p></details>
    <details><summary>Comment puis-je être prévenu de l'ouverture ?</summary><p>Inscrivez-vous à la <a href="/#liste-attente">liste d'attente</a>. Nous n'utilisons votre adresse que pour vous prévenir.</p></details>
    <details><summary>Comment seront présentés les frais de livraison ?</summary><p>Les frais et les délais estimés seront affichés avant la confirmation de la commande, séparément des commissions et des frais de service. Le panier de démonstration montre ce principe.</p></details>
    <details><summary>Tous les produits seront-ils livrables partout ?</summary><p>Non. Certaines catégories sont soumises à des restrictions selon la destination (denrées alimentaires, cosmétiques, objets fragiles). Chaque fiche indiquera les destinations disponibles.</p></details>
    <details><summary>Comment les retours seront-ils gérés ?</summary><p>Voir la page <a href="/retours-livraison">Retours et livraison</a>. Les conditions définitives seront validées juridiquement avant l'ouverture.</p></details>
    <details><summary>Je suis artisan ou producteur : comment participer ?</summary><p>Voir la page <a href="/vendeurs">Vendre sur Revia</a>.</p></details>
    <details><summary>Quelles données personnelles collectez-vous ?</summary><p>Uniquement celles du formulaire de liste d'attente. Voir la <a href="/confidentialite">politique de confidentialité</a>.</p></details>
    <details><summary>Le site est-il accessible ?</summary><p>Il est conçu pour viser le niveau AA, mais n'a pas encore été audité. Voir la <a href="/accessibilite">déclaration d'accessibilité</a>.</p></details>
    <p>Une autre question ? Écrivez-nous : ${contact}.</p>`
  },
  {
    slug: 'contact',
    title: 'Contact',
    desc: 'Contacter l’équipe Revia.',
    body: `
    <h1>Contact</h1>
    <p>Pour une question, une demande d'accès à un contenu, l'exercice de vos droits sur vos données ou une proposition de partenariat, écrivez-nous : ${contact}.</p>
    <p>Nous répondons en français. Pour une demande d'accessibilité, précisez la page et le problème rencontré : nous proposerons une alternative accessible.</p>
    <p>Vous pouvez aussi consulter la <a href="/faq">foire aux questions</a>.</p>`
  },
  {
    slug: 'retours-livraison',
    title: 'Retours et livraison',
    desc: 'Principes de livraison, de frais, de délais et de retours prévus sur Revia (démonstration).',
    body: `
    <h1>Retours et livraison</h1>
    <p>${todo('Texte à valider par un juriste avant l\'ouverture. Les valeurs ci-dessous sont des hypothèses de démonstration.')}</p>
    <h2>Livraison</h2>
    <ul>
      <li>Les frais et le délai estimé sont affichés dans le panier avant la confirmation.</li>
      <li>Les frais de livraison sont séparés des commissions et des frais de service.</li>
      <li>Chaque fiche produit indique les destinations disponibles et celles qui ne le sont pas.</li>
    </ul>
    <h2>Retours</h2>
    <ul>
      <li>Délai de rétractation de 14 jours pour les consommateurs de l'Union européenne, sauf exceptions légales (denrées périssables, produits personnalisés, produits d'hygiène descellés).</li>
      <li>Les conditions de retour propres à chaque produit figurent sur sa fiche.</li>
      <li>Les modalités de remboursement et de prise en charge des frais de retour seront précisées dans les CGV.</li>
    </ul>
    <h2>Tarifs de démonstration</h2>
    <p>Les montants affichés dans le panier (par exemple 5,90 € vers la France, délai de 3 à 5 jours) sont fictifs. Les frais et délais réels seront calculés par itinéraire avec les transporteurs retenus.</p>`
  },
  {
    slug: 'cookies',
    title: 'Cookies et traceurs',
    desc: 'Revia n’utilise aucun cookie ni traceur de mesure d’audience ou de publicité.',
    body: `
    <h1>Cookies et traceurs</h1>
    <p><strong>Ce site n'utilise aucun cookie, aucun outil de mesure d'audience et aucun traceur publicitaire.</strong> Aucun bandeau de consentement n'est donc nécessaire.</p>
    <h2>Stockage local de votre navigateur</h2>
    <p>Pour le panier de démonstration, le site enregistre dans votre navigateur (stockage local) les articles ajoutés et la destination choisie. Ces données restent sur votre appareil, ne sont pas envoyées à Revia et servent uniquement au fonctionnement du panier. Vous pouvez les effacer en vidant les données du site dans votre navigateur.</p>
    <h2>Si cela change</h2>
    <p>Si un outil de mesure d'audience ou un traceur est ajouté, un bandeau permettra d'accepter, de refuser et de retirer son consentement aussi facilement, et cette page sera mise à jour.</p>`
  },
  {
    slug: 'cgv-cgu',
    title: 'CGV et CGU',
    desc: 'Conditions générales de vente et d’utilisation de Revia : page à compléter avant l’ouverture.',
    body: `
    <h1>Conditions générales de vente et d'utilisation</h1>
    <p>${todo('Document à rédiger et à faire valider par un juriste avant l\'ouverture au public.')}</p>
    <p>Ce site est une démonstration : aucune vente n'est possible et ces conditions ne s'appliquent pas encore.</p>
    <h2>Points à couvrir avant l'ouverture</h2>
    <ul>
      <li>Rôle de Revia en tant que marketplace et obligations d'information sur les vendeurs.</li>
      <li>Prix, frais, TVA et conditions de paiement.</li>
      <li>Livraison, restrictions par destination, douane.</li>
      <li>Droit de rétractation, garanties légales, retours, remboursements.</li>
      <li>Règles par catégorie : denrées alimentaires, cosmétiques, objets fragiles.</li>
      <li>Médiation de la consommation et règlement des litiges.</li>
      <li>Règles d'utilisation du site, propriété intellectuelle, responsabilité.</li>
    </ul>`
  }
];
