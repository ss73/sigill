import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Indietro",
    copied: "Copiato",
    copyFailed: "Copia non riuscita: seleziona e copia a mano",
    securityCode: "Codice di sicurezza",
    yourEmail: "Il tuo indirizzo e-mail",
    emailPlaceholder: "nome@email.com",
    language: "Lingua",
    emailLanguage: "Lingua dell'e-mail",
    theme: "Tema",
    themeAuto: "Come il dispositivo",
    themeLight: "Chiaro",
    themeDark: "Scuro",
    tooOld: "Questo browser è troppo vecchio per Sigill. Aggiornalo oppure usa una versione recente di Safari, Chrome, Edge o Firefox.",
  },

  home: {
    lead: "Messaggi privati tramite la normale e-mail. Solo la persona a cui scrivi può leggerli.",
    choicesLabel: "Cosa vuoi fare?",
    sendTitle: "Invia un messaggio sicuro",
    sendText: "Scrivi a qualcuno in modo riservato",
    receiveTitle: "Ricevi messaggi sicuri",
    receiveText: "Ottieni il tuo link sicuro in 30 secondi",
    howTitle: "Come funziona",
    step1Strong: "Il destinatario crea una casella sicura",
    step1: " con una passkey: Face ID, impronta digitale o PIN del dispositivo. Nessun account, nessuna password.",
    step2Strong: "Condivide il suo link sicuro",
    step2: " con chiunque debba potergli scrivere.",
    step3Strong: "I messaggi viaggiano come link in normali e-mail.",
    step3: " Vengono crittografati nel tuo browser e solo la passkey del destinatario può aprirli.",
    nothingStored: "Nessun dato viene salvato su alcun server. ",
    wontOpen: "Hai un link a un messaggio che non si apre?",
  },

  send: {
    title: "Invia un messaggio sicuro",
    lead: "Per scrivere in modo sicuro ti serve il link sicuro del destinatario.",
    haveLink: "Ho il suo link sicuro",
    pasteLabel: "Incolla qui il link",
    pasteHelp: "Oppure fai semplicemente clic sul link nella sua e-mail.",
    notALink: "Non sembra un link sicuro. Dovrebbe contenere «#to=».",
    noLinkYet: "Non ne ha ancora uno",
    noLinkText: "Mandagli un breve invito. Creerà la sua casella in mezzo minuto e ti rimanderà il suo link.",
    theirEmail: "Il suo indirizzo e-mail",
    theirEmailPlaceholder: "nome@email.com",
    yourEmailOptional: "Il tuo indirizzo e-mail (facoltativo)",
    yourEmailHelp: "Così può rimandarti subito il suo link.",
    ask: "Chiedi via e-mail",
    copyInvitation: "Copia invito",
    asked: "Il tuo programma di posta dovrebbe aprirsi con l'invito pronto da inviare. Quando ti risponde con il suo link sicuro, fai clic sul link per scrivere il tuo messaggio.",
  },

  compose: {
    title: (email?: string) => (email ? `Messaggio sicuro per ${email}` : "Messaggio sicuro per il titolare di questo link"),
    lead: "Scrivi qui sotto il tuo messaggio. Viene crittografato su questo dispositivo prima di lasciarlo.",
    messageLabel: "Messaggio",
    placeholder: "Scrivi il tuo messaggio…",
    sendEmail: "Invia via e-mail",
    copyInstead: "Oppure copia",
    encryptsAsYouType: "Il messaggio viene crittografato mentre scrivi.",
    encrypted: (email?: string) => (email ? `Crittografato. Solo ${email} può leggerlo.` : "Crittografato. Solo il titolare di questo link può leggerlo."),
    tooLongForMailto: "È lungo, quindi verrà copiato e potrai incollarlo nell'e-mail.",
    sent: (email?: string) =>
      "Il tuo programma di posta dovrebbe aprirsi con il messaggio pronto. Ti basta premere Invia. " +
      (email
        ? `Non si è aperto nulla? Il messaggio è stato copiato: incollalo in una nuova e-mail a ${email}.`
        : "Non si è aperto nulla? Il messaggio è stato copiato: incollalo in una nuova e-mail."),
    copiedForPaste: "Il messaggio è stato copiato. Incollalo nell'e-mail che si apre (⌘V o Ctrl+V) e premi Invia.",
    codeHelp: (email?: string) =>
      `Per maggiore sicurezza, chiedi ${email ? `a ${email}` : "al destinatario"} per telefono o di persona se nella sua casella compare lo stesso codice. ` +
      "Se corrisponde, nessuno ha sostituito il link lungo la strada.",
    replyOn: "Risposta sicura attiva. ",
    replyAddress: "Le risposte vanno a",
    replyOnText: (email?: string) => `${email ?? "Il destinatario"} può rispondere con un clic e la risposta arriverà crittografata nella tua casella. `,
    replyRemove: "Rimuovi",
    replyAdd: "Consenti una risposta sicura",
    replyAddHelp: "Aggiunge la tua casella sicura al messaggio, così anche la risposta sarà crittografata. Confermi con la tua passkey.",
    replyNoInbox: "Non hai ancora una casella sicura? Creane una ora: basta una conferma con la passkey e il tuo messaggio resta com'è. ",
    replyCreate: "Crea la mia casella",
    replyHaveInbox: "Ho già una casella",
    brokenTitle: "Questo link sicuro è incompleto",
    brokenText: "Sembra che manchi una parte del link. A volte i programmi di posta spezzano i link lunghi. Chiedi alla persona di rimandarti il suo link sicuro, oppure copia il link completo e incollalo nella ",
    brokenSendPage: "pagina Invia",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} vorrebbe inviarti qualcosa in modo sicuro. Crea qui sotto la tua casella e mandagli il tuo link. Ci vuole solo un attimo.`,
    setupTitle: "Crea la tua casella sicura",
    setupLead: "La tua casella è protetta da una passkey nel tuo gestore di password. Nessun account e nessuna password da ricordare.",
    emailHelp: "Viene aggiunto al tuo link, così i messaggi ti vengono indirizzati automaticamente.",
    create: "Crea la mia casella",
    emailMissing: "Inserisci prima il tuo indirizzo email.",
    addAddress: "Aggiungi un altro indirizzo…",
    addTitle: "Aggiungi un altro indirizzo",
    backToLink: "Torna al mio link",
    unnamed: "Casella senza indirizzo",
    forget: "Dimentica questa casella su questo browser",
    unlock: "Ho già una casella: mostra il mio link",
    fact1: "Ti verrà chiesto di salvare una passkey. Conferma con Face ID, impronta digitale o il PIN del dispositivo.",
    fact2: "La passkey si sincronizza sugli altri tuoi dispositivi (Portachiavi iCloud, Gestore delle password di Google, 1Password…), così puoi aprire i messaggi ovunque.",
    fact3Strong: "Non eliminare la passkey:",
    fact3: " i messaggi inviati a questa casella si possono aprire solo con quella.",
    factRemembered: "Questo browser ricorda il tuo link sicuro, così puoi condividerlo senza la passkey. La chiave vera e propria resta nella passkey.",
    readyTitle: "La tua casella è pronta",
    linkTitle: "Il tuo link sicuro",
    readyLead: "Chiunque abbia questo link può inviarti messaggi che solo tu puoi leggere. Puoi condividerlo tranquillamente: non serve a leggere nulla.",
    linkLabel: "Il tuo link sicuro",
    sendLinkTo: (email: string) => `Invia il mio link a ${email}`,
    shareLink: "Condividi il mio link via e-mail",
    copyLink: "Copia link",
    shared: "Il tuo programma di posta dovrebbe aprirsi con il tuo link pronto da inviare.",
    linkEmailHelp: "Viene aggiunto al link, così i messaggi ti vengono indirizzati automaticamente.",
    codeHelp: "Chi ti scrive vede questo codice accanto al tuo nome. Se ve lo leggete a vicenda e corrisponde, sa che il link è davvero tuo.",
    signatureTitle: "Aggiungilo alla tua firma e-mail",
    signatureLead: "Così chiunque riceva una tua e-mail può risponderti in modo sicuro con un clic.",
    copySignature: "Copia firma",
    signatureHelp: "Incollala nelle impostazioni della firma: in Gmail in Impostazioni → Firma, in Outlook in Impostazioni → Posta → Scrivi e rispondi, in Apple Mail in Impostazioni → Firme.",
  },

  open: {
    pasteTitle: "Apri un messaggio sicuro",
    pasteLead: "Se il clic sul link nell'e-mail non ha funzionato, copia il link completo e incollalo qui.",
    pasteLabel: "Incolla il link del messaggio",
    notALink: "Non sembra un link a un messaggio. Dovrebbe contenere «#m=».",
    incompleteTitle: "Questo link al messaggio è incompleto",
    incomplete: "Sembra che manchi una parte del link. A volte i programmi di posta spezzano i link lunghi. Copia il link completo dall'e-mail e incollalo qui sotto, oppure chiedi al mittente di rimandarlo.",
    damaged: "Questo link al messaggio è incompleto o danneggiato. A volte i programmi di posta spezzano i link lunghi. Copia il link completo dall'e-mail e incollalo qui sotto, oppure chiedi al mittente di rimandarlo.",
    wrongInbox: "Questo messaggio non è stato inviato alla casella che hai sbloccato. Se hai più di una passkey Sigill, riprova e scegline un'altra.",
    receivedTitle: "Hai ricevuto un messaggio sicuro",
    receivedLead: "Si può aprire solo con la passkey della tua casella sicura.",
    instructions: "Fai clic sul pulsante e conferma con Face ID, impronta digitale o il PIN del dispositivo.",
    openButton: "Apri messaggio",
    notForYou: "Non hai una casella sicura? Allora questo messaggio non era per te, oppure il mittente ha usato il link sbagliato.",
    messageTitle: "Il tuo messaggio sicuro",
    from: (email: string) => `Da ${email}`,
    reply: "Rispondi in modo sicuro",
    copyText: "Copia testo",
    noReply: "Il mittente non ha incluso un indirizzo di risposta sicuro. Per rispondere in modo sicuro, chiedigli il suo link sicuro.",
    staysEncrypted: "Questo messaggio resta crittografato nella tua e-mail. Riapri il link ogni volta che vuoi leggerlo. ",
    showMyLink: "Mostra il mio link sicuro",
  },

  passkey: {
    cancelled: "La richiesta della passkey è stata annullata. Non è cambiato nulla, quindi puoi semplicemente riprovare.",
    prfUnsupported:
      "Il tuo browser o gestore di password non supporta ancora una casella sicura. Prova Safari, Chrome o Edge con le passkey integrate nel dispositivo, oppure una versione recente di 1Password o Bitwarden.",
    unavailable: "Questo browser non supporta le passkey. Usa una versione aggiornata di Safari, Chrome, Edge o Firefox.",
    notSigill:
      "Questa passkey non è una casella Sigill: appartiene a un altro sito sullo stesso indirizzo. Non è cambiato nulla. Riprova e scegli la passkey con il nome del tuo indirizzo e-mail.",
    failed: (details: string) => `Qualcosa è andato storto con la passkey: ${details}`,
  },

  mail: {
    messageSubject: "Un messaggio sicuro per te",
    messageBody: (link: string) =>
      "Ciao,\n\n" +
      "ti ho inviato un messaggio sicuro. Fai clic sul link per aprirlo con la tua passkey:\n\n" +
      `${link}\n\n` +
      "Solo tu puoi leggerlo: è crittografato e la chiave non lascia mai il tuo gestore di password.",
    inviteSubject: "Posso inviarti qualcosa in modo sicuro?",
    inviteBody: (link: string) =>
      "Ciao,\n\n" +
      "vorrei inviarti qualcosa di riservato. Crea una casella sicura gratuita: " +
      "ci vuole mezzo minuto, non serve un account e solo tu potrai leggere quello che ti invio:\n\n" +
      `${link}\n\n` +
      "Quando hai fatto, mandami il tuo link sicuro.\n\n" +
      "Grazie!",
    linkSubject: "Il mio link sicuro",
    linkBody: (link: string) =>
      "Ciao,\n\n" +
      "ecco il mio link sicuro. Usalo per inviarmi messaggi riservati che solo io posso leggere:\n\n" +
      `${link}\n\n` +
      "Grazie!",
    signature: "Inviami un messaggio sicuro",
    signatureTagline: "Crittografia end-to-end con Sigill",
  },
};
