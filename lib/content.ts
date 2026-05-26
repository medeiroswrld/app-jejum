export interface Guide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'guia' | 'ciencia' | 'nutricao';
  sections: { heading: string; body: string }[];
}

export interface MealPlan {
  protocol: string;
  description: string;
  meals: {
    time: string;
    label: string;
    suggestions: string[];
    tip?: string;
  }[];
  snackIdeas: string[];
  avoidList: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DailyTip {
  id: number;
  text: string;
  author?: string;
}

// ==============================
// PLANOS ALIMENTARES POR PROTOCOLO
// ==============================

export const MEAL_PLANS: MealPlan[] = [
  {
    protocol: '12:12',
    description:
      'O protocolo 12:12 é o mais suave e acessível. Você jejua por 12 horas (geralmente durante o sono) e tem uma janela alimentar de 12 horas. Ideal para quem está começando ou possui condições de saúde que pedem cautela.',
    meals: [
      {
        time: '8h',
        label: 'Café da manhã',
        suggestions: [
          'Ovos mexidos com espinafre e tomate + 1 fatia de pão integral',
          'Iogurte natural com granola caseira, banana e canela',
          'Tapioca com queijo branco e orégano + suco de laranja natural',
          'Mingau de aveia com frutas vermelhas e mel',
        ],
        tip: 'Comece o dia com proteína para manter a saciedade por mais tempo.',
      },
      {
        time: '12h',
        label: 'Almoço',
        suggestions: [
          'Filé de frango grelhado + arroz integral + feijão + salada colorida com azeite',
          'Salmão assado com batata-doce e brócolis no vapor',
          'Omelete de legumes + salada de folhas com grão-de-bico',
          'Carne magra com mandioca cozida, couve refogada e cenoura',
        ],
        tip: 'Monte o prato com ½ de vegetais, ¼ de proteína e ¼ de carboidrato.',
      },
      {
        time: '15h',
        label: 'Lanche da tarde',
        suggestions: [
          'Mix de castanhas (30g) + 1 fruta da estação',
          'Banana com pasta de amendoim natural',
          'Palitos de cenoura e pepino com homus',
          'Iogurte natural com sementes de chia',
        ],
      },
      {
        time: '19h30',
        label: 'Jantar',
        suggestions: [
          'Sopa de legumes com frango desfiado',
          'Salada completa com atum, ovo cozido, tomate e abacate',
          'Peixe grelhado com purê de abóbora e vagem',
          'Wrap integral com frango, alface e tomate',
        ],
        tip: 'Jante pelo menos 2 horas antes de dormir para melhorar a digestão e o sono.',
      },
    ],
    snackIdeas: [
      'Chá de camomila ou erva-cidreira (sem açúcar)',
      'Água com rodelas de limão ou pepino',
      '1 quadrado de chocolate 70%+ cacau',
      'Pipoca natural sem óleo (porção pequena)',
    ],
    avoidList: [
      'Refrigerantes e sucos industrializados',
      'Biscoitos recheados e salgadinhos de pacote',
      'Pão branco e massas refinadas em excesso',
      'Embutidos (presunto, salsicha, linguiça)',
      'Frituras e alimentos ultraprocessados',
      'Adoçantes artificiais em excesso',
    ],
  },
  {
    protocol: '14:10',
    description:
      'No protocolo 14:10, você jejua por 14 horas e tem 10 horas para se alimentar. É o passo intermediário perfeito — mantém a praticidade sem exigir longos períodos sem comer. Ideal para iniciantes.',
    meals: [
      {
        time: '9h',
        label: 'Primeira refeição (Brunch)',
        suggestions: [
          'Omelete de 2 ovos com queijo branco, tomate e manjericão + café sem açúcar',
          'Panqueca de banana com aveia + frutas frescas',
          'Pão integral com abacate amassado, ovo poché e sementes de gergelim',
          'Smoothie de banana, espinafre, pasta de amendoim e leite vegetal',
        ],
        tip: 'Quebre o jejum com calma. Não precisa comer uma refeição enorme — ouça seu corpo.',
      },
      {
        time: '12h30',
        label: 'Almoço completo',
        suggestions: [
          'Peito de frango com arroz integral, lentilha e salada de rúcula com manga',
          'Posta de peixe assado com quinoa, cenoura e vagem ao alho',
          'Carne de panela com mandioca, couve e farofa de ovos',
          'Bowl de grão-de-bico com legumes assados, tahine e arroz',
        ],
        tip: 'Essa é a refeição principal do dia. Capriche nos vegetais e na proteína.',
      },
      {
        time: '15h30',
        label: 'Lanche nutritivo',
        suggestions: [
          'Mix de oleaginosas (castanha-do-pará, amêndoa, noz) + 1 fruta',
          'Iogurte grego com mel e sementes de linhaça',
          'Torrada integral com ricota e geleia sem açúcar',
          'Vitamina de abacate com cacau em pó',
        ],
      },
      {
        time: '18h30',
        label: 'Jantar leve',
        suggestions: [
          'Sopa cremosa de abóbora com gengibre e frango desfiado',
          'Salada morna de quinoa com legumes grelhados e ovo cozido',
          'Peixe no vapor com purê de batata-doce e aspargos',
          'Crepioca (tapioca + ovo) com recheio de espinafre e ricota',
        ],
        tip: 'Feche a janela alimentar com uma refeição mais leve — facilita a transição para o jejum.',
      },
    ],
    snackIdeas: [
      'Chá verde ou de hibisco (morno ou gelado, sem açúcar)',
      'Água saborizada com hortelã e limão',
      'Gelatina sem açúcar com frutas',
      '2 tâmaras recheadas com pasta de amendoim',
    ],
    avoidList: [
      'Café com açúcar ou leite durante o jejum (quebra o jejum)',
      'Pães e bolos industrializados',
      'Molhos prontos (ketchup, maionese, barbecue)',
      'Sucos de caixinha e refrigerantes',
      'Margarina e gorduras trans',
      'Comida congelada industrializada',
    ],
  },
  {
    protocol: '16:8',
    description:
      'O 16:8 é o protocolo clássico de jejum intermitente. Jejua por 16 horas e concentra todas as refeições em uma janela de 8 horas. Exige mais disciplina, mas os benefícios são consistentes quando praticado com regularidade.',
    meals: [
      {
        time: '11h',
        label: 'Primeira refeição (almoço antecipado)',
        suggestions: [
          'Filé de frango grelhado com batata-doce assada e salada mediterrânea',
          'Bowl de salmão com arroz integral, edamame, pepino e molho de gengibre',
          'Bife grelhado com purê de mandioquinha, couve refogada e feijão preto',
          'Risoto de cogumelos com frango desfiado e salada verde',
        ],
        tip: 'Quebre o jejum com uma refeição equilibrada e completa. Evite começar com doces ou carboidratos isolados.',
      },
      {
        time: '14h30',
        label: 'Lanche substancial',
        suggestions: [
          'Sanduíche natural de frango com salada + suco verde',
          'Bowl de açaí com banana, granola e pasta de amendoim (porção moderada)',
          'Wrap integral com atum, alface, cenoura ralada e cream cheese',
          'Ovos cozidos (2) com abacate fatiado e torrada integral',
        ],
        tip: 'Esse lanche precisa ser mais robusto porque sustenta até o jantar.',
      },
      {
        time: '18h30',
        label: 'Última refeição (jantar)',
        suggestions: [
          'Peixe assado com legumes grelhados (abobrinha, berinjela, pimentão)',
          'Frango ao molho de tomate caseiro com espaguete de abobrinha',
          'Sopa densa de lentilha com legumes e azeite extra virgem',
          'Omelete recheada com cogumelos, espinafre e queijo + salada',
        ],
        tip: 'Termine de comer até as 19h para completar as 16 horas de jejum no dia seguinte às 11h.',
      },
    ],
    snackIdeas: [
      'Durante o jejum: água, café preto, chá sem açúcar (não quebram o jejum)',
      'Na janela: mix de castanhas, frutas frescas, iogurte natural',
      'Água com gás e limão para momentos de "vontade"',
      'Chocolate 85% cacau (1 quadrado) após o jantar',
    ],
    avoidList: [
      'Qualquer alimento calórico durante as 16h de jejum',
      'Compensar o jejum comendo em excesso na janela',
      'Fast food e delivery ultraprocessado',
      'Doces concentrados e sobremesas açucaradas',
      'Bebidas alcoólicas (interferem na queima de gordura)',
      'Pular refeições na janela alimentar (coma todas!)',
    ],
  },
];

// ==============================
// DICAS DIÁRIAS ROTATIVAS
// ==============================

export const DAILY_TIPS: DailyTip[] = [
  { id: 1, text: 'Beba um copo grande de água assim que acordar. Seu corpo passou horas sem hidratação e isso faz toda a diferença na disposição.' },
  { id: 2, text: 'Não pule refeições dentro da sua janela alimentar. O objetivo do jejum é organizar, não restringir.' },
  { id: 3, text: 'Se sentir tontura ou mal-estar durante o jejum, interrompa e coma algo leve. Seu bem-estar vem primeiro.' },
  { id: 4, text: 'Café preto, chá verde e água com gás não quebram o jejum. Use-os como aliados nos momentos de fome.' },
  { id: 5, text: 'Caminhar 20 minutos por dia acelera os resultados do jejum intermitente e melhora o humor.' },
  { id: 6, text: 'Durma 7 a 8 horas por noite. O sono é tão importante quanto a alimentação para o emagrecimento.' },
  { id: 7, text: 'Mastigue devagar. Leva cerca de 20 minutos para o cérebro registrar saciedade.' },
  { id: 8, text: 'Troque o suco industrializado por uma fruta inteira. A fibra da fruta sacia mais e tem menos impacto na glicose.' },
  { id: 9, text: 'Inclua uma fonte de gordura boa em cada refeição: azeite, abacate, castanhas ou sementes.' },
  { id: 10, text: 'Anote como você se sente a cada dia. Esse registro emocional ajuda a entender seus padrões alimentares.' },
  { id: 11, text: 'Evite ficar pesando-se todos os dias. O peso oscila naturalmente — confie no processo e olhe a tendência semanal.' },
  { id: 12, text: 'Prepare suas refeições com antecedência quando possível. Ter comida saudável pronta evita escolhas impulsivas.' },
  { id: 13, text: 'Estresse crônico aumenta o cortisol, que favorece o acúmulo de gordura abdominal. Encontre formas de relaxar.' },
  { id: 14, text: 'Proteína é sua melhor amiga no jejum intermitente. Ela mantém a massa muscular e prolonga a saciedade.' },
  { id: 15, text: 'Não compare seu progresso com o de outras pessoas. Cada corpo tem seu ritmo, especialmente após os 39 anos.' },
  { id: 16, text: 'O chá de canela ajuda a estabilizar o açúcar no sangue e pode ser um ótimo aliado durante o jejum.' },
  { id: 17, text: 'Substitua o arroz branco pelo integral pelo menos 3 vezes por semana. A fibra extra ajuda na saciedade.' },
  { id: 18, text: 'Evite comer assistindo TV ou mexendo no celular. Comer com atenção plena reduz a tendência de comer demais.' },
  { id: 19, text: 'Se errou um dia, não desista. Um dia fora do plano não apaga o progresso dos outros dias.' },
  { id: 20, text: 'Vegetais crus e cozidos devem ocupar metade do seu prato. Eles fornecem fibras, vitaminas e volume com poucas calorias.' },
  { id: 21, text: 'Hoje é o último dia do seu programa de 21 dias! Reflita sobre o quanto você evoluiu desde o primeiro dia. 💜' },
];

// ==============================
// FAQ COMPLETO
// ==============================

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'O jejum intermitente é seguro para mulheres acima de 40 anos?',
    answer: 'Sim, quando praticado de forma consciente e moderada. Estudos mostram que o jejum intermitente pode ser especialmente benéfico nessa faixa etária, ajudando na regulação hormonal, na sensibilidade à insulina e no controle de peso. Porém, mulheres com condições de saúde específicas (diabetes, problemas cardíacos, gravidez ou histórico de transtorno alimentar) devem sempre consultar um profissional de saúde antes de iniciar.',
  },
  {
    question: 'Vou perder massa muscular fazendo jejum?',
    answer: 'Não, se você mantiver uma ingestão adequada de proteína durante a janela alimentar e, idealmente, praticar alguma atividade física (mesmo que leve, como caminhada). O corpo prioriza a queima de gordura durante o jejum, não de músculo. O importante é não restringir demais as calorias nas refeições.',
  },
  {
    question: 'Posso tomar café durante o jejum?',
    answer: 'Sim! Café preto puro, sem açúcar, leite ou adoçantes calóricos, não quebra o jejum. O mesmo vale para chás puros e água (com ou sem gás). Evite adicionar mel, leite ou creme — esses ingredientes contêm calorias e interrompem os benefícios metabólicos do jejum.',
  },
  {
    question: 'E se eu sentir muita fome durante o jejum?',
    answer: 'A fome durante o jejum é normal, especialmente nas primeiras semanas. Ela vem em ondas e geralmente passa em 15-20 minutos. Beba água, chá ou café preto quando sentir fome. Se a fome for muito intensa, insuportável ou acompanhada de tontura, interrompa o jejum e coma algo leve — forçar nunca é o caminho.',
  },
  {
    question: 'Qual a diferença entre jejum intermitente e dieta restritiva?',
    answer: 'A diferença é fundamental: o jejum intermitente organiza QUANDO você come, não restringe O QUE nem QUANTO você come. Não existe contagem de calorias, proibição de alimentos ou "lista de pecados". Você come normalmente durante a janela alimentar, priorizando comida de verdade. Dietas restritivas cortam nutrientes; o jejum apenas reorganiza o horário.',
  },
  {
    question: 'Posso fazer exercício durante o jejum?',
    answer: 'Sim, exercícios leves a moderados (caminhada, yoga, alongamento) podem ser feitos em jejum sem problemas. Para treinos intensos (musculação pesada, HIIT), é recomendável treinar dentro da janela alimentar ou logo antes de quebrá-la, garantindo que você terá nutrientes para a recuperação muscular.',
  },
  {
    question: 'O jejum intermitente afeta os hormônios femininos?',
    answer: 'Quando praticado de forma moderada (12-16 horas), o jejum intermitente pode até melhorar o perfil hormonal, especialmente a sensibilidade à insulina e a regulação do cortisol. Porém, jejuns muito longos (20h+) ou combinados com restrição calórica severa podem desregular hormônios reprodutivos. Por isso, recomendamos protocolos conservadores e acompanhamento do seu corpo.',
  },
  {
    question: 'Quanto tempo leva para ver resultados?',
    answer: 'A maioria das mulheres nota mudanças na disposição e no inchaço já na primeira semana. Resultados na balança geralmente aparecem entre 2 e 4 semanas. Porém, o peso não é o único indicador: melhora no sono, mais energia, menos compulsão alimentar e roupas mais folgadas são sinais reais de progresso que muitas vezes precedem a mudança no número da balança.',
  },
  {
    question: 'Posso fazer jejum intermitente todos os dias?',
    answer: 'Sim, o jejum intermitente é projetado para ser um estilo de vida sustentável, não uma dieta temporária. Muitas pessoas praticam 5-7 dias por semana. Nos finais de semana ou em eventos sociais, você pode flexibilizar sem culpa. A consistência de longo prazo importa mais do que a perfeição diária.',
  },
  {
    question: 'O que acontece se eu quebrar o jejum antes do tempo?',
    answer: 'Absolutamente nada de ruim. Você ainda colheu os benefícios das horas que jejuou. O jejum intermitente não é "tudo ou nada". Se você planejou 16 horas e conseguiu 13, isso ainda é ótimo. Não se puna — o progresso vem da consistência ao longo das semanas, não da perfeição de um único dia.',
  },
  {
    question: 'O jejum pode piorar a menopausa ou pré-menopausa?',
    answer: 'Pelo contrário: muitas mulheres relatam melhora nos sintomas da peri e pós-menopausa com o jejum intermitente moderado, incluindo menos ondas de calor, melhor qualidade de sono e mais estabilidade de humor. O protocolo 14:10 é geralmente o mais bem tolerado nessa fase. Ouça sempre seu corpo e ajuste conforme necessário.',
  },
];

