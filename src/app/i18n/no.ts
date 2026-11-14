import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Tilbake",
    copied: "Kopiert",
    copyFailed: "Kopieringen mislyktes: merk og kopier selv",
    securityCode: "Sikkerhetskode",
    yourEmail: "E-postadressen din",
    emailPlaceholder: "deg@epost.no",
    language: "Språk",
    emailLanguage: "Språk i e-posten",
    tooOld: "Denne nettleseren er for gammel for Sigill. Oppdater den, eller bruk en ny versjon av Safari, Chrome, Edge eller Firefox.",
  },

  home: {
    lead: "Private meldinger via vanlig e-post. Bare den du skriver til, kan lese dem.",
    choicesLabel: "Hva vil du gjøre?",
    sendTitle: "Send en sikker melding",
    sendText: "Skriv fortrolig til noen",
    receiveTitle: "Motta sikre meldinger",
    receiveText: "Få din egen sikre lenke på 30 sekunder",
    howTitle: "Slik fungerer det",
    step1Strong: "Mottakeren oppretter en innboks",
    step1: " med en passnøkkel: Face ID, fingeravtrykk eller enhetens PIN-kode. Ingen konto, ikke noe passord.",
    step2Strong: "Mottakeren deler den sikre lenken sin",
    step2: " med alle som skal kunne skrive til vedkommende.",
    step3Strong: "Meldingene sendes som lenker i vanlige e-poster.",
    step3: " De krypteres i nettleseren din, og bare mottakerens passnøkkel kan åpne dem.",
    nothingStored: "Ingenting lagres på noen server. ",
    wontOpen: "Har du en meldingslenke som ikke vil åpnes?",
  },

  send: {
    title: "Send en sikker melding",
    lead: "For å skrive sikkert trenger du mottakerens sikre lenke.",
    haveLink: "Jeg har mottakerens sikre lenke",
    pasteLabel: "Lim inn lenken her",
    pasteHelp: "Eller bare klikk på lenken i e-posten fra mottakeren.",
    notALink: "Det ser ikke ut som en sikker lenke. Den skal inneholde «#to=».",
    noLinkYet: "Mottakeren har ingen ennå",
    noLinkText: "Send en kort invitasjon. Mottakeren oppretter innboksen sin på et halvt minutt og sender lenken tilbake til deg.",
    theirEmail: "Mottakerens e-postadresse",
    theirEmailPlaceholder: "mottaker@epost.no",
    yourEmailHelp: "Så lenken kan sendes rett tilbake til deg.",
    ask: "Spør på e-post",
    copyInvitation: "Kopier invitasjonen",
    asked: "E-postprogrammet ditt skal åpnes med invitasjonen klar til sending. Når du får svar med den sikre lenken, klikker du bare på den for å skrive meldingen din.",
  },

  compose: {
    title: (email?: string) => (email ? `Sikker melding til ${email}` : "Sikker melding til eieren av denne lenken"),
    lead: "Skriv meldingen din nedenfor. Den krypteres på denne enheten før den sendes.",
    messageLabel: "Melding",
    placeholder: "Skriv meldingen din…",
    sendEmail: "Send på e-post",
    copyInstead: "Kopier i stedet",
    encryptsAsYouType: "Meldingen krypteres mens du skriver.",
    encrypted: (email?: string) => (email ? `Kryptert. Bare ${email} kan lese den.` : "Kryptert. Bare eieren av denne lenken kan lese den."),
    tooLongForMailto: "Den er lang, så den kopieres, og du limer den inn i e-posten.",
    sent: (email?: string) =>
      "E-postprogrammet ditt skal åpnes med meldingen klar. Bare trykk Send. " +
      (email ? `Åpnet ingenting seg? Meldingen er kopiert: lim den inn i en ny e-post til ${email}.` : "Åpnet ingenting seg? Meldingen er kopiert: lim den inn i en ny e-post."),
    copiedForPaste: "Meldingen er kopiert. Lim den inn i e-posten som åpnes (⌘V eller Ctrl+V), og trykk Send.",
    codeHelp: (email?: string) =>
      `For ekstra sikkerhet kan du spørre ${email ?? "mottakeren"} på telefon eller ansikt til ansikt om innboksen viser samme kode. ` +
      "Stemmer den, har ingen byttet ut lenken underveis.",
    replyOn: "Sikkert svar er på. ",
    replyOnText: (email?: string) => `${email ?? "Mottakeren"} kan svare med ett klikk, og svaret krypteres for innboksen din. `,
    replyRemove: "Fjern",
    replyAdd: "La mottakeren svare sikkert",
    replyAddHelp: "Legger den sikre innboksen din til i meldingen, så svaret også blir kryptert. Du bekrefter med passnøkkelen din.",
    replyNoInbox: "Har du ingen sikker innboks ennå? Opprett en nå: det krever bare én bekreftelse med passnøkkel, og meldingen din blir værende som den er. ",
    replyCreate: "Opprett innboksen min",
    brokenTitle: "Denne sikre lenken er ufullstendig",
    brokenText: "En del av lenken ser ut til å mangle. E-postprogrammer deler noen ganger opp lange lenker. Be personen sende den sikre lenken sin på nytt, eller kopier hele lenken og lim den inn på ",
    brokenSendPage: "Send-siden",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} vil gjerne sende deg noe på en sikker måte. Opprett innboksen din nedenfor og send lenken din. Det tar bare et øyeblikk.`,
    setupTitle: "Opprett din sikre innboks",
    setupLead: "Innboksen din beskyttes av en passnøkkel i passordbehandleren din. Ingen konto og ikke noe passord å huske.",
    emailHelp: "Den legges til i lenken din, så meldinger automatisk adresseres til deg.",
    create: "Opprett innboksen min",
    emailMissing: "Fyll inn e-postadressen din først.",
    forget: "Glem innboksen i denne nettleseren",
    unlock: "Jeg har allerede en innboks: vis lenken min",
    fact1: "Du blir bedt om å lagre en passnøkkel. Bekreft med Face ID, fingeravtrykk eller enhetens PIN-kode.",
    fact2: "Passnøkkelen synkroniseres til de andre enhetene dine (iCloud-nøkkelring, Google Passordbehandling, 1Password…), så du kan åpne meldinger hvor som helst.",
    fact3Strong: "Ikke slett passnøkkelen:",
    fact3: " meldinger som sendes til denne innboksen, kan bare åpnes med den.",
    factRemembered: "Nettleseren husker den sikre lenken din, så du kan dele den uten passnøkkelen. Selve nøkkelen blir værende i passnøkkelen.",
    readyTitle: "Innboksen din er klar",
    linkTitle: "Din sikre lenke",
    readyLead: "Alle som har denne lenken, kan sende deg meldinger som bare du kan lese. Den er trygg å dele: den kan ikke brukes til å lese noe.",
    linkLabel: "Din sikre lenke",
    sendLinkTo: (email: string) => `Send lenken min til ${email}`,
    shareLink: "Del lenken min på e-post",
    copyLink: "Kopier lenken",
    shared: "E-postprogrammet ditt skal åpnes med lenken din klar til sending.",
    linkEmailHelp: "Legges til i lenken, så meldinger automatisk adresseres til deg.",
    codeHelp: "De som skriver til deg, ser denne koden ved siden av navnet ditt. Hvis dere leser den opp for hverandre og den stemmer, vet de at lenken virkelig er din.",
    signatureTitle: "Legg den til i e-postsignaturen din",
    signatureLead: "Da kan alle som får e-post fra deg, svare sikkert med ett klikk.",
    copySignature: "Kopier signaturen",
    signatureHelp: "Lim den inn i signaturinnstillingene: i Gmail under Innstillinger → Signatur, i Outlook under Innstillinger → E-post → Skriv og svar, i Apple Mail under Innstillinger → Signaturer.",
  },

  open: {
    pasteTitle: "Åpne en sikker melding",
    pasteLead: "Hvis det ikke fungerte å klikke på lenken i e-posten, kopierer du hele lenken og limer den inn her.",
    pasteLabel: "Lim inn meldingslenken",
    notALink: "Det ser ikke ut som en meldingslenke. Den skal inneholde «#m=».",
    incompleteTitle: "Denne meldingslenken er ufullstendig",
    incomplete: "En del av lenken ser ut til å mangle. E-postprogrammer deler noen ganger opp lange lenker. Kopier hele lenken fra e-posten og lim den inn nedenfor, eller be avsenderen sende den på nytt.",
    damaged: "Denne meldingslenken er ufullstendig eller skadet. E-postprogrammer deler noen ganger opp lange lenker. Kopier hele lenken fra e-posten og lim den inn nedenfor, eller be avsenderen sende den på nytt.",
    wrongInbox: "Denne meldingen ble ikke sendt til innboksen du låste opp. Hvis du har flere passnøkler for Sigill, kan du prøve igjen og velge en annen.",
    receivedTitle: "Du har fått en sikker melding",
    receivedLead: "Den kan bare åpnes med passnøkkelen til den sikre innboksen din.",
    instructions: "Klikk på knappen og bekreft med Face ID, fingeravtrykk eller enhetens PIN-kode.",
    openButton: "Åpne meldingen",
    notForYou: "Har du ingen sikker innboks? Da var ikke denne meldingen ment for deg, eller avsenderen brukte feil lenke.",
    messageTitle: "Din sikre melding",
    from: (email: string) => `Fra ${email}`,
    reply: "Svar sikkert",
    copyText: "Kopier teksten",
    noReply: "Avsenderen la ikke ved noen adresse for sikkert svar. For å svare sikkert kan du be om avsenderens sikre lenke.",
    staysEncrypted: "Meldingen forblir kryptert i e-posten din. Åpne lenken igjen når du vil lese den. ",
    showMyLink: "Vis min sikre lenke",
  },

  passkey: {
    cancelled: "Forespørselen om passnøkkel ble avbrutt. Ingenting er endret, så du kan bare prøve igjen.",
    prfUnsupported:
      "Nettleseren eller passordbehandleren din kan ikke håndtere en sikker innboks ennå. Prøv Safari, Chrome eller Edge med enhetens innebygde passnøkler, eller en nyere versjon av 1Password eller Bitwarden.",
    unavailable: "Denne nettleseren støtter ikke passnøkler. Bruk en oppdatert versjon av Safari, Chrome, Edge eller Firefox.",
    failed: (details: string) => `Noe gikk galt med passnøkkelen: ${details}`,
  },

  mail: {
    messageSubject: "En sikker melding til deg",
    messageBody: (link: string) =>
      "Hei!\n\n" +
      "Jeg har sendt deg en sikker melding. Klikk på lenken for å åpne den med passnøkkelen din:\n\n" +
      `${link}\n\n` +
      "Bare du kan lese den: den er kryptert, og nøkkelen forlater aldri passordbehandleren din.",
    inviteSubject: "Kan jeg sende deg noe på en sikker måte?",
    inviteBody: (link: string) =>
      "Hei!\n\n" +
      "Jeg vil gjerne sende deg noe fortrolig. Opprett en gratis sikker innboks. " +
      "Det tar et halvt minutt, krever ingen konto, og bare du kan lese det jeg sender:\n\n" +
      `${link}\n\n` +
      "Send meg den sikre lenken din når du er ferdig.\n\n" +
      "Takk!",
    linkSubject: "Min sikre lenke",
    linkBody: (link: string) =>
      "Hei!\n\n" +
      "Her er min sikre lenke. Bruk den til å sende meg fortrolige meldinger som bare jeg kan lese:\n\n" +
      `${link}\n\n` +
      "Takk!",
    signature: "Send meg en sikker melding",
    signatureTagline: "Ende-til-ende-kryptert med Sigill",
  },
};
