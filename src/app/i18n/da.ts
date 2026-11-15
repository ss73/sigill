import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Tilbage",
    copied: "Kopieret",
    copyFailed: "Kopiering mislykkedes: markér og kopiér selv",
    securityCode: "Sikkerhedskode",
    yourEmail: "Din e-mailadresse",
    emailPlaceholder: "dig@email.dk",
    language: "Sprog",
    emailLanguage: "Sprog i e-mailen",
    tooOld: "Denne browser er for gammel til Sigill. Opdater den, eller brug en nyere Safari, Chrome, Edge eller Firefox.",
  },

  home: {
    lead: "Private beskeder via almindelig e-mail. Kun den, du skriver til, kan læse dem.",
    choicesLabel: "Hvad vil du gøre?",
    sendTitle: "Send en sikker besked",
    sendText: "Skriv fortroligt til nogen",
    receiveTitle: "Modtag sikre beskeder",
    receiveText: "Få dit eget sikre link på 30 sekunder",
    howTitle: "Sådan virker det",
    step1Strong: "Modtageren opretter en indbakke",
    step1: " med en adgangsnøgle: Face ID, fingeraftryk eller enhedens pinkode. Ingen konto, ingen adgangskode.",
    step2Strong: "Modtageren deler sit sikre link",
    step2: " med alle, der skal kunne skrive til vedkommende.",
    step3Strong: "Beskeder sendes som links i almindelige e-mails.",
    step3: " De krypteres i din browser, og kun modtagerens adgangsnøgle kan åbne dem.",
    nothingStored: "Intet gemmes på nogen server. ",
    wontOpen: "Har du et beskedlink, der ikke vil åbne?",
  },

  send: {
    title: "Send en sikker besked",
    lead: "For at skrive sikkert skal du bruge modtagerens sikre link.",
    haveLink: "Jeg har modtagerens sikre link",
    pasteLabel: "Indsæt linket her",
    pasteHelp: "Eller klik bare på linket i modtagerens e-mail.",
    notALink: "Det ligner ikke et sikkert link. Det skal indeholde »#to=«.",
    noLinkYet: "Modtageren har ikke et endnu",
    noLinkText: "Send en kort invitation. Modtageren opretter sin indbakke på et halvt minut og sender sit link tilbage til dig.",
    theirEmail: "Modtagerens e-mailadresse",
    theirEmailPlaceholder: "modtager@email.dk",
    yourEmailHelp: "Så linket kan sendes direkte tilbage til dig.",
    ask: "Spørg via e-mail",
    copyInvitation: "Kopiér invitation",
    asked: "Dit mailprogram burde åbne med invitationen klar til at sende. Når du får svar med det sikre link, klikker du bare på det for at skrive din besked.",
  },

  compose: {
    title: (email?: string) => (email ? `Sikker besked til ${email}` : "Sikker besked til ejeren af dette link"),
    lead: "Skriv din besked herunder. Den krypteres på denne enhed, før den forlader den.",
    messageLabel: "Besked",
    placeholder: "Skriv din besked…",
    sendEmail: "Send via e-mail",
    copyInstead: "Kopiér i stedet",
    encryptsAsYouType: "Din besked krypteres, mens du skriver.",
    encrypted: (email?: string) => (email ? `Krypteret. Kun ${email} kan læse den.` : "Krypteret. Kun ejeren af dette link kan læse den."),
    tooLongForMailto: "Den er lang, så den bliver kopieret, og du indsætter den i e-mailen.",
    sent: (email?: string) =>
      "Dit mailprogram burde åbne med beskeden klar. Tryk bare på Send. " +
      (email ? `Åbnede intet? Beskeden er kopieret: indsæt den i en ny e-mail til ${email}.` : "Åbnede intet? Beskeden er kopieret: indsæt den i en ny e-mail."),
    copiedForPaste: "Din besked er kopieret. Indsæt den i den e-mail, der åbner (⌘V eller Ctrl+V), og tryk på Send.",
    codeHelp: (email?: string) =>
      `For ekstra sikkerhed kan du spørge ${email ?? "modtageren"} over telefonen eller ansigt til ansigt, om indbakken viser den samme kode. ` +
      "Hvis den passer, har ingen byttet linket ud undervejs.",
    replyOn: "Sikkert svar er slået til. ",
    replyOnText: (email?: string) => `${email ?? "Modtageren"} kan svare med ét klik, og svaret krypteres til din indbakke. `,
    replyRemove: "Fjern",
    replyAdd: "Lad modtageren svare sikkert",
    replyAddHelp: "Føjer din sikre indbakke til beskeden, så svaret også bliver krypteret. Du bekræfter med din adgangsnøgle.",
    replyNoInbox: "Har du ikke en sikker indbakke endnu? Opret en nu: det kræver kun én bekræftelse med adgangsnøgle, og din besked forbliver som den er. ",
    replyCreate: "Opret min indbakke",
    replyHaveInbox: "Jeg har allerede en indbakke",
    brokenTitle: "Dette sikre link er ufuldstændigt",
    brokenText: "En del af linket ser ud til at mangle. Mailprogrammer deler nogle gange lange links op. Bed personen sende sit sikre link igen, eller kopiér hele linket og indsæt det på ",
    brokenSendPage: "Send-siden",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} vil gerne sende dig noget sikkert. Opret din indbakke herunder, og send dit link. Det tager kun et øjeblik.`,
    setupTitle: "Opret din sikre indbakke",
    setupLead: "Din indbakke er beskyttet af en adgangsnøgle i din adgangskodeadministrator. Der er ingen konto og ingen adgangskode at huske.",
    emailHelp: "Den føjes til dit link, så beskeder automatisk bliver adresseret til dig.",
    create: "Opret min indbakke",
    emailMissing: "Indtast din e-mailadresse først.",
    forget: "Glem indbakken i denne browser",
    unlock: "Jeg har allerede en indbakke: vis mit link",
    fact1: "Du bliver bedt om at gemme en adgangsnøgle. Bekræft med Face ID, fingeraftryk eller enhedens pinkode.",
    fact2: "Din adgangsnøgle synkroniseres til dine andre enheder (iCloud-nøglering, Google Adgangskodeadministrator, 1Password…), så du kan åbne beskeder hvor som helst.",
    fact3Strong: "Slet ikke adgangsnøglen:",
    fact3: " beskeder sendt til denne indbakke kan kun åbnes med den.",
    factRemembered: "Browseren husker dit sikre link, så du kan dele det uden adgangsnøglen. Selve nøglen bliver i adgangsnøglen.",
    readyTitle: "Din indbakke er klar",
    linkTitle: "Dit sikre link",
    readyLead: "Alle med dette link kan sende dig beskeder, som kun du kan læse. Det er sikkert at dele: det kan ikke bruges til at læse noget.",
    linkLabel: "Dit sikre link",
    sendLinkTo: (email: string) => `Send mit link til ${email}`,
    shareLink: "Del mit link via e-mail",
    copyLink: "Kopiér link",
    shared: "Dit mailprogram burde åbne med dit link klar til at sende.",
    linkEmailHelp: "Føjes til linket, så beskeder automatisk bliver adresseret til dig.",
    codeHelp: "Dem, der skriver til dig, ser denne kode ved siden af dit navn. Hvis I læser den op for hinanden, og den passer, ved de, at linket virkelig er dit.",
    signatureTitle: "Føj det til din e-mailsignatur",
    signatureLead: "Så kan alle, der får en e-mail fra dig, svare sikkert med ét klik.",
    copySignature: "Kopiér signatur",
    signatureHelp: "Indsæt den i dine signaturindstillinger: i Gmail under Indstillinger → Signatur, i Outlook under Indstillinger → Mail → Skriv og svar, i Apple Mail under Indstillinger → Signaturer.",
  },

  open: {
    pasteTitle: "Åbn en sikker besked",
    pasteLead: "Hvis det ikke virkede at klikke på linket i e-mailen, så kopiér hele linket og indsæt det her.",
    pasteLabel: "Indsæt beskedlinket",
    notALink: "Det ligner ikke et beskedlink. Det skal indeholde »#m=«.",
    incompleteTitle: "Dette beskedlink er ufuldstændigt",
    incomplete: "En del af linket ser ud til at mangle. Mailprogrammer deler nogle gange lange links op. Kopiér hele linket fra e-mailen og indsæt det herunder, eller bed afsenderen sende det igen.",
    damaged: "Dette beskedlink er ufuldstændigt eller beskadiget. Mailprogrammer deler nogle gange lange links op. Kopiér hele linket fra e-mailen og indsæt det herunder, eller bed afsenderen sende det igen.",
    wrongInbox: "Denne besked blev ikke sendt til den indbakke, du låste op. Hvis du har mere end én adgangsnøgle til Sigill, kan du prøve igen og vælge en anden.",
    receivedTitle: "Du har modtaget en sikker besked",
    receivedLead: "Den kan kun åbnes med adgangsnøglen til din sikre indbakke.",
    instructions: "Klik på knappen, og bekræft med Face ID, fingeraftryk eller enhedens pinkode.",
    openButton: "Åbn besked",
    notForYou: "Har du ikke en sikker indbakke? Så var beskeden ikke til dig, eller afsenderen brugte det forkerte link.",
    messageTitle: "Din sikre besked",
    from: (email: string) => `Fra ${email}`,
    reply: "Svar sikkert",
    copyText: "Kopiér tekst",
    noReply: "Afsenderen har ikke angivet en adresse til sikkert svar. Hvis du vil svare sikkert, så bed om afsenderens sikre link.",
    staysEncrypted: "Beskeden forbliver krypteret i din e-mail. Åbn linket igen, når du vil læse den. ",
    showMyLink: "Vis mit sikre link",
  },

  passkey: {
    cancelled: "Anmodningen om adgangsnøgle blev annulleret. Intet er ændret, så du kan bare prøve igen.",
    prfUnsupported:
      "Din browser eller adgangskodeadministrator kan ikke håndtere en sikker indbakke endnu. Prøv Safari, Chrome eller Edge med enhedens indbyggede adgangsnøgler, eller en nyere version af 1Password eller Bitwarden.",
    unavailable: "Denne browser understøtter ikke adgangsnøgler. Brug en opdateret Safari, Chrome, Edge eller Firefox.",
    failed: (details: string) => `Noget gik galt med adgangsnøglen: ${details}`,
  },

  mail: {
    messageSubject: "En sikker besked til dig",
    messageBody: (link: string) =>
      "Hej!\n\n" +
      "Jeg har sendt dig en sikker besked. Klik på linket for at åbne den med din adgangsnøgle:\n\n" +
      `${link}\n\n` +
      "Kun du kan læse den: den er krypteret, og nøglen forlader aldrig din adgangskodeadministrator.",
    inviteSubject: "Må jeg sende dig noget sikkert?",
    inviteBody: (link: string) =>
      "Hej!\n\n" +
      "Jeg vil gerne sende dig noget fortroligt. Opret venligst en gratis sikker indbakke. " +
      "Det tager et halvt minut, kræver ingen konto, og kun du kan læse det, jeg sender:\n\n" +
      `${link}\n\n` +
      "Send mig dit sikre link, når du er færdig.\n\n" +
      "Tak!",
    linkSubject: "Mit sikre link",
    linkBody: (link: string) =>
      "Hej!\n\n" +
      "Her er mit sikre link. Brug det til at sende mig fortrolige beskeder, som kun jeg kan læse:\n\n" +
      `${link}\n\n` +
      "Tak!",
    signature: "Send mig en sikker besked",
    signatureTagline: "End-to-end-krypteret med Sigill",
  },
};