// ==============================
// GUIAS COMPLETOS (EXPANDIDOS)
// ==============================

export const GUIDES: Guide[] = [
  {
    id: 'desinchar',
    title: 'Desinchando em 7 Dias',
    subtitle: 'Hábitos simples para reduzir a retenção e o inchaço',
    icon: '💧',
    category: 'guia',
    sections: [
      {
        heading: 'Hidrate-se de verdade',
        body: 'Pode parecer contraintuitivo, mas beber mais água ajuda o corpo a reter menos líquido. Quando você bebe pouca água, o organismo interpreta como escassez e retém o máximo possível. Tenha uma garrafa sempre por perto e busque consumir pelo menos 2 litros ao longo do dia. Adicione rodelas de limão ou folhas de hortelã para tornar o hábito mais prazeroso.',
      },
      {
        heading: 'Reduza o sódio escondido',
        body: 'Ultraprocessados, embutidos e temperos prontos concentram muito sódio, que favorece o inchaço. Você sabia que um pacote de macarrão instantâneo tem quase 2g de sódio — praticamente o limite diário recomendado? Prefira comida de verdade e tempere com ervas frescas, alho, cebola, limão e especiarias.',
      },
      {
        heading: 'Movimente o corpo diariamente',
        body: 'Uma caminhada leve de 20 a 30 minutos por dia já ajuda a circulação linfática e reduz a sensação de inchaço, principalmente nas pernas e no abdômen. Não precisa ser exercício intenso — o simples ato de se mover regularmente ativa o sistema que drena o excesso de líquido dos tecidos.',
      },
      {
        heading: 'Priorize o sono reparador',
        body: 'Noites mal dormidas desregulam hormônios ligados ao apetite (grelina e leptina) e à retenção de líquidos. Tente manter um horário de sono constante, evite telas 1 hora antes de dormir e mantenha o quarto escuro e fresco. Dormir 7-8 horas consistentes faz mais pela desinchação do que qualquer chá diurético.',
      },
      {
        heading: 'Inclua mais fibras naturais',
        body: 'Vegetais, frutas com casca, leguminosas e grãos integrais ajudam o intestino a funcionar regularmente — e um intestino regulado significa menos inchaço abdominal e mais conforto. Comece o dia com uma porção de aveia ou inclua uma salada generosa no almoço.',
      },
      {
        heading: 'Chás aliados (sem exagero)',
        body: 'Chá de hibisco, cavalinha e dente-de-leão têm propriedades diuréticas suaves e podem ajudar no processo de desinchação. Consuma 2-3 xícaras por dia, sem açúcar. Importante: chás não fazem milagre sozinhos — eles complementam os outros hábitos, não os substituem.',
      },
      {
        heading: 'O que esperar em 7 dias',
        body: 'Seguindo essas práticas de forma consistente, a maioria das mulheres nota redução visível no inchaço abdominal e facial entre o 3º e o 5º dia. Não confunda desinchação com emagrecimento — são processos diferentes. A desinchação é rápida e motivadora; o emagrecimento é gradual e sustentável.',
      },
    ],
  },
  {
    id: 'sanfona',
    title: 'Anti-Efeito Sanfona',
    subtitle: 'Como manter o resultado sem voltar à estaca zero',
    icon: '⚖️',
    category: 'guia',
    sections: [
      {
        heading: 'Entenda por que o efeito sanfona acontece',
        body: 'O efeito sanfona não é falta de força de vontade — é uma resposta biológica. Quando você faz dietas muito restritivas, o corpo reduz o metabolismo basal para economizar energia. Quando volta a comer normalmente, o metabolismo ainda está lento, e o peso volta (muitas vezes com juros). A solução? Nunca fazer dietas extremas.',
      },
      {
        heading: 'Consistência vence intensidade',
        body: 'O segredo não é se esforçar mais por pouco tempo — é se esforçar de leve por muito tempo. Fazer jejum intermitente moderado por 6 meses gera resultados infinitamente melhores do que um jejum extremo de 30 dias seguido de abandono. Pense em anos, não em semanas.',
      },
      {
        heading: 'Não trate o jejum como castigo',
        body: 'O jejum intermitente funciona melhor como um ritmo de vida, não como punição por ter comido algo "errado". Quando ele vira hábito natural — como escovar os dentes —, manter o peso deixa de ser uma luta e vira simplesmente o seu normal.',
      },
      {
        heading: 'Crie um "piso" de hábitos mínimos',
        body: 'Defina o que você faz mesmo nos seus piores dias: talvez seja um jejum de 12 horas e uma caminhada de 10 minutos. Esse "piso" é o que impede que um dia ruim vire uma semana ruim, que vire um mês de abandono. O piso não precisa ser perfeito — só precisa existir.',
      },
      {
        heading: 'Acompanhe, não obsessione',
        body: 'Pesar-se uma a duas vezes por semana, sempre no mesmo horário (de manhã, em jejum), é o suficiente. O peso oscila naturalmente 1-2kg dependendo de hidratação, ciclo menstrual e intestino. Olhe a tendência de 4 semanas, nunca o número de um dia isolado.',
      },
      {
        heading: 'Tenha um plano para os deslizes',
        body: 'Um dia fora do plano não estraga nada. O que estraga é transformar um dia em uma semana, uma semana em um mês. A regra é simples: voltou no dia seguinte? Está tudo certo. Sem drama, sem culpa, sem recomeço emocional. Apenas continue.',
      },
    ],
  },
  {
    id: 'mente',
    title: 'Mente no Lugar',
    subtitle: 'Para começar de verdade — e não desistir na primeira semana',
    icon: '🧠',
    category: 'guia',
    sections: [
      {
        heading: 'Por que começar é tão difícil?',
        body: 'Nosso cérebro é programado para preferir o conforto do conhecido. Mudar hábitos exige energia mental — e o cérebro resiste a isso. Saber que a dificuldade inicial é biológica (não fraqueza sua) já muda a perspectiva. A boa notícia: após 7-10 dias de consistência, o novo padrão começa a se tornar automático.',
      },
      {
        heading: 'Comece ridiculamente pequeno',
        body: 'Não tente mudar tudo de uma vez. Escolha UMA ÚNICA mudança para esta semana. Pode ser fechar a cozinha às 20h, ou adicionar um vegetal a cada refeição. Pequeno e feito vence grande e abandonado. Na próxima semana, adicione outro micro-hábito.',
      },
      {
        heading: 'Decida na noite anterior',
        body: 'Deixe definido à noite a que horas você vai abrir e fechar sua janela alimentar no dia seguinte. Decisão tomada com antecedência, em estado calmo, é decisão que se cumpre. Quando você acorda sem plano, a tendência é ceder ao impulso.',
      },
      {
        heading: 'Fale com você como falaria com uma amiga',
        body: 'Autocrítica dura não motiva ninguém — só desanima e gera culpa, que leva a comer emocionalmente, que gera mais culpa. É um ciclo destrutivo. Trate seus tropeços com a mesma gentileza que você daria a alguém que ama. "Hoje não foi como eu planejei, e tudo bem. Amanhã eu retomo."',
      },
      {
        heading: 'Identifique seus gatilhos emocionais',
        body: 'Muitas vezes comemos não por fome, mas por tédio, ansiedade, tristeza ou estresse. Antes de comer fora da janela, pare e pergunte: "Eu estou com fome de verdade ou estou sentindo outra coisa?" Se for emocional, tente uma caminhada, um chá, uma conversa ou 5 minutos de respiração profunda.',
      },
      {
        heading: 'Celebre cada dia cumprido',
        body: 'Marcar o dia como concluído no acompanhamento parece bobo, mas funciona: cada pequeno registro ativa o sistema de recompensa do cérebro e reforça que você é capaz. Olhar para uma sequência de dias marcados é poderoso — é prova visual de que você consegue.',
      },
      {
        heading: 'Visualize quem você quer ser',
        body: 'Reserve 2 minutos por dia para se imaginar no final dos 21 dias: mais leve, mais disposta, orgulhosa de si mesma. Visualização não é bobagem — é uma técnica usada por atletas e validada por neurociência. O cérebro não diferencia bem entre imaginar e fazer, e isso cria motivação real.',
      },
    ],
  },
  {
    id: 'ciencia-jejum',
    title: 'A Ciência do Jejum Intermitente',
    subtitle: 'Entenda o que realmente acontece no seu corpo — sem mitos',
    icon: '🔬',
    category: 'ciencia',
    sections: [
      {
        heading: 'O que é jejum intermitente, de verdade?',
        body: 'Jejum intermitente (JI) não é uma dieta — é um padrão alimentar que alterna períodos de alimentação com períodos de jejum. Diferente de dietas que dizem O QUE comer, o JI define QUANDO comer. Nossos ancestrais praticavam naturalmente: não tinham geladeira nem delivery. O corpo humano evoluiu para funcionar bem alternando momentos de abundância e escassez.',
      },
      {
        heading: 'Fases metabólicas do jejum',
        body: 'Nas primeiras 4 horas após comer, o corpo digere e absorve nutrientes (estado alimentado). Entre 4-8 horas, a insulina cai e o corpo começa a usar reservas de glicogênio do fígado. Após 10-12 horas, o glicogênio se esgota e o corpo inicia a lipólise (queima de gordura) como fonte principal de energia. A partir de 14-16 horas, muitas pessoas relatam mais clareza mental, possivelmente relacionada ao aumento de cetonas no cérebro.',
      },
      {
        heading: 'Insulina: a chave de tudo',
        body: 'A insulina é o hormônio que regula o armazenamento de gordura. Quando comemos, a insulina sobe e sinaliza ao corpo para ARMAZENAR energia. Quando jejuamos, a insulina cai e o corpo passa a USAR as reservas. O problema moderno? Comemos o dia inteiro — do café com biscoito às 6h ao "lancinho" às 23h — e a insulina nunca tem chance de cair. O JI restaura esse ciclo natural.',
      },
      {
        heading: 'Autofagia: a "reciclagem celular"',
        body: 'A partir de 12-16 horas de jejum, um processo chamado autofagia se intensifica. As células começam a "reciclar" componentes danificados, como proteínas defeituosas e organelas envelhecidas. É como uma faxina interna. O cientista japonês Yoshinori Ohsumi ganhou o Nobel de Medicina em 2016 por descobrir os mecanismos da autofagia. Ela está associada à longevidade e à redução do risco de doenças crônicas.',
      },
      {
        heading: 'Por que funciona para mulheres 40+?',
        body: 'Após os 39 anos, o metabolismo feminino naturalmente desacelera e a sensibilidade à insulina tende a diminuir — especialmente na peri e pós-menopausa. O jejum intermitente moderado (12-16h) pode melhorar a sensibilidade à insulina, reduzir inflamação crônica de baixo grau e ajudar na redistribuição de gordura corporal (especialmente abdominal). Não é coincidência: é biologia a seu favor.',
      },
      {
        heading: 'O que dizem os estudos científicos?',
        body: 'Uma meta-análise publicada no New England Journal of Medicine (2019) concluiu que o jejum intermitente melhora marcadores de saúde metabólica, incluindo resistência à insulina, pressão arterial e inflamação. Outro estudo do Journal of Clinical Endocrinology (2021) mostrou que mulheres na peri-menopausa que praticavam JI 16:8 por 12 semanas tiveram redução significativa de gordura visceral sem perda de massa magra.',
      },
      {
        heading: 'Mitos que precisam morrer',
        body: '❌ "Pular o café da manhã é perigoso" → Não existe hora obrigatória para comer. Seu corpo não entra em "modo de fome" por pular uma refeição.\n\n❌ "Jejum queima músculo" → O corpo prioriza gordura como combustível. Músculo só é usado em jejuns extremos (48h+) ou com restrição calórica severa.\n\n❌ "Precisa comer de 3 em 3 horas" → Esse mito surgiu de estudos mal interpretados sobre atletas. Para a maioria das pessoas, comer com menos frequência não reduz o metabolismo.\n\n❌ "Jejum causa gastrite" → O jejum moderado não causa gastrite em pessoas saudáveis. Se você já tem gastrite, converse com seu médico.',
      },
    ],
  },
  {
    id: 'hormonios',
    title: 'Hormônios Femininos e Jejum',
    subtitle: 'Como o JI interage com a biologia da mulher madura',
    icon: '🌸',
    category: 'ciencia',
    sections: [
      {
        heading: 'O cenário hormonal após os 39',
        body: 'A partir dos 39-40 anos, a produção de estrogênio e progesterona começa a oscilar significativamente. Na peri-menopausa (que pode durar até 10 anos), essas oscilações causam sintomas como ondas de calor, insônia, ganho de peso abdominal e alterações de humor. Entender esse cenário é fundamental para praticar o jejum de forma segura e eficaz.',
      },
      {
        heading: 'Insulina e resistência à insulina',
        body: 'Com a queda do estrogênio, a sensibilidade à insulina diminui naturalmente. Isso significa que o corpo precisa produzir mais insulina para processar a mesma quantidade de alimento — e mais insulina = mais armazenamento de gordura, especialmente na região abdominal. O jejum intermitente ajuda restaurando a sensibilidade à insulina através dos períodos regulares de descanso digestivo.',
      },
      {
        heading: 'Cortisol: o hormônio do estresse',
        body: 'O cortisol é essencial para a vida, mas em excesso ele favorece o acúmulo de gordura visceral (na barriga), interfere no sono e aumenta a compulsão por doces. Mulheres na meia-idade tendem a ter cortisol mais elevado. O jejum moderado pode ajudar a regular o cortisol, mas atenção: jejuns longos demais (18h+) em situações de estresse podem aumentar o cortisol em vez de reduzi-lo. Escute seu corpo.',
      },
      {
        heading: 'Tireoide e metabolismo',
        body: 'A tireoide regula o metabolismo basal. Problemas na tireoide são mais comuns em mulheres após os 40 e podem dificultar o emagrecimento. Se você tem hipotireoidismo, o jejum intermitente moderado (12-14h) geralmente é seguro, mas jejuns longos podem reduzir a conversão de T4 em T3 (hormônio tireoidiano ativo). Por isso geramos protocolos mais conservadores para quem marca essa condição.',
      },
      {
        heading: 'Menopausa e gordura abdominal',
        body: 'A redistribuição de gordura para a região abdominal na menopausa não é "culpa sua" — é uma mudança hormonal. A queda do estrogênio favorece o acúmulo de gordura visceral, que é metabolicamente mais ativa e inflamatória. O jejum intermitente é uma das estratégias mais estudadas para combater especificamente essa gordura, pois melhora a sensibilidade à insulina e reduz a inflamação crônica.',
      },
      {
        heading: 'Protocolo seguro para cada fase',
        body: 'Pré-menopausa (39-45): Protocolos de 14:10 a 16:8 são geralmente bem tolerados. Peri-menopausa (45-55): Comece com 12:12 ou 14:10 e observe como seu corpo responde. Dias de mais sintomas, flexibilize. Pós-menopausa (55+): O 14:10 costuma ser o sweet spot — longo o suficiente para benefícios metabólicos, curto o suficiente para não estressar o corpo.',
      },
    ],
  },
  {
    id: 'sono',
    title: 'Sono, Estresse e Emagrecimento',
    subtitle: 'Os pilares invisíveis que decidem se você emagrece ou não',
    icon: '🌙',
    category: 'guia',
    sections: [
      {
        heading: 'Por que o sono importa TANTO?',
        body: 'Uma única noite de sono ruim aumenta a grelina (hormônio da fome) em até 28% e reduz a leptina (hormônio da saciedade) em 18%. Tradução: no dia seguinte você sente mais fome, menos saciedade e tende a comer 300-500 calorias a mais — sem perceber. Dormir mal sabota qualquer estratégia alimentar.',
      },
      {
        heading: 'A relação entre cortisol e gordura',
        body: 'O cortisol crônico elevado (causado por estresse, sono ruim ou preocupações constantes) favorece o acúmulo de gordura visceral, aumenta a vontade de comer doces e carboidratos refinados, e pode até reduzir a massa muscular. Não é exagero dizer que gerenciar o estresse é tão importante quanto a alimentação para emagrecer.',
      },
      {
        heading: 'Rotina noturna para dormir melhor',
        body: 'Crie um ritual de sono: 1) Desligue telas brilhantes (TV, celular) pelo menos 30-60 minutos antes de dormir. 2) Tome um chá calmante (camomila, maracujá). 3) Mantenha o quarto escuro, silencioso e a uma temperatura confortável (18-22°C). 4) Tente deitar e acordar nos mesmos horários, inclusive nos finais de semana. 5) Evite cafeína após as 14h.',
      },
      {
        heading: 'Técnicas de gerenciamento do estresse',
        body: 'Incorpore pelo menos uma dessas práticas diariamente: respiração 4-7-8 (inspire 4s, segure 7s, expire 8s — faça 4 ciclos), caminhada ao ar livre de 15-20 minutos, escrita livre (journaling) por 5 minutos, alongamento suave ou yoga de 10 minutos. Não subestime o poder dessas "pequenas" práticas — elas reduzem o cortisol de forma mensurável.',
      },
      {
        heading: 'Jejum e qualidade do sono',
        body: 'Parar de comer 2-3 horas antes de dormir melhora significativamente a qualidade do sono. Quando você come tarde, o corpo precisa digerir enquanto deveria estar reparando tecidos e consolidando memórias. Muitas mulheres relatam que o jejum intermitente, ao naturalmente encerrar a alimentação mais cedo, melhorou radicalmente seu sono — um benefício colateral poderoso.',
      },
      {
        heading: 'O ciclo virtuoso',
        body: 'Bom sono → menos cortisol → menos fome emocional → melhores escolhas alimentares → jejum mais fácil → melhor sono. Quando você ajusta um desses pilares, todos os outros melhoram em cascata. É por isso que o progresso real muitas vezes começa pela cama, não pela cozinha.',
      },
    ],
  },
  {
    id: 'compras',
    title: 'Lista de Compras Inteligente',
    subtitle: 'O que ter na geladeira para facilitar seu jejum de 21 dias',
    icon: '🛒',
    category: 'nutricao',
    sections: [
      {
        heading: 'Proteínas (escolha 3-4 por semana)',
        body: '• Ovos (item número 1 da lista — versáteis, baratos e nutritivos)\n• Peito de frango ou sobrecoxa sem pele\n• Peixe (salmão, tilápia, sardinha)\n• Carne bovina magra (patinho, alcatra)\n• Atum em lata (no azeite ou natural)\n• Tofu firme (opção vegetariana/vegana)\n• Queijo branco ou ricota',
      },
      {
        heading: 'Carboidratos de qualidade',
        body: '• Arroz integral ou parboilizado\n• Batata-doce\n• Mandioca/aipim\n• Aveia em flocos\n• Pão 100% integral (leia o rótulo — "integral" deve ser o 1º ingrediente)\n• Quinoa\n• Macarrão integral',
      },
      {
        heading: 'Vegetais e folhas (compre variedade)',
        body: '• Folhas verdes: rúcula, espinafre, alface, couve\n• Brócolis, couve-flor\n• Cenoura, beterraba\n• Abobrinha, berinjela\n• Tomate, pepino\n• Pimentão colorido\n• Cebola, alho (indispensáveis para tempero)',
      },
      {
        heading: 'Frutas (2-3 variedades por semana)',
        body: '• Banana (prática e sacia)\n• Maçã (alta em fibra)\n• Frutas vermelhas/congeladas (morango, mirtilo)\n• Laranja ou tangerina (vitamina C)\n• Abacate (gordura boa + fibra)\n• Limão (para temperar e saborizar água)',
      },
      {
        heading: 'Gorduras boas e complementos',
        body: '• Azeite de oliva extra virgem (item essencial)\n• Castanha-do-pará (2-3 por dia = selênio)\n• Amendoim natural ou pasta de amendoim (sem açúcar)\n• Sementes de chia e linhaça\n• Sementes de abóbora ou girassol\n• Chocolate 70%+ cacau (para aquele momento)',
      },
      {
        heading: 'Bebidas e itens de apoio',
        body: '• Café (grão ou moído — o que preferir)\n• Chás variados: verde, hibisco, camomila, hortelã\n• Água mineral com gás (ajuda na fome durante o jejum)\n• Vinagre de maçã (1 colher em água antes das refeições — opcional)\n• Temperos secos: cúrcuma, pimenta-do-reino, páprica, orégano, manjericão',
      },
      {
        heading: 'O que NÃO colocar no carrinho',
        body: 'Evite comprar o que você sabe que come por impulso. Se biscoito recheado não entra em casa, você não come. Isso não é privação — é estratégia ambiental. O mesmo vale para refrigerantes, salgadinhos de pacote, sorvete e doces. A regra é: se não comprou, não come. E se não come, não precisa resistir.',
      },
    ],
  },
];

// Função helper para obter a dica do dia baseada na data e dia do programa
export function getDailyTip(dayLogs: { date: string }[]): DailyTip {
  const todayStr = new Date().toISOString().split('T')[0];
  const dayIndex = dayLogs.findIndex(l => l.date === todayStr);
  const tipIndex = dayIndex >= 0 && dayIndex < DAILY_TIPS.length
    ? dayIndex
    : new Date().getDate() % DAILY_TIPS.length;
  return DAILY_TIPS[tipIndex];
}

// Função helper para obter plano alimentar pelo protocolo
export function getMealPlan(protocol: string): MealPlan | undefined {
  return MEAL_PLANS.find(mp => mp.protocol === protocol);
}
