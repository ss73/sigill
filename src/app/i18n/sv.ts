import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Tillbaka",
    copied: "Kopierat",
    copyFailed: "Kunde inte kopiera: markera och kopiera själv",
    securityCode: "Säkerhetskod",
    yourEmail: "Din mejladress",
    emailPlaceholder: "du@exempel.se",
    language: "Språk",
    emailLanguage: "Språk i mejlet",
    theme: "Tema",
    themeAuto: "Som enheten",
    themeLight: "Ljust",
    themeDark: "Mörkt",
    tooOld: "Den här webbläsaren är för gammal för Sigill. Uppdatera den, eller använd en aktuell Safari, Chrome, Edge eller Firefox.",
  },

  home: {
    lead: "Privata meddelanden via vanliga mejl. Bara den du skriver till kan läsa dem.",
    choicesLabel: "Vad vill du göra?",
    sendTitle: "Skicka ett säkert meddelande",
    sendText: "Skriv konfidentiellt till någon",
    receiveTitle: "Ta emot säkra meddelanden",
    receiveText: "Skaffa din egen säkra länk på 30 sekunder",
    howTitle: "Så fungerar det",
    step1Strong: "Mottagaren skapar en inkorg",
    step1: " med en lösennyckel: Face ID, fingeravtryck eller enhetens PIN-kod. Inget konto, inget lösenord.",
    step2Strong: "Den säkra länken delas",
    step2: " med alla som ska kunna skriva till mottagaren.",
    step3Strong: "Meddelanden skickas som länkar i vanliga mejl.",
    step3: " De krypteras i din webbläsare och bara mottagarens lösennyckel kan öppna dem.",
    nothingStored: "Ingenting sparas på någon server. ",
    wontOpen: "Har du en meddelandelänk som inte vill öppnas?",
  },

  send: {
    title: "Skicka ett säkert meddelande",
    lead: "För att skriva säkert behöver du mottagarens säkra länk.",
    contactsTitle: "Personer du skriver med",
    contactsMenu: "Alternativ för listan",
    stopRemembering: "Sluta komma ihåg personer i den här webbläsaren",
    confirmForget: "Glömma alla i listan?",
    confirmStop: "Sluta komma ihåg personer och glömma alla i listan?",
    cancel: "Avbryt",
    contactsOff: "Personer du skriver med sparas inte i den här webbläsaren.",
    rememberAgain: "Kom ihåg dem igen",
    forgetContacts: "Glöm alla",
    contactsHelp: "Sparas bara i den här webbläsaren. Deras länkar kan inte öppna något, men de visar vilka du skriver med.",
    haveLink: "Jag har mottagarens säkra länk",
    pasteLabel: "Klistra in länken här",
    pasteHelp: "Eller klicka bara på länken i mottagarens mejl.",
    notALink: "Det där ser inte ut som en säker länk. Den ska innehålla ”#to=”.",
    noLinkYet: "Mottagaren har ingen än",
    noLinkText: "Skicka en kort inbjudan. Mottagaren skapar sin inkorg på en halv minut och skickar tillbaka sin länk till dig.",
    theirEmail: "Mottagarens mejladress",
    theirEmailPlaceholder: "mottagare@exempel.se",
    yourEmailOptional: "Din mejladress (valfritt)",
    otherAddress: "En annan adress…",
    yourEmailHelp: "Så att länken kan skickas direkt tillbaka till dig.",
    ask: "Fråga via mejl",
    copyInvitation: "Kopiera inbjudan",
    asked: "Ditt mejlprogram bör öppnas med inbjudan klar att skicka. När du får svar med den säkra länken klickar du bara på den för att skriva ditt meddelande.",
  },

  compose: {
    title: (email?: string) => (email ? `Säkert meddelande till ${email}` : "Säkert meddelande till ägaren av länken"),
    lead: "Skriv ditt meddelande nedan. Det krypteras på den här enheten innan det lämnar den.",
    messageLabel: "Meddelande",
    placeholder: "Skriv ditt meddelande…",
    sendEmail: "Skicka via mejl",
    copyInstead: "Kopiera i stället",
    encryptsAsYouType: "Meddelandet krypteras medan du skriver.",
    encrypted: (email?: string) => (email ? `Krypterat. Bara ${email} kan läsa det.` : "Krypterat. Bara ägaren av länken kan läsa det."),
    tooLongForMailto: "Det är långt, så det kopieras och du klistrar in det i mejlet.",
    sent: (email?: string) =>
      "Ditt mejlprogram bör öppnas med meddelandet klart. Tryck bara på Skicka. " +
      (email ? `Öppnades inget? Meddelandet har kopierats: klistra in det i ett nytt mejl till ${email}.` : "Öppnades inget? Meddelandet har kopierats: klistra in det i ett nytt mejl."),
    copiedForPaste: "Meddelandet har kopierats. Klistra in det i mejlet som öppnas (⌘V eller Ctrl+V) och tryck på Skicka.",
    codeHelp: (email?: string) =>
      `För extra säkerhet kan du fråga ${email ?? "mottagaren"} per telefon eller öga mot öga om samma kod visas i inkorgen. ` +
      "Stämmer den har ingen bytt ut länken på vägen.",
    replyOn: "Säkert svar är på. ",
    keyChangedTitle: "Det här är inte länken du använde förut",
    keyChanged: (email: string) => `Länken du använde för ${email} tidigare hade en annan nyckel. De kan ha skapat en ny inkorg, eller så utger sig någon för att vara dem. Innan du skriver: jämför säkerhetskoderna med ${email} på annat sätt, till exempel personligen eller per telefon.`,
    knownCode: "Kod du använde förut",
    newCode: "Kod för den här länken",
    useNew: "Använd den nya länken",
    useKnown: "Använd länken jag känner till",
    replyAddress: "Svar går till",
    replyOnText: (email?: string) => `${email ?? "Mottagaren"} kan svara med ett klick, och svaret krypteras för din inkorg. `,
    replyRemove: "Ta bort",
    replyAdd: "Låt mottagaren svara säkert",
    replyAddHelp: "Lägger till din säkra inkorg i meddelandet, så att svaret också krypteras. Du bekräftar med din lösennyckel.",
    replyNoInbox: "Har du ingen säker inkorg än? Skapa en nu: det krävs bara en bekräftelse med lösennyckeln, och ditt meddelande ligger kvar. ",
    replyCreate: "Skapa min inkorg",
    replyHaveInbox: "Jag har redan en inkorg",
    brokenTitle: "Den här säkra länken är ofullständig",
    brokenText: "En del av länken verkar saknas. Mejlprogram delar ibland upp långa länkar. Be personen skicka sin säkra länk igen, eller kopiera hela länken och klistra in den på ",
    brokenSendPage: "sidan Skicka",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} vill skicka något säkert till dig. Skapa din inkorg nedan och skicka din länk. Det tar bara en stund.`,
    setupTitle: "Skapa din säkra inkorg",
    setupLead: "Din inkorg skyddas av en lösennyckel i din lösenordshanterare. Inget konto och inget lösenord att komma ihåg.",
    emailHelp: "Den läggs till i din länk så att meddelanden adresseras till dig automatiskt.",
    create: "Skapa min inkorg",
    emailMissing: "Fyll i din mejladress först.",
    addAddress: "Lägg till en annan adress…",
    addTitle: "Lägg till en annan adress",
    backToLink: "Tillbaka till min länk",
    unnamed: "Inkorg utan adress",
    forget: "Glöm inkorgen i den här webbläsaren",
    unlock: "Jag har redan en inkorg: visa min länk",
    fact1: "Du ombeds spara en lösennyckel. Bekräfta med Face ID, fingeravtryck eller enhetens PIN-kod.",
    fact2: "Lösennyckeln synkas till dina andra enheter (iCloud-nyckelring, Googles lösenordshanterare, 1Password…), så att du kan öppna meddelanden var som helst.",
    fact3Strong: "Radera inte lösennyckeln:",
    fact3: " meddelanden till den här inkorgen kan bara öppnas med den.",
    factRemembered: "Webbläsaren kommer ihåg din säkra länk, så att du kan dela den utan lösennyckeln. Själva nyckeln stannar i lösennyckeln.",
    readyTitle: "Din inkorg är klar",
    linkTitle: "Din säkra länk",
    readyLead: "Alla som har den här länken kan skicka meddelanden som bara du kan läsa. Den är säker att dela: den kan inte användas för att läsa något.",
    linkLabel: "Din säkra länk",
    sendLinkTo: (email: string) => `Skicka min länk till ${email}`,
    shareLink: "Dela min länk via mejl",
    copyLink: "Kopiera länk",
    shared: "Ditt mejlprogram bör öppnas med din länk klar att skicka.",
    linkEmailHelp: "Läggs till i länken så att meddelanden adresseras till dig automatiskt.",
    codeHelp: "De som skriver till dig ser den här koden bredvid ditt namn. Om ni läser upp den för varandra och den stämmer vet de att länken verkligen är din.",
    signatureTitle: "Lägg till den i din mejlsignatur",
    signatureLead: "Då kan alla som får mejl från dig svara säkert med ett klick.",
    copySignature: "Kopiera signatur",
    signatureHelp: "Klistra in den i signaturinställningarna: i Gmail under Inställningar → Signatur, i Outlook under Inställningar → E-post → Skriv och svara, i Apple Mail under Inställningar → Signaturer.",
  },

  open: {
    pasteTitle: "Öppna ett säkert meddelande",
    pasteLead: "Om det inte fungerade att klicka på länken i mejlet kopierar du hela länken och klistrar in den här.",
    pasteLabel: "Klistra in meddelandelänken",
    notALink: "Det där ser inte ut som en meddelandelänk. Den ska innehålla ”#m=”.",
    incompleteTitle: "Den här meddelandelänken är ofullständig",
    incomplete: "En del av länken verkar saknas. Mejlprogram delar ibland upp långa länkar. Kopiera hela länken från mejlet och klistra in den nedan, eller be avsändaren skicka den igen.",
    damaged: "Den här meddelandelänken är ofullständig eller skadad. Mejlprogram delar ibland upp långa länkar. Kopiera hela länken från mejlet och klistra in den nedan, eller be avsändaren skicka den igen.",
    wrongInbox: "Det här meddelandet skickades inte till inkorgen du låste upp. Om du har flera lösennycklar för Sigill kan du försöka igen och välja en annan.",
    receivedTitle: "Du har fått ett säkert meddelande",
    receivedLead: "Det kan bara öppnas med lösennyckeln till din säkra inkorg.",
    instructions: "Klicka på knappen och bekräfta med Face ID, fingeravtryck eller enhetens PIN-kod.",
    openButton: "Öppna meddelandet",
    notForYou: "Har du ingen säker inkorg? Då var meddelandet inte avsett för dig, eller så använde avsändaren fel länk.",
    messageTitle: "Ditt säkra meddelande",
    keyChanged: (email: string) => `Meddelandet säger att det är från ${email}, men svarslänken är inte den du känner till för dem. Någon kan utge sig för att vara dem.`,
    from: (email: string) => `Från ${email}`,
    reply: "Svara säkert",
    copyText: "Kopiera text",
    noReply: "Avsändaren angav ingen adress för säkert svar. Vill du svara säkert, be om avsändarens säkra länk.",
    staysEncrypted: "Meddelandet förblir krypterat i mejlet. Öppna länken igen när du vill läsa det. ",
    showMyLink: "Visa min säkra länk",
  },

  passkey: {
    cancelled: "Begäran om lösennyckel avbröts. Inget har ändrats, så du kan bara försöka igen.",
    prfUnsupported:
      "Din webbläsare eller lösenordshanterare kan inte hantera en säker inkorg än. Prova Safari, Chrome eller Edge med enhetens inbyggda lösennycklar, eller en ny version av 1Password eller Bitwarden.",
    unavailable: "Den här webbläsaren har inte stöd för lösennycklar. Använd en uppdaterad Safari, Chrome, Edge eller Firefox.",
    notSigill:
      "Den lösennyckeln är ingen Sigill-inkorg: den hör till en annan webbplats på samma adress. Inget har ändrats. Försök igen och välj lösennyckeln som har din mejladress som namn.",
    failed: (details: string) => `Något gick fel med lösennyckeln: ${details}`,
  },

  mail: {
    messageSubject: "Ett säkert meddelande till dig",
    messageBody: (link: string) =>
      "Hej!\n\n" +
      "Jag har skickat ett säkert meddelande till dig. Klicka på länken för att öppna det med din lösennyckel:\n\n" +
      `${link}\n\n` +
      "Bara du kan läsa det: det är krypterat, och nyckeln lämnar aldrig din lösenordshanterare.",
    inviteSubject: "Får jag skicka något säkert till dig?",
    inviteBody: (link: string) =>
      "Hej!\n\n" +
      "Jag vill skicka något konfidentiellt till dig. Skapa gärna en gratis säker inkorg. " +
      "Det tar en halv minut, kräver inget konto, och bara du kan läsa det jag skickar:\n\n" +
      `${link}\n\n` +
      "Skicka din säkra länk till mig när du är klar.\n\n" +
      "Tack!",
    linkSubject: "Min säkra länk",
    linkBody: (link: string) =>
      "Hej!\n\n" +
      "Här är min säkra länk. Använd den för att skicka konfidentiella meddelanden som bara jag kan läsa:\n\n" +
      `${link}\n\n` +
      "Tack!",
    signature: "Skicka ett säkert meddelande till mig",
    signatureTagline: "Krypterat hela vägen med Sigill",
  },
};
