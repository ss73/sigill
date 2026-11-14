import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Terug",
    copied: "Gekopieerd",
    copyFailed: "Kopiëren mislukt: selecteer en kopieer handmatig",
    securityCode: "Beveiligingscode",
    yourEmail: "Je e-mailadres",
    emailPlaceholder: "jij@voorbeeld.nl",
    language: "Taal",
    emailLanguage: "Taal van de e-mail",
    tooOld: "Deze browser is te oud voor Sigill. Werk hem bij, of gebruik een recente versie van Safari, Chrome, Edge of Firefox.",
  },

  home: {
    lead: "Privéberichten via gewone e-mail. Alleen de persoon aan wie je schrijft, kan ze lezen.",
    choicesLabel: "Wat wil je doen?",
    sendTitle: "Een beveiligd bericht sturen",
    sendText: "Schrijf iemand vertrouwelijk",
    receiveTitle: "Beveiligde berichten ontvangen",
    receiveText: "Krijg binnen 30 seconden je eigen beveiligde link",
    howTitle: "Zo werkt het",
    step1Strong: "De ontvanger maakt een inbox aan",
    step1: " met een toegangssleutel: Face ID, vingerafdruk of pincode van het apparaat. Geen account, geen wachtwoord.",
    step2Strong: "De ontvanger deelt de beveiligde link",
    step2: " met iedereen die berichten mag sturen.",
    step3Strong: "Berichten reizen als links in gewone e-mails.",
    step3: " Ze worden in je browser versleuteld en alleen de toegangssleutel van de ontvanger kan ze openen.",
    nothingStored: "Er wordt niets op een server opgeslagen. ",
    wontOpen: "Gaat een berichtlink niet open?",
  },

  send: {
    title: "Een beveiligd bericht sturen",
    lead: "Om beveiligd te schrijven, heb je de beveiligde link van de ontvanger nodig.",
    haveLink: "Ik heb de beveiligde link",
    pasteLabel: "Plak de link hier",
    pasteHelp: "Of klik gewoon op de link in de e-mail.",
    notALink: "Dat lijkt geen beveiligde link. Er hoort “#to=” in te staan.",
    noLinkYet: "De ontvanger heeft er nog geen",
    noLinkText: "Stuur een korte uitnodiging. De ontvanger maakt in een halve minuut een inbox aan en stuurt je de link terug.",
    theirEmail: "E-mailadres van de ontvanger",
    theirEmailPlaceholder: "ontvanger@voorbeeld.nl",
    yourEmailHelp: "Zodat de link direct naar je teruggestuurd kan worden.",
    ask: "Vraag het per e-mail",
    copyInvitation: "Uitnodiging kopiëren",
    asked: "Je e-mailprogramma zou moeten openen met de uitnodiging klaar om te versturen. Krijg je de beveiligde link terug, klik er dan gewoon op om je bericht te schrijven.",
  },

  compose: {
    title: (email?: string) => (email ? `Beveiligd bericht aan ${email}` : "Beveiligd bericht aan de eigenaar van deze link"),
    lead: "Schrijf hieronder je bericht. Het wordt op dit apparaat versleuteld voordat het verstuurd wordt.",
    messageLabel: "Bericht",
    placeholder: "Schrijf je bericht…",
    sendEmail: "Per e-mail versturen",
    copyInstead: "Liever kopiëren",
    encryptsAsYouType: "Je bericht wordt versleuteld terwijl je typt.",
    encrypted: (email?: string) => (email ? `Versleuteld. Alleen ${email} kan het lezen.` : "Versleuteld. Alleen de eigenaar van deze link kan het lezen."),
    tooLongForMailto: "Het is lang, dus het wordt gekopieerd zodat je het in de e-mail kunt plakken.",
    sent: (email?: string) =>
      "Je e-mailprogramma zou moeten openen met het bericht klaar. Druk gewoon op Verzenden. " +
      (email
        ? `Niets geopend? Het bericht is gekopieerd: plak het in een nieuwe e-mail aan ${email}.`
        : "Niets geopend? Het bericht is gekopieerd: plak het in een nieuwe e-mail."),
    copiedForPaste: "Je bericht is gekopieerd. Plak het in de e-mail die opent (⌘V of Ctrl+V) en druk op Verzenden.",
    codeHelp: (email?: string) =>
      `Voor extra zekerheid: vraag ${email ?? "de ontvanger"} telefonisch of persoonlijk of daar dezelfde code in de inbox staat. ` +
      "Komt die overeen, dan heeft niemand de link onderweg verwisseld.",
    replyOn: "Beveiligd antwoorden staat aan. ",
    replyOnText: (email?: string) => `${email ?? "De ontvanger"} kan met één klik antwoorden, en het antwoord wordt versleuteld voor jouw inbox. `,
    replyRemove: "Verwijderen",
    replyAdd: "Laat de ontvanger beveiligd antwoorden",
    replyAddHelp: "Voegt je beveiligde inbox toe aan het bericht, zodat ook het antwoord versleuteld is. Je bevestigt met je toegangssleutel.",
    replyNoInbox: "Nog geen beveiligde inbox? Maak er nu een aan: het kost één bevestiging met je toegangssleutel, en je bericht blijft zoals het is. ",
    replyCreate: "Mijn inbox aanmaken",
    brokenTitle: "Deze beveiligde link is onvolledig",
    brokenText: "Er lijkt een deel van de link te ontbreken. E-mailprogramma's breken lange links soms af. Vraag de persoon de beveiligde link opnieuw te sturen, of kopieer de hele link en plak hem op de ",
    brokenSendPage: "verzendpagina",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} wil je iets beveiligd sturen. Maak hieronder je inbox aan en stuur je link terug. Het duurt maar even.`,
    setupTitle: "Maak je beveiligde inbox aan",
    setupLead: "Je inbox wordt beschermd door een toegangssleutel in je wachtwoordmanager. Geen account en geen wachtwoord om te onthouden.",
    emailHelp: "Het wordt aan je link toegevoegd, zodat berichten automatisch aan jou gericht zijn.",
    create: "Mijn inbox aanmaken",
    emailMissing: "Vul eerst je e-mailadres in.",
    forget: "Vergeet deze inbox in deze browser",
    unlock: "Ik heb al een inbox: toon mijn link",
    fact1: "Je wordt gevraagd een toegangssleutel op te slaan. Bevestig met Face ID, je vingerafdruk of de pincode van je apparaat.",
    fact2: "Je toegangssleutel wordt gesynchroniseerd met je andere apparaten (iCloud-sleutelhanger, Google Wachtwoordmanager, 1Password…), zodat je berichten overal kunt openen.",
    fact3Strong: "Verwijder de toegangssleutel niet:",
    fact3: " berichten aan deze inbox kunnen alleen daarmee worden geopend.",
    factRemembered: "Deze browser onthoudt je beveiligde link, zodat je hem zonder toegangssleutel kunt delen. De sleutel zelf blijft in de toegangssleutel.",
    readyTitle: "Je inbox is klaar",
    linkTitle: "Je beveiligde link",
    readyLead: "Iedereen met deze link kan je berichten sturen die alleen jij kunt lezen. Je kunt hem gerust delen: er valt niets mee te lezen.",
    linkLabel: "Je beveiligde link",
    sendLinkTo: (email: string) => `Mijn link naar ${email} sturen`,
    shareLink: "Mijn link per e-mail delen",
    copyLink: "Link kopiëren",
    shared: "Je e-mailprogramma zou moeten openen met je link klaar om te versturen.",
    linkEmailHelp: "Wordt aan de link toegevoegd, zodat berichten automatisch aan jou gericht zijn.",
    codeHelp: "Wie je schrijft, ziet deze code naast je naam. Lees hem aan elkaar voor: komt hij overeen, dan weten ze dat de link echt van jou is.",
    signatureTitle: "Zet hem in je e-mailhandtekening",
    signatureLead: "Dan kan iedereen die een e-mail van je krijgt met één klik beveiligd terugschrijven.",
    copySignature: "Handtekening kopiëren",
    signatureHelp: "Plak hem in je handtekeninginstellingen: in Gmail onder Instellingen → Handtekening, in Outlook onder Instellingen → E-mail → Opstellen en beantwoorden, in Apple Mail onder Instellingen → Handtekeningen.",
  },

  open: {
    pasteTitle: "Een beveiligd bericht openen",
    pasteLead: "Werkte klikken op de link in de e-mail niet? Kopieer dan de hele link en plak hem hier.",
    pasteLabel: "Plak de berichtlink",
    notALink: "Dat lijkt geen berichtlink. Er hoort “#m=” in te staan.",
    incompleteTitle: "Deze berichtlink is onvolledig",
    incomplete: "Er lijkt een deel van de link te ontbreken. E-mailprogramma's breken lange links soms af. Kopieer de volledige link uit de e-mail en plak hem hieronder, of vraag de afzender hem opnieuw te sturen.",
    damaged: "Deze berichtlink is onvolledig of beschadigd. E-mailprogramma's breken lange links soms af. Kopieer de volledige link uit de e-mail en plak hem hieronder, of vraag de afzender hem opnieuw te sturen.",
    wrongInbox: "Dit bericht is niet verstuurd naar de inbox die je hebt ontgrendeld. Heb je meer dan één Sigill-toegangssleutel? Probeer het opnieuw en kies een andere.",
    receivedTitle: "Je hebt een beveiligd bericht ontvangen",
    receivedLead: "Het kan alleen worden geopend met de toegangssleutel van je beveiligde inbox.",
    instructions: "Klik op de knop en bevestig met Face ID, je vingerafdruk of de pincode van je apparaat.",
    openButton: "Bericht openen",
    notForYou: "Heb je geen beveiligde inbox? Dan was dit bericht niet voor jou bedoeld, of heeft de afzender de verkeerde link gebruikt.",
    messageTitle: "Je beveiligde bericht",
    from: (email: string) => `Van ${email}`,
    reply: "Beveiligd antwoorden",
    copyText: "Tekst kopiëren",
    noReply: "De afzender heeft geen beveiligd antwoordadres meegestuurd. Wil je beveiligd antwoorden, vraag dan om de beveiligde link van de afzender.",
    staysEncrypted: "Dit bericht blijft versleuteld in je e-mail. Open de link opnieuw wanneer je het wilt lezen. ",
    showMyLink: "Toon mijn beveiligde link",
  },

  passkey: {
    cancelled: "Het verzoek om de toegangssleutel is geannuleerd. Er is niets veranderd, dus je kunt het gewoon opnieuw proberen.",
    prfUnsupported:
      "Je browser of wachtwoordmanager kan nog geen beveiligde inbox bewaren. Probeer Safari, Chrome of Edge met de ingebouwde toegangssleutels van je apparaat, of een recente versie van 1Password of Bitwarden.",
    unavailable: "Deze browser ondersteunt geen toegangssleutels. Gebruik een recente versie van Safari, Chrome, Edge of Firefox.",
    failed: (details: string) => `Er ging iets mis met de toegangssleutel: ${details}`,
  },

  mail: {
    messageSubject: "Een beveiligd bericht voor je",
    messageBody: (link: string) =>
      "Hoi,\n\n" +
      "Ik heb je een beveiligd bericht gestuurd. Klik op de link om het te openen met je toegangssleutel:\n\n" +
      `${link}\n\n` +
      "Alleen jij kunt het lezen: het is versleuteld, en de sleutel verlaat nooit je wachtwoordmanager.",
    inviteSubject: "Mag ik je iets beveiligd sturen?",
    inviteBody: (link: string) =>
      "Hoi,\n\n" +
      "Ik wil je iets vertrouwelijks sturen. Wil je een gratis beveiligde inbox aanmaken? " +
      "Het duurt een halve minuut, je hebt geen account nodig, en alleen jij kunt lezen wat ik stuur:\n\n" +
      `${link}\n\n` +
      "Stuur me daarna je beveiligde link.\n\n" +
      "Bedankt!",
    linkSubject: "Mijn beveiligde link",
    linkBody: (link: string) =>
      "Hoi,\n\n" +
      "Hier is mijn beveiligde link. Hiermee kun je me vertrouwelijke berichten sturen die alleen ik kan lezen:\n\n" +
      `${link}\n\n` +
      "Groetjes!",
    signature: "Stuur me een beveiligd bericht",
    signatureTagline: "End-to-end versleuteld met Sigill",
  },
};
