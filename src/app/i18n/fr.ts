import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Retour",
    copied: "Copié",
    copyFailed: "Échec de la copie : sélectionnez le texte et copiez-le vous-même",
    securityCode: "Code de sécurité",
    yourEmail: "Votre adresse e-mail",
    emailPlaceholder: "vous@email.com",
    language: "Langue",
    emailLanguage: "Langue de l'e-mail",
    settings: "Paramètres",
    rememberPeople: "Les retenir dans ce navigateur",
    theme: "Thème",
    themeAuto: "Comme l'appareil",
    themeLight: "Clair",
    themeDark: "Sombre",
    tooOld: "Ce navigateur est trop ancien pour Sigill. Mettez-le à jour ou utilisez une version récente de Safari, Chrome, Edge ou Firefox.",
  },

  home: {
    lead: "Des messages privés par simple e-mail. Seul votre destinataire peut les lire.",
    choicesLabel: "Que voulez-vous faire ?",
    sendTitle: "Envoyer un message sécurisé",
    sendText: "Écrire à quelqu'un en toute confidentialité",
    receiveTitle: "Recevoir des messages sécurisés",
    receiveText: "Obtenez votre lien sécurisé en 30 secondes",
    howTitle: "Comment ça marche",
    step1Strong: "Le destinataire crée une boîte de réception",
    step1: " avec une clé d'accès : Face ID, empreinte digitale ou code de l'appareil. Ni compte, ni mot de passe.",
    step2Strong: "Il partage son lien sécurisé",
    step2: " avec toutes les personnes qui doivent pouvoir lui écrire.",
    step3Strong: "Les messages voyagent sous forme de liens dans des e-mails ordinaires.",
    step3: " Ils sont chiffrés dans votre navigateur et seule la clé d'accès du destinataire peut les ouvrir.",
    nothingStored: "Rien n'est stocké sur aucun serveur. ",
    wontOpen: "Un lien de message ne s'ouvre pas ?",
  },

  send: {
    title: "Envoyer un message sécurisé",
    lead: "Pour écrire en toute sécurité, il vous faut le lien sécurisé du destinataire.",
    contactsTitle: "Personnes avec qui vous échangez",
    stopRemembering: "Ne plus retenir les personnes dans ce navigateur",
    confirmForget: "Oublier tout le monde dans la liste ?",
    confirmStop: "Ne plus retenir les personnes et oublier tout le monde dans la liste ?",
    cancel: "Annuler",
    forgetContacts: "Oublier tout le monde",
    contactsHelp: "Conservé dans ce navigateur uniquement. Leurs liens ne peuvent rien ouvrir, mais ils montrent avec qui vous échangez.",
    haveLink: "J'ai son lien sécurisé",
    pasteLabel: "Collez le lien ici",
    pasteHelp: "Ou cliquez simplement sur le lien dans son e-mail.",
    notALink: "Cela ne ressemble pas à un lien sécurisé. Il doit contenir « #to= ».",
    noLinkYet: "La personne n'en a pas encore",
    noLinkText: "Envoyez-lui une courte invitation. Elle crée sa boîte de réception en trente secondes et vous renvoie son lien.",
    theirEmail: "Son adresse e-mail",
    theirEmailPlaceholder: "nom@email.com",
    yourEmailOptional: "Votre adresse e-mail (facultatif)",
    otherAddress: "Une autre adresse…",
    yourEmailHelp: "Pour que la personne puisse vous renvoyer son lien directement.",
    ask: "Demander par e-mail",
    copyInvitation: "Copier l'invitation",
    asked: "Votre messagerie devrait s'ouvrir avec l'invitation prête à partir. Quand la personne vous répondra avec son lien sécurisé, cliquez dessus pour écrire votre message.",
  },

  compose: {
    title: (email?: string) => (email ? `Message sécurisé pour ${email}` : "Message sécurisé pour le titulaire de ce lien"),
    lead: "Écrivez votre message ci-dessous. Il est chiffré sur cet appareil avant même de le quitter.",
    messageLabel: "Message",
    placeholder: "Écrivez votre message…",
    sendEmail: "Envoyer par e-mail",
    copyInstead: "Copier plutôt",
    encryptsAsYouType: "Votre message est chiffré au fil de la saisie.",
    encrypted: (email?: string) => (email ? `Chiffré. Lisible uniquement par ${email}.` : "Chiffré. Lisible uniquement par le titulaire de ce lien."),
    tooLongForMailto: "Il est long : il sera donc copié pour que vous le colliez dans l'e-mail.",
    sent: (email?: string) =>
      "Votre messagerie devrait s'ouvrir avec le message prêt. Il ne reste qu'à cliquer sur Envoyer. " +
      (email
        ? `Rien ne s'est ouvert ? Le message a été copié : collez-le dans un nouvel e-mail à ${email}.`
        : "Rien ne s'est ouvert ? Le message a été copié : collez-le dans un nouvel e-mail."),
    copiedForPaste: "Votre message a été copié. Collez-le dans l'e-mail qui s'ouvre (⌘V ou Ctrl+V) et cliquez sur Envoyer.",
    codeHelp: (email?: string) =>
      `Pour plus de certitude, demandez à ${email ?? "votre destinataire"} par téléphone ou de vive voix si sa boîte de réception affiche le même code. ` +
      "S'il correspond, personne n'a remplacé le lien en chemin.",
    replyOn: "Réponse sécurisée activée. ",
    keyChangedTitle: "Ce n'est pas le lien que vous avez utilisé auparavant",
    keyChanged: (email: string) => `Le lien que vous utilisiez pour ${email} avait une autre clé. Cette personne a peut-être créé une nouvelle boîte, ou quelqu'un se fait passer pour elle. Avant d'écrire, comparez les codes de sécurité avec ${email} par un autre moyen, en personne ou par téléphone par exemple.`,
    knownCode: "Code utilisé auparavant",
    newCode: "Code de ce lien",
    useNew: "Utiliser le nouveau lien",
    useKnown: "Utiliser le lien que je connais",
    replyAddress: "Les réponses vont à",
    replyOnText: (email?: string) => `${email ?? "Votre destinataire"} peut répondre en un clic, et la réponse sera chiffrée pour votre boîte de réception. `,
    replyRemove: "Retirer",
    replyAdd: "Permettre une réponse sécurisée",
    replyAddHelp: "Ajoute votre boîte de réception sécurisée au message, pour que la réponse soit chiffrée elle aussi. Vous confirmez avec votre clé d'accès.",
    replyNoInbox: "Pas encore de boîte de réception sécurisée ? Créez-en une maintenant : une seule confirmation avec votre clé d'accès suffit, et votre message reste tel quel. ",
    replyCreate: "Créer ma boîte de réception",
    replyHaveInbox: "J'ai déjà une boîte de réception",
    brokenTitle: "Ce lien sécurisé est incomplet",
    brokenText: "Une partie du lien semble manquer. Les messageries coupent parfois les liens longs. Demandez à la personne de renvoyer son lien sécurisé, ou copiez le lien en entier et collez-le sur la ",
    brokenSendPage: "page Envoyer",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} souhaite vous envoyer quelque chose en toute sécurité. Créez votre boîte de réception ci-dessous et envoyez-lui votre lien. Cela ne prend qu'un instant.`,
    setupTitle: "Créez votre boîte de réception sécurisée",
    setupLead: "Votre boîte de réception est protégée par une clé d'accès dans votre gestionnaire de mots de passe. Pas de compte, pas de mot de passe à retenir.",
    emailHelp: "Elle est ajoutée à votre lien pour que les messages vous soient adressés automatiquement.",
    create: "Créer ma boîte de réception",
    emailMissing: "Saisissez d'abord votre adresse e-mail.",
    addAddress: "Ajouter une autre adresse…",
    addTitle: "Ajouter une autre adresse",
    backToLink: "Retour à mon lien",
    unnamed: "Boîte sans adresse",
    forget: "Oublier cette boîte de réception sur ce navigateur",
    unlock: "J'ai déjà une boîte de réception : afficher mon lien",
    fact1: "On vous demandera d'enregistrer une clé d'accès. Confirmez avec Face ID, votre empreinte digitale ou le code de votre appareil.",
    fact2: "Votre clé d'accès se synchronise sur vos autres appareils (Trousseau iCloud, Gestionnaire de mots de passe de Google, 1Password…) : vous pouvez ouvrir vos messages partout.",
    fact3Strong: "Ne supprimez pas la clé d'accès :",
    fact3: " les messages envoyés à cette boîte de réception ne peuvent être ouverts qu'avec elle.",
    factRemembered: "Ce navigateur mémorise votre lien sécurisé : vous pouvez le partager sans clé d'accès. La clé elle-même reste dans la clé d'accès.",
    readyTitle: "Votre boîte de réception est prête",
    linkTitle: "Votre lien sécurisé",
    readyLead: "Toute personne disposant de ce lien peut vous envoyer des messages lisibles par vous uniquement. Vous pouvez le partager sans crainte : il ne permet de rien lire.",
    linkLabel: "Votre lien sécurisé",
    sendLinkTo: (email: string) => `Envoyer mon lien à ${email}`,
    shareLink: "Partager mon lien par e-mail",
    copyLink: "Copier le lien",
    shared: "Votre messagerie devrait s'ouvrir avec votre lien prêt à partir.",
    linkEmailHelp: "Elle est ajoutée au lien pour que les messages vous soient adressés automatiquement.",
    codeHelp: "Les personnes qui vous écrivent voient ce code à côté de votre nom. Si vous vous le lisez mutuellement et qu'il correspond, elles savent que le lien est bien le vôtre.",
    signatureTitle: "Ajoutez-le à votre signature e-mail",
    signatureLead: "Ainsi, toute personne qui reçoit un e-mail de vous peut vous répondre en toute sécurité, en un clic.",
    copySignature: "Copier la signature",
    signatureHelp: "Collez-la dans les réglages de signature : dans Gmail sous Paramètres → Signature, dans Outlook sous Paramètres → Courrier → Rédiger et répondre, dans Apple Mail sous Réglages → Signatures.",
  },

  open: {
    pasteTitle: "Ouvrir un message sécurisé",
    pasteLead: "Si le lien dans l'e-mail n'a pas fonctionné, copiez-le en entier et collez-le ici.",
    pasteLabel: "Collez le lien du message",
    notALink: "Cela ne ressemble pas à un lien de message. Il doit contenir « #m= ».",
    incompleteTitle: "Ce lien de message est incomplet",
    incomplete: "Une partie du lien semble manquer. Les messageries coupent parfois les liens longs. Copiez le lien complet depuis l'e-mail et collez-le ci-dessous, ou demandez à l'expéditeur de le renvoyer.",
    damaged: "Ce lien de message est incomplet ou endommagé. Les messageries coupent parfois les liens longs. Copiez le lien complet depuis l'e-mail et collez-le ci-dessous, ou demandez à l'expéditeur de le renvoyer.",
    wrongInbox: "Ce message n'a pas été envoyé à la boîte de réception que vous avez déverrouillée. Il a été écrit à un autre lien sécurisé, peut-être l'un de vos anciens liens. Si vous avez plusieurs clés d'accès Sigill, réessayez et choisissez-en une autre. Sinon, demandez à l'expéditeur d'écrire à votre lien actuel.",
    wrongInboxOrDamaged: "Ce message n'a pas pu être ouvert avec la boîte de réception que vous avez déverrouillée. Soit il a été envoyé à une autre boîte, soit le lien a été endommagé en chemin. Si vous avez plusieurs clés d'accès Sigill, réessayez et choisissez-en une autre. Sinon, copiez le lien complet depuis l'e-mail et collez-le ci-dessous.",
    receivedTitle: "Vous avez reçu un message sécurisé",
    receivedLead: "Il ne peut être ouvert qu'avec la clé d'accès de votre boîte de réception sécurisée.",
    instructions: "Cliquez sur le bouton et confirmez avec Face ID, votre empreinte digitale ou le code de votre appareil.",
    openButton: "Ouvrir le message",
    notForYou: "Vous n'avez pas de boîte de réception sécurisée ? Alors ce message ne vous était pas destiné, ou l'expéditeur a utilisé le mauvais lien.",
    messageTitle: "Votre message sécurisé",
    keyChanged: (email: string) => `Ce message dit venir de ${email}, mais son lien de réponse n'est pas celui que vous connaissez pour cette personne. Quelqu'un se fait peut-être passer pour elle.`,
    from: (email: string) => `De ${email}`,
    reply: "Répondre en toute sécurité",
    copyText: "Copier le texte",
    noReply: "L'expéditeur n'a pas indiqué d'adresse de réponse sécurisée. Pour lui répondre en toute sécurité, demandez-lui son lien sécurisé.",
    staysEncrypted: "Ce message reste chiffré dans votre messagerie. Rouvrez le lien chaque fois que vous voulez le lire. ",
    showMyLink: "Afficher mon lien sécurisé",
  },

  passkey: {
    cancelled: "La demande de clé d'accès a été annulée. Rien n'a changé : vous pouvez simplement réessayer.",
    prfUnsupported:
      "Votre navigateur ou votre gestionnaire de mots de passe ne peut pas encore accueillir une boîte de réception sécurisée. Essayez Safari, Chrome ou Edge avec les clés d'accès intégrées à votre appareil, ou une version récente de 1Password ou Bitwarden.",
    unavailable: "Ce navigateur ne prend pas en charge les clés d'accès. Utilisez une version à jour de Safari, Chrome, Edge ou Firefox.",
    notSigill:
      "Cette clé d’accès n’est pas une boîte Sigill : elle appartient à un autre site à la même adresse. Rien n’a changé. Réessayez en choisissant la clé qui porte votre adresse e-mail.",
    failed: (details: string) => `Un problème est survenu avec la clé d'accès : ${details}`,
  },

  mail: {
    messageSubject: "Un message sécurisé pour vous",
    messageBody: (link: string) =>
      "Bonjour,\n\n" +
      "Je vous ai envoyé un message sécurisé. Cliquez sur le lien pour l'ouvrir avec votre clé d'accès :\n\n" +
      `${link}\n\n` +
      "Personne d'autre ne peut le lire : il est chiffré, et la clé ne quitte jamais votre gestionnaire de mots de passe.",
    inviteSubject: "Puis-je vous envoyer quelque chose en toute sécurité ?",
    inviteBody: (link: string) =>
      "Bonjour,\n\n" +
      "J'aimerais vous envoyer quelque chose de confidentiel. Pourriez-vous créer une boîte de réception sécurisée gratuite ? " +
      "Cela prend trente secondes, sans créer de compte, et personne d'autre que vous ne pourra lire ce que je vous enverrai :\n\n" +
      `${link}\n\n` +
      "Une fois que c'est fait, envoyez-moi votre lien sécurisé.\n\n" +
      "Merci !",
    linkSubject: "Mon lien sécurisé",
    linkBody: (link: string) =>
      "Bonjour,\n\n" +
      "Voici mon lien sécurisé. Utilisez-le pour m'envoyer des messages confidentiels que personne d'autre que moi ne pourra lire :\n\n" +
      `${link}\n\n` +
      "Merci !",
    signature: "Envoyez-moi un message sécurisé",
    signatureTagline: "Chiffré de bout en bout avec Sigill",
  },
};
