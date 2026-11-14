// Seed Data and Default Fallbacks for LuquitasGym

export const INITIAL_QUOTES = [
  "Não dê seu mínimo como fizeram com você.",
  "Você tá dando o mínimo nesse treino que nunca mais voltará?",
  "Eles entregaram o mínimo e foram embora. Você vai fazer o mesmo com você?",
  "Esse dia não volta. Essa série não volta. Faz valer cada repetição.",
  "O ferro não mente, não tem pena e não aceita desculpas.",
  "Você prometeu que nunca mais ia voltar à estaca zero. Cumpra sua palavra.",
  "Enquanto você negocia com o cansaço, o tempo passa do mesmo jeito.",
  "Mais uma repetição limpa ou mais uma desculpa bem contada?",
  "Ninguém vem te salvar. A responsabilidade é 100% sua.",
  "Desconforto temporário agora ou o peso do arrependimento depois: escolhe.",
  "Sua mente vai pedir para parar 3 repetições antes do músculo. Não obedeça.",
  "Todo mundo quer o resultado, poucos suportam a monotonia de fazer o que precisa ser feito."
];

export const SYSTEM_WORKOUTS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    day_of_week: 1, // Segunda
    day_name: "Segunda-feira",
    slug: "upper-a",
    title: "Upper A",
    focus: "Corpo em V + Braços",
    estimated_duration_min: 65,
    is_optional: false,
    is_upper_body: true,
    exercises: [
      {
        id: "ex-1-1",
        order_index: 1,
        name: "Puxada frontal com triângulo (pegada neutra)",
        default_sets: 3,
        min_reps: 8,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Substitui puxada aberta rígida; mantém ombro no plano escapular sem pinçamento."
      },
      {
        id: "ex-1-2",
        order_index: 2,
        name: "Supino inclinado com halteres (banco a 30°)",
        default_sets: 3,
        min_reps: 8,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Constrói peitoral superior, essencial para o aspecto em V."
      },
      {
        id: "ex-1-3",
        order_index: 3,
        name: "Remada baixa na polia (pegada neutra)",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Puxe em direção ao umbigo para focar no grande dorsal."
      },
      {
        id: "ex-1-4",
        order_index: 4,
        name: "Elevação lateral com halteres",
        default_sets: 4,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Tronco levemente inclinado à frente, subindo no plano da escápula."
      },
      {
        id: "ex-1-5",
        order_index: 5,
        name: "Crucifixo inverso na máquina ou polia",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Foco em deltoide posterior e estabilidade escapular."
      },
      {
        id: "ex-1-6",
        order_index: 6,
        name: "Rosca direta na polia (barra W ou reta)",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Tensão contínua e suave para o cotovelo."
      },
      {
        id: "ex-1-7",
        order_index: 7,
        name: "Tríceps na polia com barra V",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Foco na cabeça lateral do tríceps."
      }
    ]
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    day_of_week: 2, // Terça
    day_name: "Terça-feira",
    slug: "modulo-extra",
    title: "Módulo Extra Estético",
    focus: "Baixa Fadiga Articular",
    estimated_duration_min: 45,
    is_optional: true,
    is_upper_body: true,
    session_note: "Executar sempre com 2 reps na reserva (2 RIR), sem desgaste articular. Pular se cotovelos/ombros estiverem sensíveis.",
    exercises: [
      {
        id: "ex-2-1",
        order_index: 1,
        name: "Elevação lateral na polia (cabo passando atrás do corpo)",
        default_sets: 3,
        min_reps: 15,
        max_reps: 20,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Executar sempre com 2 reps na reserva (2 RIR), sem desgaste articular."
      },
      {
        id: "ex-2-2",
        order_index: 2,
        name: "Face pull na polia com corda (puxando na altura da testa)",
        default_sets: 3,
        min_reps: 15,
        max_reps: 20,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Foco na integridade do manguito rotador e rotação externa."
      },
      {
        id: "ex-2-3",
        order_index: 3,
        name: "Rosca martelo na polia com corda",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Foco no braquial, que empurra o bíceps para cima."
      },
      {
        id: "ex-2-4",
        order_index: 4,
        name: "Tríceps corda unilateral ou bilateral",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Abertura total da corda no ponto de contração."
      },
      {
        id: "ex-2-5",
        order_index: 5,
        name: "Prancha abdominal ou abdominal supra na polia",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Contração isométrica de abdômen contínua."
      }
    ]
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    day_of_week: 3, // Quarta
    day_name: "Quarta-feira",
    slug: "lower-a",
    title: "Lower A",
    focus: "Largura de Coxas & Panturrilha",
    estimated_duration_min: 65,
    is_optional: false,
    is_upper_body: false,
    exercises: [
      {
        id: "ex-3-1",
        order_index: 1,
        name: "Agachamento Hack ou no Smith",
        default_sets: 4,
        min_reps: 8,
        max_reps: 10,
        is_compound: true,
        rest_seconds: 180,
        execution_notes: "Pés na largura do quadril e mais abaixo na plataforma, joelho avançando à frente — máximo estímulo no vasto lateral."
      },
      {
        id: "ex-3-2",
        order_index: 2,
        name: "Mesa flexora",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Quadril colado no banco, sem arquear a lombar."
      },
      {
        id: "ex-3-3",
        order_index: 3,
        name: "Cadeira extensora",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Segure 1 segundo no topo e desça em 2 segundos."
      },
      {
        id: "ex-3-4",
        order_index: 4,
        name: "Cadeira adutora",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Fundamental para dar largura visual à coxa."
      },
      {
        id: "ex-3-5",
        order_index: 5,
        name: "Panturrilha no Leg Press ou em pé (joelho estendido)",
        default_sets: 4,
        min_reps: 10,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Pausa obrigatória de 2 segundos no alongamento máximo embaixo para eliminar impulso do tendão."
      },
      {
        id: "ex-3-6",
        order_index: 6,
        name: "Abdominal supra na polia",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Flexione a coluna enrolando o tronco sobre a pelve."
      }
    ]
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    day_of_week: 4, // Quinta
    day_name: "Quinta-feira",
    slug: "upper-b",
    title: "Upper B",
    focus: "V-Taper Unilateral + Cabeça Longa do Braço",
    estimated_duration_min: 65,
    is_optional: false,
    is_upper_body: true,
    exercises: [
      {
        id: "ex-4-1",
        order_index: 1,
        name: "Puxada unilateral na polia alta (joelho apoiado ou banco)",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Liberdade total de rotação para o ombro não doer."
      },
      {
        id: "ex-4-2",
        order_index: 2,
        name: "Supino reto na máquina ou com halteres",
        default_sets: 3,
        min_reps: 8,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Escápulas bem aduzidas, trajetória consistente."
      },
      {
        id: "ex-4-3",
        order_index: 3,
        name: "Remada apoiada no peito (máquina ou banco inclinado c/ halteres)",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Elimina fadiga lombar antes do treino de perna de sexta."
      },
      {
        id: "ex-4-4",
        order_index: 4,
        name: "Desenvolvimento com halteres (banco a 75–80°)",
        default_sets: 3,
        min_reps: 8,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Cotovelos apontando levemente para frente, nunca totalmente abertos na linha das orelhas."
      },
      {
        id: "ex-4-5",
        order_index: 5,
        name: "Elevação lateral na polia",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Tensão constante desde o início da subida."
      },
      {
        id: "ex-4-6",
        order_index: 6,
        name: "Rosca inclinada com halteres (banco a 45–60°)",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Trabalha cabeça longa do bíceps em alongamento — carga moderada e controle total na descida."
      },
      {
        id: "ex-4-7",
        order_index: 7,
        name: "Tríceps francês na polia baixa/média com corda",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "O cabo mantém tensão constante sem dar tranco no cotovelo no fundo."
      }
    ]
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    day_of_week: 5, // Sexta
    day_name: "Sexta-feira",
    slug: "lower-b",
    title: "Lower B",
    focus: "Cadeia Posterior & Largura Geral",
    estimated_duration_min: 60,
    is_optional: false,
    is_upper_body: false,
    exercises: [
      {
        id: "ex-5-1",
        order_index: 1,
        name: "Levantamento Terra Romeno (RDL) com halteres ou barra",
        default_sets: 3,
        min_reps: 8,
        max_reps: 10,
        is_compound: true,
        rest_seconds: 180,
        execution_notes: "Pare 2 reps antes da falha; desça apenas até o quadril parar de ir para trás."
      },
      {
        id: "ex-5-2",
        order_index: 2,
        name: "Leg Press 45°",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 180,
        execution_notes: "Pés na largura dos ombros, altura média-baixa, amplitude máxima sem tirar o quadril do banco."
      },
      {
        id: "ex-5-3",
        order_index: 3,
        name: "Cadeira flexora",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Pausa de contração e controle da volta."
      },
      {
        id: "ex-5-4",
        order_index: 4,
        name: "Cadeira extensora",
        default_sets: 2,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Volume moderado para complementar o estímulo dos quadríceps."
      },
      {
        id: "ex-5-5",
        order_index: 5,
        name: "Panturrilha sentado (ou no Leg Press)",
        default_sets: 3,
        min_reps: 12,
        max_reps: 20,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Pausa obrigatória de 2 segundos no alongamento."
      },
      {
        id: "ex-5-6",
        order_index: 6,
        name: "Elevação de pernas no apoio ou banco",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Controle da descida sem balançar o corpo."
      }
    ]
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    day_of_week: 6, // Sábado
    day_name: "Sábado",
    slug: "upper-c",
    title: "Upper C",
    focus: "Especialização Ombros 3D & Braços",
    estimated_duration_min: 55,
    is_optional: false,
    is_upper_body: true,
    exercises: [
      {
        id: "ex-6-1",
        order_index: 1,
        name: "Elevação lateral na máquina ou com halteres (sentado)",
        default_sets: 4,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Isola os deltoides laterais eliminando impulso com pernas."
      },
      {
        id: "ex-6-2",
        order_index: 2,
        name: "Rosca martelo com halteres (alternada ou simultânea)",
        default_sets: 4,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Constrói espessura lateral do braço e antebraço."
      },
      {
        id: "ex-6-3",
        order_index: 3,
        name: "Mergulho na máquina (ou Supino fechado no Smith)",
        default_sets: 3,
        min_reps: 8,
        max_reps: 12,
        is_compound: true,
        rest_seconds: 150,
        execution_notes: "Construtor pesado de massa geral no tríceps com alta estabilidade."
      },
      {
        id: "ex-6-4",
        order_index: 4,
        name: "Rosca Scott na máquina ou banco inclinado",
        default_sets: 3,
        min_reps: 10,
        max_reps: 12,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Não estenda o cotovelo violentamente no fundo; pare um pouco antes do travamento articular."
      },
      {
        id: "ex-6-5",
        order_index: 5,
        name: "Tríceps corda na polia (abrindo a corda no final)",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Tensão de pico com os polegares apontando para fora."
      },
      {
        id: "ex-6-6",
        order_index: 6,
        name: "Crucifixo inverso com halteres (peito apoiado no banco inclinado)",
        default_sets: 3,
        min_reps: 12,
        max_reps: 15,
        is_compound: false,
        rest_seconds: 90,
        execution_notes: "Foco em posterior de ombro e musculatura escapular."
      }
    ]
  }
];
