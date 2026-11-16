import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Takaisin",
    copied: "Kopioitu",
    copyFailed: "Kopiointi epäonnistui: valitse ja kopioi itse",
    securityCode: "Turvakoodi",
    yourEmail: "Sähköpostiosoitteesi",
    emailPlaceholder: "nimi@sahkoposti.fi",
    language: "Kieli",
    emailLanguage: "Sähköpostin kieli",
    theme: "Teema",
    themeAuto: "Laitteen mukaan",
    themeLight: "Vaalea",
    themeDark: "Tumma",
    tooOld: "Tämä selain on liian vanha Sigillin käyttöön. Päivitä se tai käytä uutta Safari-, Chrome-, Edge- tai Firefox-selainta.",
  },

  home: {
    lead: "Yksityisiä viestejä tavallisella sähköpostilla. Vain se, jolle kirjoitat, voi lukea ne.",
    choicesLabel: "Mitä haluat tehdä?",
    sendTitle: "Lähetä suojattu viesti",
    sendText: "Kirjoita jollekulle luottamuksellisesti",
    receiveTitle: "Vastaanota suojattuja viestejä",
    receiveText: "Hanki oma suojattu linkki 30 sekunnissa",
    howTitle: "Näin se toimii",
    step1Strong: "Vastaanottaja luo postilaatikon",
    step1: " pääsyavaimella: Face ID, sormenjälki tai laitteen PIN-koodi. Ei tiliä, ei salasanaa.",
    step2Strong: "Hän jakaa suojatun linkkinsä",
    step2: " kaikille, joiden pitää voida kirjoittaa hänelle.",
    step3Strong: "Viestit kulkevat linkkeinä tavallisissa sähköposteissa.",
    step3: " Ne salataan selaimessasi, ja vain vastaanottajan pääsyavain voi avata ne.",
    nothingStored: "Mitään ei tallenneta millekään palvelimelle. ",
    wontOpen: "Eikö viestilinkki aukea?",
  },

  send: {
    title: "Lähetä suojattu viesti",
    lead: "Jotta voit kirjoittaa suojatusti, tarvitset vastaanottajan suojatun linkin.",
    haveLink: "Minulla on vastaanottajan suojattu linkki",
    pasteLabel: "Liitä linkki tähän",
    pasteHelp: "Tai napsauta linkkiä vastaanottajan sähköpostissa.",
    notALink: "Tämä ei näytä suojatulta linkiltä. Siinä pitäisi olla ”#to=”.",
    noLinkYet: "Hänellä ei ole vielä linkkiä",
    noLinkText: "Lähetä hänelle lyhyt kutsu. Hän luo postilaatikon puolessa minuutissa ja lähettää linkkinsä sinulle.",
    theirEmail: "Vastaanottajan sähköpostiosoite",
    theirEmailPlaceholder: "vastaanottaja@sahkoposti.fi",
    yourEmailOptional: "Sähköpostiosoitteesi (valinnainen)",
    yourEmailHelp: "Jotta hän voi lähettää linkkinsä suoraan sinulle.",
    ask: "Pyydä sähköpostilla",
    copyInvitation: "Kopioi kutsu",
    asked: "Sähköpostiohjelmasi pitäisi avautua kutsu valmiina lähetettäväksi. Kun hän vastaa suojatulla linkillään, napsauta linkkiä ja kirjoita viestisi.",
  },

  compose: {
    title: (email?: string) => (email ? `Suojattu viesti osoitteeseen ${email}` : "Suojattu viesti tämän linkin omistajalle"),
    lead: "Kirjoita viestisi alle. Se salataan tällä laitteella ennen kuin se lähtee.",
    messageLabel: "Viesti",
    placeholder: "Kirjoita viestisi…",
    sendEmail: "Lähetä sähköpostilla",
    copyInstead: "Kopioi sen sijaan",
    encryptsAsYouType: "Viestisi salataan sitä mukaa kuin kirjoitat.",
    encrypted: (email?: string) => (email ? `Salattu. Vain ${email} voi lukea sen.` : "Salattu. Vain tämän linkin omistaja voi lukea sen."),
    tooLongForMailto: "Viesti on pitkä, joten se kopioidaan ja voit liittää sen sähköpostiin.",
    sent: (email?: string) =>
      "Sähköpostiohjelmasi pitäisi avautua viesti valmiina. Paina vain Lähetä. " +
      (email ? `Eikö mitään avautunut? Viesti on kopioitu: liitä se uuteen sähköpostiin osoitteeseen ${email}.` : "Eikö mitään avautunut? Viesti on kopioitu: liitä se uuteen sähköpostiin."),
    copiedForPaste: "Viestisi kopioitiin. Liitä se avautuvaan sähköpostiin (⌘V tai Ctrl+V) ja paina Lähetä.",
    codeHelp: (email?: string) =>
      `Jos haluat olla aivan varma, kysy vastaanottajalta${email ? ` (${email})` : ""} puhelimessa tai kasvotusten, näkyykö hänen postilaatikossaan sama koodi. ` +
      "Jos koodi täsmää, kukaan ei ole vaihtanut linkkiä matkalla.",
    replyOn: "Suojattu vastaus on käytössä. ",
    replyAddress: "Vastaukset menevät osoitteeseen",
    replyOnText: (email?: string) => `${email ?? "Vastaanottaja"} voi vastata yhdellä napsautuksella, ja vastaus salataan postilaatikkoosi. `,
    replyRemove: "Poista",
    replyAdd: "Anna hänen vastata suojatusti",
    replyAddHelp: "Lisää suojatun postilaatikkosi viestiin, joten myös vastaus salataan. Vahvistat pääsyavaimellasi.",
    replyNoInbox: "Eikö sinulla ole vielä suojattua postilaatikkoa? Luo se nyt: se vaatii vain yhden vahvistuksen pääsyavaimella, eikä viestisi muutu. ",
    replyCreate: "Luo postilaatikkoni",
    replyHaveInbox: "Minulla on jo postilaatikko",
    brokenTitle: "Tämä suojattu linkki on vajaa",
    brokenText: "Osa linkistä näyttää puuttuvan. Sähköpostiohjelmat katkaisevat joskus pitkiä linkkejä. Pyydä häntä lähettämään suojattu linkkinsä uudelleen, tai kopioi koko linkki ja liitä se ",
    brokenSendPage: "Lähetä-sivulle",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} haluaa lähettää sinulle jotain suojatusti. Luo postilaatikkosi alla ja lähetä linkkisi hänelle. Se vie vain hetken.`,
    setupTitle: "Luo suojattu postilaatikkosi",
    setupLead: "Postilaatikkosi on suojattu pääsyavaimella, joka on salasanojen hallinnassasi. Ei tiliä eikä muistettavaa salasanaa.",
    emailHelp: "Se lisätään linkkiisi, jotta viestit osoitetaan sinulle automaattisesti.",
    create: "Luo postilaatikkoni",
    emailMissing: "Anna ensin sähköpostiosoitteesi.",
    addAddress: "Lisää toinen osoite…",
    addTitle: "Lisää toinen osoite",
    backToLink: "Takaisin linkkiini",
    unnamed: "Postilaatikko ilman osoitetta",
    forget: "Unohda postilaatikko tässä selaimessa",
    unlock: "Minulla on jo postilaatikko: näytä linkkini",
    fact1: "Sinua pyydetään tallentamaan pääsyavain. Vahvista Face ID:llä, sormenjäljellä tai laitteen PIN-koodilla.",
    fact2: "Pääsyavaimesi synkronoituu muille laitteillesi (iCloud-avainnippu, Googlen salasanojen ylläpitotyökalu, 1Password…), joten voit avata viestit missä vain.",
    fact3Strong: "Älä poista pääsyavainta:",
    fact3: " tähän postilaatikkoon lähetetyt viestit voi avata vain sillä.",
    factRemembered: "Selain muistaa suojatun linkkisi, joten voit jakaa sen ilman pääsyavainta. Itse avain pysyy pääsyavaimessa.",
    readyTitle: "Postilaatikkosi on valmis",
    linkTitle: "Suojattu linkkisi",
    readyLead: "Kuka tahansa, jolla on tämä linkki, voi lähettää sinulle viestejä, joita vain sinä voit lukea. Linkin voi jakaa turvallisesti: sillä ei voi lukea mitään.",
    linkLabel: "Suojattu linkkisi",
    sendLinkTo: (email: string) => `Lähetä linkkini osoitteeseen ${email}`,
    shareLink: "Jaa linkkini sähköpostilla",
    copyLink: "Kopioi linkki",
    shared: "Sähköpostiohjelmasi pitäisi avautua linkkisi valmiina lähetettäväksi.",
    linkEmailHelp: "Lisätään linkkiin, jotta viestit osoitetaan sinulle automaattisesti.",
    codeHelp: "Sinulle kirjoittavat näkevät tämän koodin nimesi vieressä. Jos luette koodin toisillenne ja se täsmää, he tietävät, että linkki on todella sinun.",
    signatureTitle: "Lisää se sähköpostisi allekirjoitukseen",
    signatureLead: "Silloin kaikki, jotka saavat sinulta sähköpostia, voivat vastata suojatusti yhdellä napsautuksella.",
    copySignature: "Kopioi allekirjoitus",
    signatureHelp: "Liitä se allekirjoitusasetuksiin. Gmail: Asetukset → Allekirjoitus. Outlook: Asetukset → Sähköposti → Kirjoita ja vastaa. Apple Mail: Asetukset → Allekirjoitukset.",
  },

  open: {
    pasteTitle: "Avaa suojattu viesti",
    pasteLead: "Jos linkin napsauttaminen sähköpostissa ei toiminut, kopioi koko linkki ja liitä se tähän.",
    pasteLabel: "Liitä viestilinkki",
    notALink: "Tämä ei näytä viestilinkiltä. Siinä pitäisi olla ”#m=”.",
    incompleteTitle: "Tämä viestilinkki on vajaa",
    incomplete: "Osa linkistä näyttää puuttuvan. Sähköpostiohjelmat katkaisevat joskus pitkiä linkkejä. Kopioi koko linkki sähköpostista ja liitä se alle, tai pyydä lähettäjää lähettämään se uudelleen.",
    damaged: "Tämä viestilinkki on vajaa tai vioittunut. Sähköpostiohjelmat katkaisevat joskus pitkiä linkkejä. Kopioi koko linkki sähköpostista ja liitä se alle, tai pyydä lähettäjää lähettämään se uudelleen.",
    wrongInbox: "Tätä viestiä ei lähetetty avaamaasi postilaatikkoon. Jos sinulla on useampi Sigill-pääsyavain, yritä uudelleen ja valitse toinen.",
    receivedTitle: "Olet saanut suojatun viestin",
    receivedLead: "Sen voi avata vain suojatun postilaatikkosi pääsyavaimella.",
    instructions: "Napsauta painiketta ja vahvista Face ID:llä, sormenjäljellä tai laitteen PIN-koodilla.",
    openButton: "Avaa viesti",
    notForYou: "Eikö sinulla ole suojattua postilaatikkoa? Silloin viestiä ei ollut tarkoitettu sinulle, tai lähettäjä käytti väärää linkkiä.",
    messageTitle: "Suojattu viestisi",
    from: (email: string) => `Lähettäjä: ${email}`,
    reply: "Vastaa suojatusti",
    copyText: "Kopioi teksti",
    noReply: "Lähettäjä ei lisännyt osoitetta suojattua vastausta varten. Jos haluat vastata suojatusti, pyydä häneltä hänen suojattu linkkinsä.",
    staysEncrypted: "Viesti pysyy salattuna sähköpostissasi. Avaa linkki uudelleen aina, kun haluat lukea sen. ",
    showMyLink: "Näytä suojattu linkkini",
  },

  passkey: {
    cancelled: "Pääsyavainpyyntö peruttiin. Mikään ei muuttunut, joten voit vain yrittää uudelleen.",
    prfUnsupported:
      "Selaimesi tai salasanojen hallintasi ei vielä tue suojattua postilaatikkoa. Kokeile Safari-, Chrome- tai Edge-selainta laitteesi omilla pääsyavaimilla tai uutta 1Password- tai Bitwarden-versiota.",
    unavailable: "Tämä selain ei tue pääsyavaimia. Käytä ajantasaista Safari-, Chrome-, Edge- tai Firefox-selainta.",
    notSigill:
      "Tämä pääsyavain ei ole Sigill-postilaatikko: se kuuluu toiselle sivustolle samassa osoitteessa. Mitään ei muutettu. Yritä uudelleen ja valitse pääsyavain, jonka nimi on sähköpostiosoitteesi.",
    failed: (details: string) => `Pääsyavaimen kanssa tapahtui virhe: ${details}`,
  },

  mail: {
    messageSubject: "Suojattu viesti sinulle",
    messageBody: (link: string) =>
      "Hei!\n\n" +
      "Lähetin sinulle suojatun viestin. Avaa se pääsyavaimellasi napsauttamalla linkkiä:\n\n" +
      `${link}\n\n` +
      "Vain sinä voit lukea sen: se on salattu, eikä avain koskaan poistu salasanojen hallinnastasi.",
    inviteSubject: "Voinko lähettää sinulle jotain suojatusti?",
    inviteBody: (link: string) =>
      "Hei!\n\n" +
      "Haluaisin lähettää sinulle jotain luottamuksellista. Luothan maksuttoman suojatun postilaatikon. " +
      "Se vie puoli minuuttia, ei vaadi tiliä, ja vain sinä voit lukea, mitä lähetän:\n\n" +
      `${link}\n\n` +
      "Kun olet valmis, lähetä minulle suojattu linkkisi.\n\n" +
      "Kiitos!",
    linkSubject: "Suojattu linkkini",
    linkBody: (link: string) =>
      "Hei!\n\n" +
      "Tässä on suojattu linkkini. Sen avulla voit lähettää minulle luottamuksellisia viestejä, joita vain minä voin lukea:\n\n" +
      `${link}\n\n` +
      "Kiitos!",
    signature: "Lähetä minulle suojattu viesti",
    signatureTagline: "Sigill: salattu päästä päähän",
  },
};
