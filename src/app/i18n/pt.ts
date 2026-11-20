import type { Messages } from "./en";

export const messages: Messages = {
  common: {
    back: "Voltar",
    copied: "Copiado",
    copyFailed: "Não foi possível copiar: selecione e copie manualmente",
    securityCode: "Código de segurança",
    yourEmail: "O seu endereço de e-mail",
    emailPlaceholder: "nome@email.com",
    language: "Idioma",
    emailLanguage: "Idioma do e-mail",
    settings: "Definições",
    rememberPeople: "Lembrá-las neste navegador",
    sourceCode: "Código aberto no GitHub",
    theme: "Tema",
    themeAuto: "Como o dispositivo",
    themeLight: "Claro",
    themeDark: "Escuro",
    tooOld: "Este navegador é demasiado antigo para o Sigill. Atualize-o ou use uma versão recente do Safari, Chrome, Edge ou Firefox.",
  },

  home: {
    lead: "Mensagens privadas por e-mail normal. Só a pessoa a quem escreve as pode ler.",
    choicesLabel: "O que pretende fazer?",
    sendTitle: "Enviar uma mensagem segura",
    sendText: "Escrever a alguém de forma confidencial",
    receiveTitle: "Receber mensagens seguras",
    receiveText: "Obter o seu próprio link seguro em 30 segundos",
    howTitle: "Como funciona",
    step1Strong: "O destinatário cria uma caixa de entrada",
    step1: " com uma chave de acesso: Face ID, impressão digital ou PIN do dispositivo. Sem conta nem palavra-passe.",
    step2Strong: "Partilha o seu link seguro",
    step2: " com quem deve poder escrever-lhe.",
    step3Strong: "As mensagens viajam como links em e-mails normais.",
    step3: " São encriptadas no navegador e só a chave de acesso do destinatário as pode abrir.",
    nothingStored: "Nada fica guardado em nenhum servidor. ",
    wontOpen: "Tem um link de mensagem que não abre?",
  },

  send: {
    title: "Enviar uma mensagem segura",
    lead: "Para escrever de forma segura, é preciso o link seguro do destinatário.",
    contactsTitle: "Pessoas com quem escreve",
    stopRemembering: "Deixar de lembrar pessoas neste navegador",
    confirmForget: "Esquecer todos na lista?",
    confirmStop: "Deixar de lembrar pessoas e esquecer todos na lista?",
    cancel: "Cancelar",
    forgetContacts: "Esquecer todos",
    contactsHelp: "Guardado apenas neste navegador. Os links delas não abrem nada, mas mostram com quem escreve.",
    haveLink: "Tenho o link seguro da pessoa",
    pasteLabel: "Cole o link aqui",
    pasteHelp: "Ou basta clicar no link do e-mail da pessoa.",
    notALink: "Isto não parece um link seguro. Deve conter «#to=».",
    noLinkYet: "A pessoa ainda não tem um",
    noLinkText: "Envie-lhe um breve convite. A pessoa cria a caixa de entrada em meio minuto e devolve-lhe o link.",
    theirEmail: "E-mail da pessoa",
    theirEmailPlaceholder: "nome@email.com",
    yourEmailOptional: "O seu endereço de e-mail (opcional)",
    otherAddress: "Outro endereço…",
    yourEmailHelp: "Para que a pessoa possa responder diretamente com o link.",
    ask: "Pedir por e-mail",
    copyInvitation: "Copiar convite",
    asked: "O programa de e-mail deverá abrir com o convite pronto a enviar. Quando a pessoa responder com o link seguro, basta clicar nele para escrever a mensagem.",
  },

  compose: {
    title: (email?: string) => (email ? `Mensagem segura para ${email}` : "Mensagem segura para o titular deste link"),
    lead: "Escreva a mensagem abaixo. É encriptada neste dispositivo antes de sair dele.",
    messageLabel: "Mensagem",
    placeholder: "Escreva a mensagem…",
    sendEmail: "Enviar por e-mail",
    copyInstead: "Copiar em vez disso",
    encryptsAsYouType: "A mensagem é encriptada à medida que escreve.",
    encrypted: (email?: string) => (email ? `Encriptada. Só ${email} a pode ler.` : "Encriptada. Só o titular deste link a pode ler."),
    tooLongForMailto: "É longa, por isso será copiada para a colar no e-mail.",
    sent: (email?: string) =>
      "O programa de e-mail deverá abrir com a mensagem pronta. Basta carregar em Enviar. " +
      (email
        ? `Não abriu nada? A mensagem foi copiada: cole-a num novo e-mail para ${email}.`
        : "Não abriu nada? A mensagem foi copiada: cole-a num novo e-mail."),
    copiedForPaste: "A mensagem foi copiada. Cole-a no e-mail que abrir (⌘V ou Ctrl+V) e carregue em Enviar.",
    codeHelp: (email?: string) =>
      `Para ter mais certeza, pergunte ${email ? `a ${email}` : "ao destinatário"} por telefone ou pessoalmente se a caixa de entrada mostra o mesmo código. ` +
      "Se coincidir, ninguém trocou o link pelo caminho.",
    replyOn: "Resposta segura ativada. ",
    keyChangedTitle: "Este não é o link que usou antes",
    keyChanged: (email: string) => `O link que usou antes para ${email} tinha outra chave. Pode ter criado uma caixa nova, ou alguém pode estar a fazer-se passar por essa pessoa. Antes de escrever, compare os códigos de segurança com ${email} por outro meio, por exemplo pessoalmente ou por telefone.`,
    knownCode: "Código que usou antes",
    newCode: "Código deste link",
    useNew: "Usar o link novo",
    useKnown: "Usar o link que conheço",
    replyAddress: "As respostas vão para",
    replyOnText: (email?: string) => `${email ?? "O destinatário"} pode responder com um clique, e a resposta chega encriptada à sua caixa de entrada. `,
    replyRemove: "Remover",
    replyAdd: "Permitir resposta segura",
    replyAddHelp: "Junta a sua caixa de entrada segura à mensagem, para que a resposta também seja encriptada. A confirmação é feita com a chave de acesso.",
    replyNoInbox: "Ainda não tem caixa de entrada segura? Crie uma agora: basta uma confirmação com a chave de acesso, e a mensagem fica como está. ",
    replyCreate: "Criar a minha caixa de entrada",
    replyHaveInbox: "Já tenho uma caixa de entrada",
    brokenTitle: "Este link seguro está incompleto",
    brokenText: "Parece faltar parte do link. Os programas de e-mail por vezes cortam links longos. Peça à pessoa que volte a enviar o link seguro, ou copie o link completo e cole-o na ",
    brokenSendPage: "página Enviar",
    brokenEnd: ".",
  },

  inbox: {
    invited: (email: string) => `${email} gostaria de lhe enviar algo de forma segura. Crie a sua caixa de entrada abaixo e envie-lhe o seu link. Demora só um momento.`,
    setupTitle: "Criar a sua caixa de entrada segura",
    setupLead: "A caixa de entrada é protegida por uma chave de acesso no gestor de palavras-passe. Não há conta nem palavra-passe para memorizar.",
    emailHelp: "É adicionado ao link para que as mensagens venham endereçadas automaticamente.",
    create: "Criar a minha caixa de entrada",
    emailMissing: "Introduza primeiro o endereço de e-mail.",
    addAddress: "Adicionar outro endereço…",
    addTitle: "Adicionar outro endereço",
    backToLink: "Voltar ao meu link",
    unnamed: "Caixa sem endereço",
    forget: "Esquecer esta caixa de entrada neste navegador",
    unlock: "Já tenho uma caixa de entrada: mostrar o meu link",
    fact1: "Será pedido que guarde uma chave de acesso. Confirme com Face ID, impressão digital ou o PIN do dispositivo.",
    fact2: "A chave de acesso é sincronizada com os outros dispositivos (Porta-chaves iCloud, Gestor de palavras-passe da Google, 1Password…), por isso as mensagens abrem-se em qualquer lado.",
    fact3Strong: "Não apague a chave de acesso:",
    fact3: " as mensagens enviadas para esta caixa de entrada só podem ser abertas com ela.",
    factRemembered: "Este navegador memoriza o link seguro, para que o possa partilhar sem a chave de acesso. A chave em si fica sempre na chave de acesso.",
    readyTitle: "A caixa de entrada está pronta",
    linkTitle: "O seu link seguro",
    readyLead: "Quem tiver este link pode enviar-lhe mensagens que mais ninguém consegue ler. Pode partilhá-lo à vontade: não serve para ler nada.",
    linkLabel: "O seu link seguro",
    sendLinkTo: (email: string) => `Enviar o meu link a ${email}`,
    shareLink: "Partilhar o meu link por e-mail",
    copyLink: "Copiar link",
    shared: "O programa de e-mail deverá abrir com o link pronto a enviar.",
    linkEmailHelp: "É adicionado ao link para que as mensagens venham endereçadas automaticamente.",
    codeHelp: "Quem lhe escreve vê este código junto ao seu nome. Se o lerem um ao outro e coincidir, fica a saber que o link é mesmo seu.",
    signatureTitle: "Adicionar à assinatura de e-mail",
    signatureLead: "Assim, quem receber um e-mail seu pode responder de forma segura com um clique.",
    copySignature: "Copiar assinatura",
    signatureHelp: "Cole-a nas definições de assinatura: no Gmail em Definições → Assinatura, no Outlook em Definições → Correio → Compor e responder, no Apple Mail em Definições → Assinaturas.",
  },

  open: {
    pasteTitle: "Abrir uma mensagem segura",
    pasteLead: "Se clicar no link do e-mail não funcionou, copie o link completo e cole-o aqui.",
    pasteLabel: "Cole o link da mensagem",
    notALink: "Isto não parece um link de mensagem. Deve conter «#m=».",
    incompleteTitle: "Este link de mensagem está incompleto",
    incomplete: "Parece faltar parte do link. Os programas de e-mail por vezes cortam links longos. Copie o link completo do e-mail e cole-o abaixo, ou peça ao remetente que o volte a enviar.",
    damaged: "Este link de mensagem está incompleto ou danificado. Os programas de e-mail por vezes cortam links longos. Copie o link completo do e-mail e cole-o abaixo, ou peça ao remetente que o volte a enviar.",
    wrongInbox: "Esta mensagem não foi enviada para a caixa de entrada desbloqueada. Foi escrita para outra ligação segura, talvez uma das suas mais antigas. Se tiver mais do que uma chave de acesso do Sigill, tente novamente e escolha outra. Caso contrário, peça ao remetente que escreva para a sua ligação atual.",
    wrongInboxOrDamaged: "Esta mensagem não pôde ser aberta com a caixa de entrada desbloqueada. Ou foi enviada para outra caixa, ou a ligação foi danificada pelo caminho. Se tiver mais do que uma chave de acesso do Sigill, tente novamente e escolha outra. Caso contrário, copie a ligação completa do e-mail e cole-a abaixo.",
    receivedTitle: "Recebeu uma mensagem segura",
    receivedLead: "Só pode ser aberta com a chave de acesso da sua caixa de entrada segura.",
    instructions: "Clique no botão e confirme com Face ID, impressão digital ou o PIN do dispositivo.",
    openButton: "Abrir mensagem",
    notForYou: "Não tem caixa de entrada segura? Então esta mensagem não se destinava a si, ou o remetente usou o link errado.",
    messageTitle: "A sua mensagem segura",
    keyChanged: (email: string) => `Esta mensagem diz ser de ${email}, mas o link de resposta não é o que conhece dessa pessoa. Alguém pode estar a fazer-se passar por ela.`,
    from: (email: string) => `De ${email}`,
    reply: "Responder de forma segura",
    copyText: "Copiar texto",
    noReply: "O remetente não incluiu um endereço de resposta segura. Para responder de forma segura, peça-lhe o link seguro.",
    staysEncrypted: "Esta mensagem continua encriptada no seu e-mail. Abra o link novamente sempre que a quiser ler. ",
    showMyLink: "Mostrar o meu link seguro",
  },

  passkey: {
    cancelled: "O pedido da chave de acesso foi cancelado. Nada mudou, por isso basta tentar de novo.",
    prfUnsupported:
      "O navegador ou gestor de palavras-passe ainda não suporta uma caixa de entrada segura. Experimente o Safari, Chrome ou Edge com as chaves de acesso integradas no dispositivo, ou uma versão recente do 1Password ou Bitwarden.",
    unavailable: "Este navegador não suporta chaves de acesso. Use uma versão atualizada do Safari, Chrome, Edge ou Firefox.",
    notSigill:
      "Essa chave de acesso não é uma caixa Sigill: pertence a outro site no mesmo endereço. Nada foi alterado. Tente novamente e escolha a chave com o nome do seu endereço de e-mail.",
    failed: (details: string) => `Ocorreu um problema com a chave de acesso: ${details}`,
  },

  mail: {
    messageSubject: "Uma mensagem segura para si",
    messageBody: (link: string) =>
      "Olá,\n\n" +
      "Enviei-lhe uma mensagem segura. Clique no link para a abrir com a sua chave de acesso:\n\n" +
      `${link}\n\n` +
      "Mais ninguém a pode ler: está encriptada, e a chave nunca sai do seu gestor de palavras-passe.",
    inviteSubject: "Posso enviar-lhe algo de forma segura?",
    inviteBody: (link: string) =>
      "Olá,\n\n" +
      "Gostaria de lhe enviar algo confidencial. Pode criar uma caixa de entrada segura gratuita? " +
      "Demora meio minuto, não precisa de conta, e mais ninguém poderá ler o que eu enviar:\n\n" +
      `${link}\n\n` +
      "Quando terminar, envie-me o seu link seguro.\n\n" +
      "Agradeço desde já!",
    linkSubject: "O meu link seguro",
    linkBody: (link: string) =>
      "Olá,\n\n" +
      "Aqui está o meu link seguro. Use-o para me enviar mensagens confidenciais que só eu posso ler:\n\n" +
      `${link}\n\n` +
      "Até breve!",
    signature: "Envie-me uma mensagem segura",
    signatureTagline: "Encriptado de ponta a ponta com o Sigill",
  },
};
