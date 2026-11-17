import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Zurück",
    copied: "Kopiert",
    copyFailed: "Kopieren fehlgeschlagen: bitte manuell markieren und kopieren",
    securityCode: "Sicherheitscode",
    yourEmail: "Ihre E-Mail-Adresse",
    emailPlaceholder: "name@beispiel.de",
    language: "Sprache",
    emailLanguage: "Sprache der E-Mail",
    settings: "Einstellungen",
    rememberPeople: "In diesem Browser merken",
    theme: "Design",
    themeAuto: "Wie das Gerät",
    themeLight: "Hell",
    themeDark: "Dunkel",
    tooOld: "Dieser Browser ist zu alt für Sigill. Bitte aktualisieren Sie ihn oder nutzen Sie ein aktuelles Safari, Chrome, Edge oder Firefox.",
  },

  home: {
    lead: "Vertrauliche Nachrichten per ganz normaler E-Mail. Nur die Person, der Sie schreiben, kann sie lesen.",
    choicesLabel: "Was möchten Sie tun?",
    sendTitle: "Sichere Nachricht senden",
    sendText: "Jemandem vertraulich schreiben",
    receiveTitle: "Sichere Nachrichten empfangen",
    receiveText: "Eigenen sicheren Link in 30 Sekunden erhalten",
    howTitle: "So funktioniert's",
    step1Strong: "Der Empfänger erstellt ein Postfach",
    step1: " mit einem Passkey: Face ID, Fingerabdruck oder Geräte-PIN. Kein Konto, kein Passwort.",
    step2Strong: "Er teilt seinen sicheren Link",
    step2: " mit allen, die ihm schreiben sollen.",
    step3Strong: "Nachrichten reisen als Links in normalen E-Mails.",
    step3: " Sie werden in Ihrem Browser verschlüsselt, und nur der Passkey des Empfängers kann sie öffnen.",
    nothingStored: "Auf keinem Server wird etwas gespeichert. ",
    wontOpen: "Ein Nachrichtenlink lässt sich nicht öffnen?",
  },

  send: {
    title: "Sichere Nachricht senden",
    lead: "Um sicher zu schreiben, brauchen Sie den sicheren Link des Empfängers.",
    contactsTitle: "Personen, mit denen Sie schreiben",
    stopRemembering: "In diesem Browser keine Personen mehr merken",
    confirmForget: "Alle Personen in der Liste vergessen?",
    confirmStop: "Keine Personen mehr merken und alle in der Liste vergessen?",
    cancel: "Abbrechen",
    forgetContacts: "Alle vergessen",
    contactsHelp: "Nur in diesem Browser gespeichert. Die Links können nichts öffnen, zeigen aber, mit wem Sie schreiben.",
    haveLink: "Ich habe den sicheren Link",
    pasteLabel: "Link hier einfügen",
    pasteHelp: "Oder klicken Sie einfach auf den Link in der E-Mail.",
    notALink: "Das sieht nicht nach einem sicheren Link aus. Er sollte „#to=“ enthalten.",
    noLinkYet: "Der Empfänger hat noch keinen",
    noLinkText: "Schicken Sie eine kurze Einladung. In einer halben Minute ist das Postfach erstellt, und Sie bekommen den Link zurück.",
    theirEmail: "E-Mail-Adresse des Empfängers",
    theirEmailPlaceholder: "empfaenger@beispiel.de",
    yourEmailOptional: "Ihre E-Mail-Adresse (optional)",
    otherAddress: "Eine andere Adresse …",
    yourEmailHelp: "Damit der Link direkt an Sie zurückgeschickt werden kann.",
    ask: "Per E-Mail fragen",
    copyInvitation: "Einladung kopieren",
    asked: "Ihr E-Mail-Programm sollte sich mit der fertigen Einladung öffnen. Sobald die Antwort mit dem sicheren Link kommt, klicken Sie einfach darauf, um Ihre Nachricht zu schreiben.",
  },

  compose: {
    title: (email?: string) => (email ? `Sichere Nachricht an ${email}` : "Sichere Nachricht an den Inhaber dieses Links"),
    lead: "Schreiben Sie unten Ihre Nachricht. Sie wird auf diesem Gerät verschlüsselt, bevor sie es verlässt.",
    messageLabel: "Nachricht",
    placeholder: "Ihre Nachricht…",
    sendEmail: "Per E-Mail senden",
    copyInstead: "Stattdessen kopieren",
    encryptsAsYouType: "Ihre Nachricht wird schon beim Tippen verschlüsselt.",
    encrypted: (email?: string) => (email ? `Verschlüsselt. Nur ${email} kann sie lesen.` : "Verschlüsselt. Nur der Inhaber dieses Links kann sie lesen."),
    tooLongForMailto: "Sie ist recht lang. Deshalb wird sie kopiert, damit Sie sie in die E-Mail einfügen können.",
    sent: (email?: string) =>
      "Ihr E-Mail-Programm sollte sich mit der fertigen Nachricht öffnen. Klicken Sie einfach auf Senden. " +
      (email
        ? `Nichts passiert? Die Nachricht wurde kopiert: Fügen Sie sie in eine neue E-Mail an ${email} ein.`
        : "Nichts passiert? Die Nachricht wurde kopiert: Fügen Sie sie in eine neue E-Mail ein."),
    copiedForPaste: "Ihre Nachricht wurde kopiert. Fügen Sie sie in die geöffnete E-Mail ein (⌘V oder Strg+V) und klicken Sie auf Senden.",
    codeHelp: (email?: string) =>
      `Zur Sicherheit können Sie ${email ?? "den Empfänger"} telefonisch oder persönlich fragen, ob dort im Postfach derselbe Code angezeigt wird. ` +
      "Stimmt er überein, hat niemand den Link unterwegs ausgetauscht.",
    replyOn: "Sichere Antwort ist aktiv. ",
    keyChangedTitle: "Das ist nicht der Link, den Sie zuvor verwendet haben",
    keyChanged: (email: string) => `Der Link, den Sie zuvor für ${email} verwendet haben, hatte einen anderen Schlüssel. Vielleicht wurde ein neues Postfach eingerichtet, oder jemand gibt sich als diese Person aus. Vergleichen Sie vor dem Schreiben die Sicherheitscodes mit ${email} auf anderem Weg, etwa persönlich oder am Telefon.`,
    knownCode: "Zuvor verwendeter Code",
    newCode: "Code dieses Links",
    useNew: "Neuen Link verwenden",
    useKnown: "Bekannten Link verwenden",
    replyAddress: "Antworten gehen an",
    replyOnText: (email?: string) => `${email ?? "Der Empfänger"} kann mit einem Klick antworten, und die Antwort wird für Ihr Postfach verschlüsselt. `,
    replyRemove: "Entfernen",
    replyAdd: "Sichere Antwort ermöglichen",
    replyAddHelp: "Fügt Ihr sicheres Postfach zur Nachricht hinzu, damit auch die Antwort verschlüsselt ist. Sie bestätigen mit Ihrem Passkey.",
    replyNoInbox: "Noch kein sicheres Postfach? Erstellen Sie jetzt eins: Es braucht nur eine Bestätigung mit Ihrem Passkey, und Ihre Nachricht bleibt erhalten. ",
    replyCreate: "Mein Postfach erstellen",
    replyHaveInbox: "Ich habe schon ein Postfach",
    brokenTitle: "Dieser sichere Link ist unvollständig",
    brokenText: "Ein Teil des Links scheint zu fehlen. E-Mail-Programme zerlegen manchmal lange Links. Bitten Sie die Person, ihren sicheren Link noch einmal zu senden, oder kopieren Sie den ganzen Link und fügen Sie ihn auf der ",
    brokenSendPage: "Senden-Seite",
    brokenEnd: " ein.",
  },

  inbox: {
    invited: (email: string) => `${email} möchte Ihnen etwas vertraulich senden. Erstellen Sie unten Ihr Postfach und schicken Sie Ihren Link zurück. Das dauert nur einen Moment.`,
    setupTitle: "Ihr sicheres Postfach erstellen",
    setupLead: "Ihr Postfach ist durch einen Passkey in Ihrem Passwort-Manager geschützt. Kein Konto, kein Passwort zum Merken.",
    emailHelp: "Wird Ihrem Link hinzugefügt, damit Nachrichten automatisch an Sie adressiert sind.",
    create: "Mein Postfach erstellen",
    emailMissing: "Bitte geben Sie zuerst Ihre E-Mail-Adresse ein.",
    addAddress: "Weitere Adresse hinzufügen …",
    addTitle: "Weitere Adresse hinzufügen",
    backToLink: "Zurück zu meinem Link",
    unnamed: "Postfach ohne Adresse",
    forget: "Postfach in diesem Browser vergessen",
    unlock: "Ich habe schon ein Postfach: Link anzeigen",
    fact1: "Sie werden gebeten, einen Passkey zu sichern. Bestätigen Sie mit Face ID, Fingerabdruck oder Geräte-PIN.",
    fact2: "Ihr Passkey wird mit Ihren anderen Geräten synchronisiert (iCloud-Schlüsselbund, Google Passwortmanager, 1Password…), sodass Sie Nachrichten überall öffnen können.",
    fact3Strong: "Löschen Sie den Passkey nicht:",
    fact3: " Nachrichten an dieses Postfach lassen sich nur damit öffnen.",
    factRemembered: "Dieser Browser merkt sich Ihren sicheren Link, damit Sie ihn ohne Passkey teilen können. Der Schlüssel selbst bleibt im Passkey.",
    readyTitle: "Ihr Postfach ist bereit",
    linkTitle: "Ihr sicherer Link",
    readyLead: "Jeder mit diesem Link kann Ihnen Nachrichten senden, die nur Sie lesen können. Sie können ihn bedenkenlos teilen: Damit lässt sich nichts lesen.",
    linkLabel: "Ihr sicherer Link",
    sendLinkTo: (email: string) => `Meinen Link an ${email} senden`,
    shareLink: "Meinen Link per E-Mail teilen",
    copyLink: "Link kopieren",
    shared: "Ihr E-Mail-Programm sollte sich mit Ihrem Link öffnen, bereit zum Senden.",
    linkEmailHelp: "Wird dem Link hinzugefügt, damit Nachrichten automatisch an Sie adressiert sind.",
    codeHelp: "Wer Ihnen schreibt, sieht diesen Code neben Ihrem Namen. Lesen Sie ihn sich gegenseitig vor: Stimmt er überein, ist der Link wirklich Ihrer.",
    signatureTitle: "In Ihre E-Mail-Signatur aufnehmen",
    signatureLead: "Dann kann jeder, der eine E-Mail von Ihnen bekommt, mit einem Klick sicher antworten.",
    copySignature: "Signatur kopieren",
    signatureHelp: "Fügen Sie sie in Ihre Signatur-Einstellungen ein: in Gmail unter Einstellungen → Signatur, in Outlook unter Einstellungen → E-Mail → Verfassen und Antworten, in Apple Mail unter Einstellungen → Signaturen.",
  },

  open: {
    pasteTitle: "Sichere Nachricht öffnen",
    pasteLead: "Wenn der Klick auf den Link in der E-Mail nicht funktioniert hat, kopieren Sie den ganzen Link und fügen Sie ihn hier ein.",
    pasteLabel: "Nachrichtenlink einfügen",
    notALink: "Das sieht nicht nach einem Nachrichtenlink aus. Er sollte „#m=“ enthalten.",
    incompleteTitle: "Dieser Nachrichtenlink ist unvollständig",
    incomplete: "Ein Teil des Links scheint zu fehlen. E-Mail-Programme zerlegen manchmal lange Links. Kopieren Sie den vollständigen Link aus der E-Mail und fügen Sie ihn unten ein, oder bitten Sie den Absender, ihn noch einmal zu senden.",
    damaged: "Dieser Nachrichtenlink ist unvollständig oder beschädigt. E-Mail-Programme zerlegen manchmal lange Links. Kopieren Sie den vollständigen Link aus der E-Mail und fügen Sie ihn unten ein, oder bitten Sie den Absender, ihn noch einmal zu senden.",
    wrongInbox: "Diese Nachricht wurde nicht an das Postfach gesendet, das Sie entsperrt haben. Wenn Sie mehrere Sigill-Passkeys haben, versuchen Sie es noch einmal und wählen Sie einen anderen.",
    receivedTitle: "Sie haben eine sichere Nachricht erhalten",
    receivedLead: "Sie lässt sich nur mit dem Passkey Ihres sicheren Postfachs öffnen.",
    instructions: "Klicken Sie auf die Schaltfläche und bestätigen Sie mit Face ID, Fingerabdruck oder Geräte-PIN.",
    openButton: "Nachricht öffnen",
    notForYou: "Sie haben kein sicheres Postfach? Dann war diese Nachricht nicht für Sie bestimmt, oder der Absender hat den falschen Link verwendet.",
    messageTitle: "Ihre sichere Nachricht",
    keyChanged: (email: string) => `Diese Nachricht gibt an, von ${email} zu stammen, aber ihr Antwortlink ist nicht der, den Sie für diese Person kennen. Jemand könnte sich als diese Person ausgeben.`,
    from: (email: string) => `Von ${email}`,
    reply: "Sicher antworten",
    copyText: "Text kopieren",
    noReply: "Der Absender hat keine sichere Antwortadresse angegeben. Um sicher zu antworten, bitten Sie ihn um seinen sicheren Link.",
    staysEncrypted: "Diese Nachricht bleibt in Ihrer E-Mail verschlüsselt. Öffnen Sie den Link einfach erneut, wann immer Sie sie lesen möchten. ",
    showMyLink: "Meinen sicheren Link anzeigen",
  },

  passkey: {
    cancelled: "Die Passkey-Anfrage wurde abgebrochen. Es hat sich nichts geändert, Sie können es einfach noch einmal versuchen.",
    prfUnsupported:
      "Ihr Browser oder Passwort-Manager kann noch kein sicheres Postfach speichern. Versuchen Sie Safari, Chrome oder Edge mit den integrierten Passkeys Ihres Geräts oder eine aktuelle Version von 1Password oder Bitwarden.",
    unavailable: "Dieser Browser unterstützt keine Passkeys. Bitte nutzen Sie ein aktuelles Safari, Chrome, Edge oder Firefox.",
    notSigill:
      "Dieser Passkey ist kein Sigill-Postfach: Er gehört zu einer anderen Website unter derselben Adresse. Es wurde nichts geändert. Versuche es erneut und wähle den Passkey, der nach deiner E-Mail-Adresse benannt ist.",
    failed: (details: string) => `Beim Passkey ist etwas schiefgelaufen: ${details}`,
  },

  mail: {
    messageSubject: "Eine sichere Nachricht für Sie",
    messageBody: (link: string) =>
      "Hallo,\n\n" +
      "ich habe Ihnen eine sichere Nachricht geschickt. Klicken Sie auf den Link, um sie mit Ihrem Passkey zu öffnen:\n\n" +
      `${link}\n\n` +
      "Nur Sie können sie lesen: Sie ist verschlüsselt, und der Schlüssel verlässt nie Ihren Passwort-Manager.",
    inviteSubject: "Darf ich Ihnen etwas vertraulich senden?",
    inviteBody: (link: string) =>
      "Hallo,\n\n" +
      "ich möchte Ihnen etwas Vertrauliches schicken. Bitte erstellen Sie dafür ein kostenloses sicheres Postfach. " +
      "Das dauert eine halbe Minute, braucht kein Konto, und nur Sie können lesen, was ich Ihnen schicke:\n\n" +
      `${link}\n\n` +
      "Wenn Sie fertig sind, schicken Sie mir bitte Ihren sicheren Link.\n\n" +
      "Vielen Dank!",
    linkSubject: "Mein sicherer Link",
    linkBody: (link: string) =>
      "Hallo,\n\n" +
      "hier ist mein sicherer Link. Damit können Sie mir vertrauliche Nachrichten senden, die nur ich lesen kann:\n\n" +
      `${link}\n\n` +
      "Viele Grüße!",
    signature: "Senden Sie mir eine sichere Nachricht",
    signatureTagline: "Ende-zu-Ende-verschlüsselt mit Sigill",
  },
};
