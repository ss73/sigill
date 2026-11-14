import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Wstecz",
    copied: "Skopiowano",
    copyFailed: "Nie udało się skopiować: zaznacz i skopiuj ręcznie",
    securityCode: "Kod bezpieczeństwa",
    yourEmail: "Twój adres e-mail",
    emailPlaceholder: "ty@przyklad.pl",
    language: "Język",
    emailLanguage: "Język e-maila",
    tooOld: "Ta przeglądarka jest za stara dla Sigill. Zaktualizuj ją albo użyj aktualnej wersji Safari, Chrome, Edge lub Firefox.",
  },

  home: {
    lead: "Prywatne wiadomości przez zwykły e-mail. Przeczytać je może tylko osoba, do której piszesz.",
    choicesLabel: "Co chcesz zrobić?",
    sendTitle: "Wyślij bezpieczną wiadomość",
    sendText: "Napisz do kogoś poufnie",
    receiveTitle: "Odbieraj bezpieczne wiadomości",
    receiveText: "Zdobądź własny bezpieczny link w 30 sekund",
    howTitle: "Jak to działa",
    step1Strong: "Odbiorca tworzy skrzynkę",
    step1: " z kluczem dostępu: Face ID, odcisk palca lub PIN urządzenia. Bez konta, bez hasła.",
    step2Strong: "Udostępnia swój bezpieczny link",
    step2: " każdemu, od kogo chce dostawać wiadomości.",
    step3Strong: "Wiadomości trafiają jako linki w zwykłych e-mailach.",
    step3: " Są szyfrowane w twojej przeglądarce i otworzyć je może tylko klucz dostępu odbiorcy.",
    nothingStored: "Nic nie jest zapisywane na żadnym serwerze. ",
    wontOpen: "Link do wiadomości się nie otwiera?",
  },

  send: {
    title: "Wyślij bezpieczną wiadomość",
    lead: "Aby pisać bezpiecznie, potrzebujesz bezpiecznego linku odbiorcy.",
    haveLink: "Mam bezpieczny link odbiorcy",
    pasteLabel: "Wklej link tutaj",
    pasteHelp: "Albo po prostu kliknij link w e-mailu.",
    notALink: "To nie wygląda na bezpieczny link. Powinien zawierać „#to=”.",
    noLinkYet: "Odbiorca jeszcze go nie ma",
    noLinkText: "Wyślij krótkie zaproszenie. Odbiorca utworzy skrzynkę w pół minuty i odeśle ci swój link.",
    theirEmail: "Adres e-mail odbiorcy",
    theirEmailPlaceholder: "odbiorca@przyklad.pl",
    yourEmailHelp: "Żeby odbiorca mógł od razu odesłać ci swój link.",
    ask: "Poproś e-mailem",
    copyInvitation: "Kopiuj zaproszenie",
    asked: "Twój program pocztowy powinien się otworzyć z gotowym zaproszeniem. Gdy dostaniesz odpowiedź z bezpiecznym linkiem, po prostu go kliknij i napisz wiadomość.",
  },

  compose: {
    title: (email?: string) => (email ? `Bezpieczna wiadomość do: ${email}` : "Bezpieczna wiadomość do właściciela tego linku"),
    lead: "Napisz wiadomość poniżej. Zostanie zaszyfrowana na tym urządzeniu, zanim je opuści.",
    messageLabel: "Wiadomość",
    placeholder: "Napisz wiadomość…",
    sendEmail: "Wyślij e-mailem",
    copyInstead: "Skopiuj zamiast tego",
    encryptsAsYouType: "Wiadomość jest szyfrowana na bieżąco, gdy piszesz.",
    encrypted: (email?: string) => (email ? `Zaszyfrowano. Przeczytać ją może tylko ${email}.` : "Zaszyfrowano. Przeczytać ją może tylko właściciel tego linku."),
    tooLongForMailto: "Jest długa, więc zostanie skopiowana, żeby można ją było wkleić do e-maila.",
    sent: (email?: string) =>
      "Twój program pocztowy powinien się otworzyć z gotową wiadomością. Wystarczy kliknąć Wyślij. " +
      (email
        ? `Nic się nie otworzyło? Wiadomość jest skopiowana: wklej ją do nowego e-maila na adres ${email}.`
        : "Nic się nie otworzyło? Wiadomość jest skopiowana: wklej ją do nowego e-maila."),
    copiedForPaste: "Wiadomość została skopiowana. Wklej ją do otwartego e-maila (⌘V lub Ctrl+V) i kliknij Wyślij.",
    codeHelp: (email?: string) =>
      `Dla pewności zapytaj odbiorcę${email ? ` (${email})` : ""} telefonicznie lub osobiście, czy w swojej skrzynce widzi ten sam kod. ` +
      "Jeśli się zgadza, nikt nie podmienił linku po drodze.",
    replyOn: "Bezpieczna odpowiedź włączona. ",
    replyOnText: (email?: string) => `${email ?? "Odbiorca"} może odpowiedzieć jednym kliknięciem, a odpowiedź zostanie zaszyfrowana dla twojej skrzynki. `,
    replyRemove: "Usuń",
    replyEmailHelp: "Opcjonalnie. Żeby odpowiedź była zaadresowana do ciebie.",
    replyAdd: "Pozwól na bezpieczną odpowiedź",
    replyAddHelp: "Dodaje twoją bezpieczną skrzynkę do wiadomości, więc odpowiedź też będzie zaszyfrowana. Potwierdzasz kluczem dostępu.",
    replyNoInbox: "Nie masz jeszcze bezpiecznej skrzynki? Utwórz ją teraz: wystarczy jedno potwierdzenie kluczem dostępu, a twoja wiadomość zostanie bez zmian. ",
    replyCreate: "Utwórz moją skrzynkę",
    brokenTitle: "Ten bezpieczny link jest niepełny",
    brokenText: "Wygląda na to, że brakuje części linku. Programy pocztowe czasem psują długie linki. Poproś tę osobę o ponowne wysłanie bezpiecznego linku albo skopiuj cały link i wklej go na ",
    brokenSendPage: "stronie wysyłania",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} chce ci coś bezpiecznie wysłać. Utwórz poniżej swoją skrzynkę i odeślij swój link. To zajmie tylko chwilę.`,
    setupTitle: "Utwórz bezpieczną skrzynkę",
    setupLead: "Twoja skrzynka jest chroniona kluczem dostępu w menedżerze haseł. Bez konta i bez hasła do zapamiętania.",
    emailHelp: "Opcjonalnie. Zostanie dodany do twojego linku, żeby wiadomości były automatycznie adresowane do ciebie.",
    create: "Utwórz moją skrzynkę",
    unlock: "Mam już skrzynkę: pokaż mój link",
    fact1: "Pojawi się prośba o zapisanie klucza dostępu. Potwierdź Face ID, odciskiem palca lub PIN-em urządzenia.",
    fact2: "Klucz dostępu synchronizuje się z twoimi innymi urządzeniami (Pęk kluczy iCloud, Menedżer haseł Google, 1Password…), więc otworzysz wiadomości wszędzie.",
    fact3Strong: "Nie usuwaj klucza dostępu:",
    fact3: " wiadomości wysłane do tej skrzynki da się otworzyć tylko nim.",
    readyTitle: "Twoja skrzynka jest gotowa",
    linkTitle: "Twój bezpieczny link",
    readyLead: "Każdy, kto ma ten link, może wysyłać ci wiadomości, które przeczytasz tylko ty. Możesz go spokojnie udostępniać: nie da się nim niczego odczytać.",
    linkLabel: "Twój bezpieczny link",
    sendLinkTo: (email: string) => `Wyślij mój link na adres ${email}`,
    shareLink: "Udostępnij mój link e-mailem",
    copyLink: "Kopiuj link",
    shared: "Twój program pocztowy powinien się otworzyć z linkiem gotowym do wysłania.",
    linkEmailHelp: "Opcjonalnie. Zostanie dodany do linku, żeby wiadomości były automatycznie adresowane do ciebie.",
    codeHelp: "Osoby, które do ciebie piszą, widzą ten kod obok twojego imienia. Jeśli odczytacie go sobie nawzajem i się zgadza, wiedzą, że link naprawdę należy do ciebie.",
    signatureTitle: "Dodaj go do podpisu e-mail",
    signatureLead: "Wtedy każdy, kto dostanie od ciebie e-mail, może jednym kliknięciem bezpiecznie odpisać.",
    copySignature: "Kopiuj podpis",
    signatureHelp: "Wklej go w ustawieniach podpisu. Gmail: Ustawienia → Podpis. Outlook: Ustawienia → Poczta → Redagowanie i odpowiadanie. Apple Mail: Ustawienia → Podpisy.",
  },

  open: {
    pasteTitle: "Otwórz bezpieczną wiadomość",
    pasteLead: "Jeśli kliknięcie linku w e-mailu nie zadziałało, skopiuj cały link i wklej go tutaj.",
    pasteLabel: "Wklej link do wiadomości",
    notALink: "To nie wygląda na link do wiadomości. Powinien zawierać „#m=”.",
    incompleteTitle: "Ten link do wiadomości jest niepełny",
    incomplete: "Wygląda na to, że brakuje części linku. Programy pocztowe czasem psują długie linki. Skopiuj cały link z e-maila i wklej go poniżej albo poproś nadawcę o ponowne wysłanie.",
    damaged: "Ten link do wiadomości jest niepełny lub uszkodzony. Programy pocztowe czasem psują długie linki. Skopiuj cały link z e-maila i wklej go poniżej albo poproś nadawcę o ponowne wysłanie.",
    wrongInbox: "Ta wiadomość nie została wysłana do odblokowanej skrzynki. Jeśli masz więcej niż jeden klucz dostępu Sigill, spróbuj ponownie i wybierz inny.",
    receivedTitle: "Masz bezpieczną wiadomość",
    receivedLead: "Można ją otworzyć tylko kluczem dostępu twojej bezpiecznej skrzynki.",
    instructions: "Kliknij przycisk i potwierdź Face ID, odciskiem palca lub PIN-em urządzenia.",
    openButton: "Otwórz wiadomość",
    notForYou: "Nie masz bezpiecznej skrzynki? W takim razie ta wiadomość nie była do ciebie albo nadawca użył złego linku.",
    messageTitle: "Twoja bezpieczna wiadomość",
    from: (email: string) => `Od: ${email}`,
    reply: "Odpowiedz bezpiecznie",
    copyText: "Kopiuj tekst",
    noReply: "Nadawca nie dołączył bezpiecznego adresu do odpowiedzi. Aby odpowiedzieć bezpiecznie, poproś nadawcę o bezpieczny link.",
    staysEncrypted: "Ta wiadomość pozostaje zaszyfrowana w twojej poczcie. Otwórz link ponownie, kiedy tylko zechcesz ją przeczytać. ",
    showMyLink: "Pokaż mój bezpieczny link",
  },

  passkey: {
    cancelled: "Prośba o klucz dostępu została anulowana. Nic się nie zmieniło, więc możesz po prostu spróbować ponownie.",
    prfUnsupported:
      "Twoja przeglądarka lub menedżer haseł nie obsługuje jeszcze bezpiecznej skrzynki. Użyj Safari, Chrome lub Edge z wbudowanymi kluczami dostępu urządzenia albo aktualnej wersji 1Password lub Bitwarden.",
    unavailable: "Ta przeglądarka nie obsługuje kluczy dostępu. Użyj aktualnej wersji Safari, Chrome, Edge lub Firefox.",
    failed: (details: string) => `Coś poszło nie tak z kluczem dostępu: ${details}`,
  },

  mail: {
    messageSubject: "Bezpieczna wiadomość dla Ciebie",
    messageBody: (link: string) =>
      "Cześć!\n\n" +
      "Wysyłam Ci bezpieczną wiadomość. Kliknij link, aby otworzyć ją kluczem dostępu:\n\n" +
      `${link}\n\n` +
      "Tylko Ty możesz ją przeczytać: jest zaszyfrowana, a klucz nigdy nie opuszcza Twojego menedżera haseł.",
    inviteSubject: "Czy mogę wysłać Ci coś bezpiecznie?",
    inviteBody: (link: string) =>
      "Cześć!\n\n" +
      "Chcę wysłać Ci coś poufnego. Utwórz, proszę, darmową bezpieczną skrzynkę. " +
      "To zajmuje pół minuty, nie wymaga konta i tylko Ty przeczytasz to, co wyślę:\n\n" +
      `${link}\n\n` +
      "Gdy skończysz, wyślij mi swój bezpieczny link.\n\n" +
      "Dzięki!",
    linkSubject: "Mój bezpieczny link",
    linkBody: (link: string) =>
      "Cześć!\n\n" +
      "Oto mój bezpieczny link. Możesz przez niego wysyłać mi poufne wiadomości, które przeczytam tylko ja:\n\n" +
      `${link}\n\n` +
      "Dzięki!",
    signature: "Wyślij mi bezpieczną wiadomość",
    signatureTagline: "Szyfrowane end-to-end przez Sigill",
  },
};
