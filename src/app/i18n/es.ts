import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Volver",
    copied: "Copiado",
    copyFailed: "No se pudo copiar: selecciónalo y cópialo a mano",
    securityCode: "Código de seguridad",
    yourEmail: "Tu correo electrónico",
    emailPlaceholder: "tu@email.com",
    language: "Idioma",
    emailLanguage: "Idioma del correo",
    theme: "Tema",
    themeAuto: "Como el dispositivo",
    themeLight: "Claro",
    themeDark: "Oscuro",
    tooOld: "Este navegador es demasiado antiguo para Sigill. Actualízalo o usa una versión reciente de Safari, Chrome, Edge o Firefox.",
  },

  home: {
    lead: "Mensajes privados por correo electrónico normal. Solo la persona a la que escribes puede leerlos.",
    choicesLabel: "¿Qué quieres hacer?",
    sendTitle: "Enviar un mensaje seguro",
    sendText: "Escribe a alguien de forma confidencial",
    receiveTitle: "Recibir mensajes seguros",
    receiveText: "Consigue tu propio enlace seguro en 30 segundos",
    howTitle: "Cómo funciona",
    step1Strong: "El destinatario crea una bandeja de entrada",
    step1: " con una llave de acceso: Face ID, huella digital o el PIN del dispositivo. Sin cuenta ni contraseña.",
    step2Strong: "Comparte su enlace seguro",
    step2: " con quien deba poder escribirle.",
    step3Strong: "Los mensajes viajan como enlaces en correos normales.",
    step3: " Se cifran en tu navegador y solo la llave de acceso del destinatario puede abrirlos.",
    nothingStored: "No se guarda nada en ningún servidor. ",
    wontOpen: "¿Tienes un enlace de mensaje que no se abre?",
  },

  send: {
    title: "Enviar un mensaje seguro",
    lead: "Para escribir de forma segura, necesitas el enlace seguro del destinatario.",
    haveLink: "Tengo su enlace seguro",
    pasteLabel: "Pega el enlace aquí",
    pasteHelp: "O simplemente haz clic en el enlace de su correo.",
    notALink: "Eso no parece un enlace seguro. Debería contener «#to=».",
    noLinkYet: "Aún no tiene uno",
    noLinkText: "Envíale una breve invitación. Creará su bandeja de entrada en medio minuto y te devolverá su enlace.",
    theirEmail: "Su correo electrónico",
    theirEmailPlaceholder: "nombre@email.com",
    yourEmailHelp: "Para que pueda enviarte su enlace directamente.",
    ask: "Pedir por correo",
    copyInvitation: "Copiar invitación",
    asked: "Tu programa de correo debería abrirse con la invitación lista para enviar. Cuando te responda con su enlace seguro, haz clic en él para escribir tu mensaje.",
  },

  compose: {
    title: (email?: string) => (email ? `Mensaje seguro para ${email}` : "Mensaje seguro para el titular de este enlace"),
    lead: "Escribe tu mensaje abajo. Se cifra en este dispositivo antes de salir de él.",
    messageLabel: "Mensaje",
    placeholder: "Escribe tu mensaje…",
    sendEmail: "Enviar por correo",
    copyInstead: "Copiar en su lugar",
    encryptsAsYouType: "Tu mensaje se cifra mientras escribes.",
    encrypted: (email?: string) => (email ? `Cifrado. Solo ${email} puede leerlo.` : "Cifrado. Solo el titular de este enlace puede leerlo."),
    tooLongForMailto: "Es largo, así que se copiará para que lo pegues en el correo.",
    sent: (email?: string) =>
      "Tu programa de correo debería abrirse con el mensaje listo. Solo tienes que pulsar Enviar. " +
      (email
        ? `¿No se ha abierto nada? El mensaje se ha copiado: pégalo en un correo nuevo para ${email}.`
        : "¿No se ha abierto nada? El mensaje se ha copiado: pégalo en un correo nuevo."),
    copiedForPaste: "Tu mensaje se ha copiado. Pégalo en el correo que se abre (⌘V o Ctrl+V) y pulsa Enviar.",
    codeHelp: (email?: string) =>
      `Para más seguridad, pregunta ${email ? `a ${email}` : "al destinatario"} por teléfono o en persona si su bandeja de entrada muestra el mismo código. ` +
      "Si coincide, nadie ha cambiado el enlace por el camino.",
    replyOn: "Respuesta segura activada. ",
    replyAddress: "Las respuestas van a",
    replyOnText: (email?: string) => `${email ?? "El destinatario"} puede responder con un clic, y la respuesta irá cifrada a tu bandeja de entrada. `,
    replyRemove: "Quitar",
    replyAdd: "Permitir que responda de forma segura",
    replyAddHelp: "Añade tu bandeja de entrada segura al mensaje para que su respuesta también vaya cifrada. Lo confirmas con tu llave de acceso.",
    replyNoInbox: "¿Aún no tienes bandeja de entrada segura? Crea una ahora: basta con confirmar con tu llave de acceso, y tu mensaje se queda como está. ",
    replyCreate: "Crear mi bandeja de entrada",
    replyHaveInbox: "Ya tengo una bandeja de entrada",
    brokenTitle: "Este enlace seguro está incompleto",
    brokenText: "Parece que falta parte del enlace. A veces los programas de correo cortan los enlaces largos. Pide a esa persona que te vuelva a enviar su enlace seguro, o copia el enlace completo y pégalo en la ",
    brokenSendPage: "página Enviar",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} quiere enviarte algo de forma segura. Crea tu bandeja de entrada aquí abajo y envíale tu enlace. Solo lleva un momento.`,
    setupTitle: "Crea tu bandeja de entrada segura",
    setupLead: "Tu bandeja de entrada está protegida por una llave de acceso en tu gestor de contraseñas. No hay cuenta ni contraseña que recordar.",
    emailHelp: "Se añade a tu enlace para que los mensajes vayan dirigidos a ti automáticamente.",
    create: "Crear mi bandeja de entrada",
    emailMissing: "Primero escribe tu dirección de correo.",
    addAddress: "Añadir otra dirección…",
    addTitle: "Añadir otra dirección",
    backToLink: "Volver a mi enlace",
    unnamed: "Bandeja sin dirección",
    forget: "Olvidar esta bandeja de entrada en este navegador",
    unlock: "Ya tengo una bandeja de entrada: mostrar mi enlace",
    fact1: "Se te pedirá que guardes una llave de acceso. Confírmalo con Face ID, tu huella digital o el PIN del dispositivo.",
    fact2: "Tu llave de acceso se sincroniza con tus otros dispositivos (Llavero de iCloud, Gestor de contraseñas de Google, 1Password…), así que puedes abrir los mensajes en cualquier sitio.",
    fact3Strong: "No borres la llave de acceso:",
    fact3: " los mensajes enviados a esta bandeja de entrada solo se pueden abrir con ella.",
    factRemembered: "Este navegador recuerda tu enlace seguro, así que puedes compartirlo sin tu llave de acceso. La clave en sí se queda en la llave de acceso.",
    readyTitle: "Tu bandeja de entrada está lista",
    linkTitle: "Tu enlace seguro",
    readyLead: "Cualquiera con este enlace puede enviarte mensajes que solo tú puedes leer. Puedes compartirlo sin miedo: no sirve para leer nada.",
    linkLabel: "Tu enlace seguro",
    sendLinkTo: (email: string) => `Enviar mi enlace a ${email}`,
    shareLink: "Compartir mi enlace por correo",
    copyLink: "Copiar enlace",
    shared: "Tu programa de correo debería abrirse con tu enlace listo para enviar.",
    linkEmailHelp: "Se añade al enlace para que los mensajes vayan dirigidos a ti automáticamente.",
    codeHelp: "Quienes te escriben ven este código junto a tu nombre. Si os lo leéis y coincide, sabrán que el enlace es de verdad tuyo.",
    signatureTitle: "Añádelo a tu firma de correo",
    signatureLead: "Así, cualquiera que reciba un correo tuyo podrá responderte de forma segura con un clic.",
    copySignature: "Copiar firma",
    signatureHelp: "Pégala en los ajustes de firma: en Gmail, en Configuración → Firma; en Outlook, en Configuración → Correo → Redactar y responder; en Apple Mail, en Ajustes → Firmas.",
  },

  open: {
    pasteTitle: "Abrir un mensaje seguro",
    pasteLead: "Si al hacer clic en el enlace del correo no ha funcionado, copia el enlace completo y pégalo aquí.",
    pasteLabel: "Pega el enlace del mensaje",
    notALink: "Eso no parece un enlace de mensaje. Debería contener «#m=».",
    incompleteTitle: "Este enlace de mensaje está incompleto",
    incomplete: "Parece que falta parte del enlace. A veces los programas de correo cortan los enlaces largos. Copia el enlace completo del correo y pégalo abajo, o pide al remitente que te lo vuelva a enviar.",
    damaged: "Este enlace de mensaje está incompleto o dañado. A veces los programas de correo cortan los enlaces largos. Copia el enlace completo del correo y pégalo abajo, o pide al remitente que te lo vuelva a enviar.",
    wrongInbox: "Este mensaje no se envió a la bandeja de entrada que has desbloqueado. Si tienes más de una llave de acceso de Sigill, vuelve a intentarlo y elige otra.",
    receivedTitle: "Has recibido un mensaje seguro",
    receivedLead: "Solo se puede abrir con la llave de acceso de tu bandeja de entrada segura.",
    instructions: "Haz clic en el botón y confirma con Face ID, tu huella digital o el PIN del dispositivo.",
    openButton: "Abrir mensaje",
    notForYou: "¿No tienes una bandeja de entrada segura? Entonces este mensaje no era para ti, o el remitente usó un enlace equivocado.",
    messageTitle: "Tu mensaje seguro",
    from: (email: string) => `De ${email}`,
    reply: "Responder de forma segura",
    copyText: "Copiar texto",
    noReply: "El remitente no incluyó una dirección de respuesta segura. Para responder de forma segura, pídele su enlace seguro.",
    staysEncrypted: "Este mensaje sigue cifrado en tu correo. Vuelve a abrir el enlace cuando quieras leerlo. ",
    showMyLink: "Mostrar mi enlace seguro",
  },

  passkey: {
    cancelled: "Se canceló la solicitud de la llave de acceso. No ha cambiado nada, así que puedes volver a intentarlo.",
    prfUnsupported:
      "Tu navegador o gestor de contraseñas aún no puede alojar una bandeja de entrada segura. Prueba Safari, Chrome o Edge con las llaves de acceso integradas en tu dispositivo, o una versión reciente de 1Password o Bitwarden.",
    unavailable: "Este navegador no admite llaves de acceso. Usa una versión actualizada de Safari, Chrome, Edge o Firefox.",
    notSigill:
      "Esa llave de acceso no es una bandeja de Sigill: pertenece a otro sitio en la misma dirección. No ha cambiado nada. Inténtalo de nuevo y elige la llave con el nombre de tu correo electrónico.",
    failed: (details: string) => `Algo ha fallado con la llave de acceso: ${details}`,
  },

  mail: {
    messageSubject: "Un mensaje seguro para ti",
    messageBody: (link: string) =>
      "¡Hola!\n\n" +
      "Te he enviado un mensaje seguro. Haz clic en el enlace para abrirlo con tu llave de acceso:\n\n" +
      `${link}\n\n` +
      "Solo tú puedes leerlo: está cifrado y la llave nunca sale de tu gestor de contraseñas.",
    inviteSubject: "¿Te puedo enviar algo de forma segura?",
    inviteBody: (link: string) =>
      "¡Hola!\n\n" +
      "Me gustaría enviarte algo confidencial. Por favor, crea una bandeja de entrada segura gratuita. " +
      "Se tarda medio minuto, no hace falta cuenta y solo tú podrás leer lo que te envíe:\n\n" +
      `${link}\n\n` +
      "Cuando termines, envíame tu enlace seguro.\n\n" +
      "¡Gracias!",
    linkSubject: "Mi enlace seguro",
    linkBody: (link: string) =>
      "¡Hola!\n\n" +
      "Este es mi enlace seguro. Úsalo para enviarme mensajes confidenciales que solo yo puedo leer:\n\n" +
      `${link}\n\n` +
      "¡Gracias!",
    signature: "Envíame un mensaje seguro",
    signatureTagline: "Cifrado de extremo a extremo con Sigill",
  },
};
