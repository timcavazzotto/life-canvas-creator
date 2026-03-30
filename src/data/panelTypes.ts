import { TONES, LABELS } from './posterData';

export type GridMode = 'standard' | 'couple';

export interface PanelType {
  id: string;
  label: string;
  icon: string;
  description: string;
  gridMode: GridMode;
  extraFields?: string[];
  tones: Record<string, {
    label: string;
    quote: Record<string, string>;
    attr: Record<string, string>;
    note: Record<string, string>;
    tag: Record<string, string>;
    eyebrow: Record<string, string>;
    ainda: Record<string, string>;
  }>;
  labels: Record<string, Record<string, string>>;
}

export const PANEL_TYPES: PanelType[] = [
  {
    id: 'movimento',
    label: 'Vida em Movimento',
    icon: 'activity',
    description: 'Atividade física semanal',
    gridMode: 'standard',
    tones: TONES,
    labels: LABELS,
  },
  {
    id: 'espiritual',
    label: 'Vida Espiritual',
    icon: '🙏',
    description: 'Práticas espirituais e meditação',
    gridMode: 'standard',
    tones: {
      contemplativo: {
        label: 'Contemplativo',
        quote: { pt: '"A alma descansa quando o corpo se aquieta e a mente se abre ao silêncio."', en: '"The soul rests when the body stills and the mind opens to silence."', es: '"El alma descansa cuando el cuerpo se aquieta y la mente se abre al silencio."' },
        attr: { pt: '— cada semana de presença é eterna', en: '— every week of presence is eternal', es: '— cada semana de presencia es eterna' },
        note: { pt: 'Preencha as semanas em que você dedicou tempo à sua espiritualidade.\nOração, meditação, leitura sagrada ou contemplação.', en: 'Mark the weeks you dedicated to your spirituality.\nPrayer, meditation, sacred reading, or contemplation.', es: 'Marca las semanas que dedicaste a tu espiritualidad.\nOración, meditación, lectura sagrada o contemplación.' },
        tag: { pt: 'Presença que transcende o tempo', en: 'Presence that transcends time', es: 'Presencia que trasciende el tiempo' },
        eyebrow: { pt: 'Painel da vida espiritual', en: 'Spiritual life panel', es: 'Panel de vida espiritual' },
        ainda: { pt: 'Por contemplar', en: 'To contemplate', es: 'Por contemplar' },
      },
      devocional: {
        label: 'Devocional',
        quote: { pt: '"Buscar o sagrado não é fugir do mundo — é encontrar sentido nele."', en: '"Seeking the sacred is not escaping the world — it is finding meaning in it."', es: '"Buscar lo sagrado no es huir del mundo — es encontrar sentido en él."' },
        attr: { pt: '— fé em cada semana vivida', en: '— faith in every week lived', es: '— fe en cada semana vivida' },
        note: { pt: 'Colora as semanas de devoção.\nQualquer prática que conecte você ao transcendente conta.', en: 'Color the weeks of devotion.\nAny practice that connects you to the transcendent counts.', es: 'Colorea las semanas de devoción.\nCualquier práctica que te conecte con lo trascendente cuenta.' },
        tag: { pt: 'Fé cultivada semana a semana', en: 'Faith cultivated week by week', es: 'Fe cultivada semana a semana' },
        eyebrow: { pt: 'Painel da vida espiritual', en: 'Spiritual life panel', es: 'Panel de vida espiritual' },
        ainda: { pt: 'Por honrar', en: 'To honor', es: 'Por honrar' },
      },
      meditativo: {
        label: 'Meditativo',
        quote: { pt: '"Dez minutos de silêncio podem transformar uma semana inteira."', en: '"Ten minutes of silence can transform an entire week."', es: '"Diez minutos de silencio pueden transformar una semana entera."' },
        attr: { pt: '— o silêncio é a porta da sabedoria', en: '— silence is the door to wisdom', es: '— el silencio es la puerta de la sabiduría' },
        note: { pt: 'Marque as semanas em que você meditou ou praticou mindfulness.\nMesmo poucos minutos contam.', en: 'Mark the weeks you meditated or practiced mindfulness.\nEven a few minutes count.', es: 'Marca las semanas que meditaste o practicaste mindfulness.\nIncluso unos pocos minutos cuentan.' },
        tag: { pt: 'Silêncio que ilumina', en: 'Silence that illuminates', es: 'Silencio que ilumina' },
        eyebrow: { pt: 'Painel da vida espiritual', en: 'Spiritual life panel', es: 'Panel de vida espiritual' },
        ainda: { pt: 'Por silenciar', en: 'To silence', es: 'Por silenciar' },
      },
      gratidao: {
        label: 'Gratidão',
        quote: { pt: '"Gratidão não muda o passado, mas amplia o futuro."', en: '"Gratitude does not change the past, but expands the future."', es: '"La gratitud no cambia el pasado, pero amplía el futuro."' },
        attr: { pt: '— agradeça cada semana recebida', en: '— be grateful for every week received', es: '— agradece cada semana recibida' },
        note: { pt: 'Preencha as semanas em que você praticou gratidão ativa.\nUm diário, uma oração, um momento de reconhecimento.', en: 'Mark the weeks you practiced active gratitude.\nA journal, a prayer, a moment of recognition.', es: 'Marca las semanas que practicaste gratitud activa.\nUn diario, una oración, un momento de reconocimiento.' },
        tag: { pt: 'Gratidão multiplica a vida', en: 'Gratitude multiplies life', es: 'La gratitud multiplica la vida' },
        eyebrow: { pt: 'Painel da vida espiritual', en: 'Spiritual life panel', es: 'Panel de vida espiritual' },
        ainda: { pt: 'Por agradecer', en: 'To be grateful', es: 'Por agradecer' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas de prática', act: 'Para colorir', fut: 'Por viver', total: 'Semanas totais', jv: 'Já vividas' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks of practice', act: 'To color', fut: 'Yet to live', total: 'Total weeks', jv: 'Already lived' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas de práctica', act: 'Para colorear', fut: 'Por vivir', total: 'Semanas totales', jv: 'Ya vividas' },
    },
  },
  {
    id: 'casal',
    label: 'Vida em Casal',
    icon: '💍',
    description: 'Duas vidas que se tornam uma',
    gridMode: 'couple',
    extraFields: ['partnerName', 'partnerBirth', 'marriageDate'],
    tones: {
      romantico: {
        label: 'Romântico',
        quote: { pt: '"Amar não é olhar um para o outro, é olhar juntos na mesma direção."', en: '"Love is not looking at each other, but looking together in the same direction."', es: '"Amar no es mirarse el uno al otro, es mirar juntos en la misma dirección."' },
        attr: { pt: '— Antoine de Saint-Exupéry', en: '— Antoine de Saint-Exupéry', es: '— Antoine de Saint-Exupéry' },
        note: { pt: 'Preencha juntos as semanas vividas lado a lado.\nCada quadrado colorido é uma semana de parceria.', en: 'Fill together the weeks lived side by side.\nEvery colored square is a week of partnership.', es: 'Llena juntos las semanas vividas lado a lado.\nCada cuadrado coloreado es una semana de compañerismo.' },
        tag: { pt: 'Uma vida, dois corações', en: 'One life, two hearts', es: 'Una vida, dos corazones' },
        eyebrow: { pt: 'Painel da vida em casal', en: 'Couple life panel', es: 'Panel de vida en pareja' },
        ainda: { pt: 'Por viver juntos', en: 'To live together', es: 'Por vivir juntos' },
      },
      companheiro: {
        label: 'Companheiro',
        quote: { pt: '"Nas pequenas coisas do dia a dia, o amor se faz gigante."', en: '"In the small things of everyday life, love becomes giant."', es: '"En las pequeñas cosas del día a día, el amor se hace gigante."' },
        attr: { pt: '— cada semana juntos é uma conquista', en: '— every week together is an achievement', es: '— cada semana juntos es una conquista' },
        note: { pt: 'Colora as semanas de companheirismo.\nCafé da manhã juntos, conversas à noite, projetos compartilhados.', en: 'Color the weeks of companionship.\nBreakfast together, evening talks, shared projects.', es: 'Colorea las semanas de compañerismo.\nDesayunos juntos, charlas nocturnas, proyectos compartidos.' },
        tag: { pt: 'Juntos, semana a semana', en: 'Together, week by week', es: 'Juntos, semana a semana' },
        eyebrow: { pt: 'Painel da vida em casal', en: 'Couple life panel', es: 'Panel de vida en pareja' },
        ainda: { pt: 'Por construir juntos', en: 'To build together', es: 'Por construir juntos' },
      },
      celebracao: {
        label: 'Celebração',
        quote: { pt: '"O maior presente é ter alguém com quem dividir o tempo."', en: '"The greatest gift is having someone to share time with."', es: '"El mayor regalo es tener a alguien con quien compartir el tiempo."' },
        attr: { pt: '— celebre cada semana a dois', en: '— celebrate every week as two', es: '— celebra cada semana de a dos' },
        note: { pt: 'Marque as semanas que celebraram juntos.\nAniversários, conquistas, momentos simples que viraram memórias.', en: 'Mark the weeks you celebrated together.\nAnniversaries, achievements, simple moments that became memories.', es: 'Marca las semanas que celebraron juntos.\nAniversarios, logros, momentos simples que se volvieron recuerdos.' },
        tag: { pt: 'Cada semana é um brinde', en: 'Every week is a toast', es: 'Cada semana es un brindis' },
        eyebrow: { pt: 'Painel da vida em casal', en: 'Couple life panel', es: 'Panel de vida en pareja' },
        ainda: { pt: 'Por celebrar juntos', en: 'To celebrate together', es: 'Por celebrar juntos' },
      },
      cumplicidade: {
        label: 'Cumplicidade',
        quote: { pt: '"Cumplicidade é quando o silêncio a dois vale mais que qualquer palavra."', en: '"Complicity is when shared silence is worth more than any word."', es: '"Complicidad es cuando el silencio compartido vale más que cualquier palabra."' },
        attr: { pt: '— no olhar, tudo se diz', en: '— in a glance, everything is said', es: '— en la mirada, todo se dice' },
        note: { pt: 'Preencha as semanas de cumplicidade.\nOlhares, gestos, apoio mútuo — o amor nos detalhes.', en: 'Fill the weeks of complicity.\nGlances, gestures, mutual support — love in the details.', es: 'Llena las semanas de complicidad.\nMiradas, gestos, apoyo mutuo — el amor en los detalles.' },
        tag: { pt: 'Cumplicidade que atravessa o tempo', en: 'Complicity that crosses time', es: 'Complicidad que atraviesa el tiempo' },
        eyebrow: { pt: 'Painel da vida em casal', en: 'Couple life panel', es: 'Panel de vida en pareja' },
        ainda: { pt: 'Por compartilhar', en: 'To share', es: 'Por compartir' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas vividas', act: 'Para colorir', fut: 'Por viver juntos', total: 'Semanas totais', jv: 'Já vividas', partner: 'Cônjuge', partnerBirth: 'Nascimento cônjuge', marriage: 'Data do casamento', together: 'Semanas juntos' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks lived', act: 'To color', fut: 'Yet to live together', total: 'Total weeks', jv: 'Already lived', partner: 'Partner', partnerBirth: 'Partner birth', marriage: 'Wedding date', together: 'Weeks together' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas vividas', act: 'Para colorear', fut: 'Por vivir juntos', total: 'Semanas totales', jv: 'Ya vividas', partner: 'Cónyuge', partnerBirth: 'Nacimiento cónyuge', marriage: 'Fecha de matrimonio', together: 'Semanas juntos' },
    },
  },
  {
    id: 'prosperidade',
    label: 'Prosperidade',
    icon: '🎓',
    description: 'Carreira, estudo e crescimento',
    gridMode: 'standard',
    tones: {
      ambicioso: {
        label: 'Ambicioso',
        quote: { pt: '"Nunca é tarde para ser o que você poderia ter sido."', en: '"It is never too late to be what you might have been."', es: '"Nunca es tarde para ser lo que podrías haber sido."' },
        attr: { pt: '— George Eliot', en: '— George Eliot', es: '— George Eliot' },
        note: { pt: 'Preencha as semanas em que investiu em seu crescimento.\nEstudo, curso, mentoria, leitura profissional ou mudança de carreira.', en: 'Mark weeks you invested in growth.\nStudy, courses, mentoring, professional reading, or career changes.', es: 'Marca las semanas que invertiste en tu crecimiento.\nEstudio, cursos, mentoría, lectura profesional o cambio de carrera.' },
        tag: { pt: 'Cresça uma semana de cada vez', en: 'Grow one week at a time', es: 'Crece una semana a la vez' },
        eyebrow: { pt: 'Painel da prosperidade', en: 'Prosperity panel', es: 'Panel de prosperidad' },
        ainda: { pt: 'Por conquistar', en: 'To achieve', es: 'Por conquistar' },
      },
      resiliente: {
        label: 'Resiliente',
        quote: { pt: '"O sucesso é a soma de pequenos esforços repetidos semana após semana."', en: '"Success is the sum of small efforts repeated week after week."', es: '"El éxito es la suma de pequeños esfuerzos repetidos semana tras semana."' },
        attr: { pt: '— Robert Collier', en: '— Robert Collier', es: '— Robert Collier' },
        note: { pt: 'Marque cada semana de esforço consistente.\nTrabalho, estudo, networking — tudo conta na construção.', en: 'Mark every week of consistent effort.\nWork, study, networking — everything counts in building.', es: 'Marca cada semana de esfuerzo consistente.\nTrabajo, estudio, networking — todo cuenta en la construcción.' },
        tag: { pt: 'Construa tijolo a tijolo', en: 'Build brick by brick', es: 'Construye ladrillo a ladrillo' },
        eyebrow: { pt: 'Painel da prosperidade', en: 'Prosperity panel', es: 'Panel de prosperidad' },
        ainda: { pt: 'Por construir', en: 'To build', es: 'Por construir' },
      },
      visionario: {
        label: 'Visionário',
        quote: { pt: '"A melhor forma de prever o futuro é criá-lo."', en: '"The best way to predict the future is to create it."', es: '"La mejor forma de predecir el futuro es crearlo."' },
        attr: { pt: '— Peter Drucker', en: '— Peter Drucker', es: '— Peter Drucker' },
        note: { pt: 'Colora as semanas em que deu passos em direção à sua visão.\nPlanejamento, execução, aprendizado com erros.', en: 'Color the weeks you took steps toward your vision.\nPlanning, execution, learning from mistakes.', es: 'Colorea las semanas que diste pasos hacia tu visión.\nPlanificación, ejecución, aprendizaje de errores.' },
        tag: { pt: 'Crie o futuro que merece', en: 'Create the future you deserve', es: 'Crea el futuro que mereces' },
        eyebrow: { pt: 'Painel da prosperidade', en: 'Prosperity panel', es: 'Panel de prosperidad' },
        ainda: { pt: 'Por criar', en: 'To create', es: 'Por crear' },
      },
      aprendiz: {
        label: 'Aprendiz',
        quote: { pt: '"Eu não perdi. Eu aprendi."', en: '"I did not lose. I learned."', es: '"No perdí. Aprendí."' },
        attr: { pt: '— Nelson Mandela', en: '— Nelson Mandela', es: '— Nelson Mandela' },
        note: { pt: 'Registre as semanas de aprendizado.\nCada erro é uma lição, cada curso é um degrau.', en: 'Record the weeks of learning.\nEvery mistake is a lesson, every course is a step.', es: 'Registra las semanas de aprendizaje.\nCada error es una lección, cada curso es un escalón.' },
        tag: { pt: 'Aprender é o caminho', en: 'Learning is the way', es: 'Aprender es el camino' },
        eyebrow: { pt: 'Painel da prosperidade', en: 'Prosperity panel', es: 'Panel de prosperidad' },
        ainda: { pt: 'Por aprender', en: 'To learn', es: 'Por aprender' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas de investimento', act: 'Para colorir', fut: 'Por investir', total: 'Semanas totais', jv: 'Já vividas' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks of investment', act: 'To color', fut: 'Yet to invest', total: 'Total weeks', jv: 'Already lived' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas de inversión', act: 'Para colorear', fut: 'Por invertir', total: 'Semanas totales', jv: 'Ya vividas' },
    },
  },
  {
    id: 'lazer',
    label: 'Lazer',
    icon: '🎨',
    description: 'Hobbies, descanso e diversão',
    gridMode: 'standard',
    tones: {
      aventureiro: {
        label: 'Aventureiro',
        quote: { pt: '"A vida é curta demais para deixar o lazer para depois."', en: '"Life is too short to postpone leisure."', es: '"La vida es demasiado corta para dejar el ocio para después."' },
        attr: { pt: '— viva cada semana com leveza', en: '— live every week with lightness', es: '— vive cada semana con ligereza' },
        note: { pt: 'Preencha as semanas em que se divertiu de verdade.\nViagem, hobby, jogo, passeio ao ar livre.', en: 'Mark weeks you truly had fun.\nTravel, hobby, games, outdoor walks.', es: 'Marca las semanas que realmente te divertiste.\nViaje, hobby, juegos, paseos al aire libre.' },
        tag: { pt: 'Viva leve, viva agora', en: 'Live light, live now', es: 'Vive ligero, vive ahora' },
        eyebrow: { pt: 'Painel do lazer', en: 'Leisure panel', es: 'Panel del ocio' },
        ainda: { pt: 'Por aproveitar', en: 'To enjoy', es: 'Por disfrutar' },
      },
      relaxado: {
        label: 'Relaxado',
        quote: { pt: '"Descansar não é perder tempo — é recarregar a vida."', en: '"Rest is not wasting time — it is recharging life."', es: '"Descansar no es perder el tiempo — es recargar la vida."' },
        attr: { pt: '— permita-se descansar', en: '— allow yourself to rest', es: '— permítete descansar' },
        note: { pt: 'Colora as semanas de descanso verdadeiro.\nLeitura por prazer, sesta, natureza, nada produtivo.', en: 'Color the weeks of true rest.\nReading for pleasure, naps, nature, nothing productive.', es: 'Colorea las semanas de descanso verdadero.\nLectura por placer, siesta, naturaleza, nada productivo.' },
        tag: { pt: 'O descanso também é vida', en: 'Rest is also life', es: 'El descanso también es vida' },
        eyebrow: { pt: 'Painel do lazer', en: 'Leisure panel', es: 'Panel del ocio' },
        ainda: { pt: 'Por descansar', en: 'To rest', es: 'Por descansar' },
      },
      criativo: {
        label: 'Criativo',
        quote: { pt: '"Criar é a forma mais pura de brincar — e brincar é a forma mais séria de viver."', en: '"Creating is the purest form of play — and play is the most serious form of living."', es: '"Crear es la forma más pura de jugar — y jugar es la forma más seria de vivir."' },
        attr: { pt: '— crie sem medo', en: '— create fearlessly', es: '— crea sin miedo' },
        note: { pt: 'Marque as semanas em que exercitou a criatividade.\nPintura, música, escrita, artesanato, cozinha.', en: 'Mark weeks you exercised creativity.\nPainting, music, writing, crafts, cooking.', es: 'Marca las semanas que ejercitaste la creatividad.\nPintura, música, escritura, manualidades, cocina.' },
        tag: { pt: 'Crie por diversão', en: 'Create for fun', es: 'Crea por diversión' },
        eyebrow: { pt: 'Painel do lazer', en: 'Leisure panel', es: 'Panel del ocio' },
        ainda: { pt: 'Por criar', en: 'To create', es: 'Por crear' },
      },
      explorador: {
        label: 'Explorador',
        quote: { pt: '"O mundo é um livro e quem não viaja lê apenas uma página."', en: '"The world is a book and those who do not travel read only one page."', es: '"El mundo es un libro y quienes no viajan leen solo una página."' },
        attr: { pt: '— Santo Agostinho', en: '— Saint Augustine', es: '— San Agustín' },
        note: { pt: 'Preencha as semanas de exploração.\nViagens, trilhas, lugares novos, experiências inéditas.', en: 'Fill the weeks of exploration.\nTrips, trails, new places, novel experiences.', es: 'Llena las semanas de exploración.\nViajes, senderos, lugares nuevos, experiencias inéditas.' },
        tag: { pt: 'Explore sem limites', en: 'Explore without limits', es: 'Explora sin límites' },
        eyebrow: { pt: 'Painel do lazer', en: 'Leisure panel', es: 'Panel del ocio' },
        ainda: { pt: 'Por explorar', en: 'To explore', es: 'Por explorar' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas de lazer', act: 'Para colorir', fut: 'Por aproveitar', total: 'Semanas totais', jv: 'Já vividas' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks of leisure', act: 'To color', fut: 'Yet to enjoy', total: 'Total weeks', jv: 'Already lived' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas de ocio', act: 'Para colorear', fut: 'Por disfrutar', total: 'Semanas totales', jv: 'Ya vividas' },
    },
  },
  {
    id: 'leitura',
    label: 'Leitura',
    icon: '📚',
    description: 'Livros, conhecimento e imaginação',
    gridMode: 'standard',
    tones: {
      literario: {
        label: 'Literário',
        quote: { pt: '"Um leitor vive mil vidas antes de morrer. O homem que nunca lê vive apenas uma."', en: '"A reader lives a thousand lives before he dies. The man who never reads lives only one."', es: '"Un lector vive mil vidas antes de morir. El que nunca lee vive solo una."' },
        attr: { pt: '— George R.R. Martin', en: '— George R.R. Martin', es: '— George R.R. Martin' },
        note: { pt: 'Preencha as semanas em que leu pelo menos um capítulo.\nFicção, não-ficção, artigos longos — tudo conta.', en: 'Mark weeks you read at least one chapter.\nFiction, non-fiction, long articles — everything counts.', es: 'Marca las semanas que leíste al menos un capítulo.\nFicción, no ficción, artículos largos — todo cuenta.' },
        tag: { pt: 'Leia uma vida inteira', en: 'Read an entire life', es: 'Lee una vida entera' },
        eyebrow: { pt: 'Painel da leitura', en: 'Reading panel', es: 'Panel de lectura' },
        ainda: { pt: 'Por ler', en: 'To read', es: 'Por leer' },
      },
      curioso: {
        label: 'Curioso',
        quote: { pt: '"Quanto mais leio, mais descubro que não sei nada — e isso me fascina."', en: '"The more I read, the more I discover I know nothing — and that fascinates me."', es: '"Cuanto más leo, más descubro que no sé nada — y eso me fascina."' },
        attr: { pt: '— a curiosidade é o combustível', en: '— curiosity is the fuel', es: '— la curiosidad es el combustible' },
        note: { pt: 'Colora as semanas de leitura curiosa.\nLivros, revistas, ensaios, qualquer texto que ampliou sua visão.', en: 'Color weeks of curious reading.\nBooks, magazines, essays — any text that broadened your view.', es: 'Colorea las semanas de lectura curiosa.\nLibros, revistas, ensayos — cualquier texto que amplió tu visión.' },
        tag: { pt: 'Curiosidade sem fim', en: 'Endless curiosity', es: 'Curiosidad sin fin' },
        eyebrow: { pt: 'Painel da leitura', en: 'Reading panel', es: 'Panel de lectura' },
        ainda: { pt: 'Por descobrir', en: 'To discover', es: 'Por descubrir' },
      },
      inspirador: {
        label: 'Inspirador',
        quote: { pt: '"Os livros que lemos na juventude nos acompanham para sempre."', en: '"The books we read in youth stay with us forever."', es: '"Los libros que leemos en la juventud nos acompañan para siempre."' },
        attr: { pt: '— cada página muda quem somos', en: '— every page changes who we are', es: '— cada página cambia quiénes somos' },
        note: { pt: 'Marque as semanas de leitura transformadora.\nAqueles livros que mudaram sua forma de ver o mundo.', en: 'Mark weeks of transformative reading.\nThose books that changed how you see the world.', es: 'Marca las semanas de lectura transformadora.\nEsos libros que cambiaron tu forma de ver el mundo.' },
        tag: { pt: 'Palavras que transformam', en: 'Words that transform', es: 'Palabras que transforman' },
        eyebrow: { pt: 'Painel da leitura', en: 'Reading panel', es: 'Panel de lectura' },
        ainda: { pt: 'Por inspirar', en: 'To inspire', es: 'Por inspirar' },
      },
      filosofo: {
        label: 'Filósofo',
        quote: { pt: '"Ler é pensar com a cabeça de outra pessoa — e depois com a sua."', en: '"Reading is thinking with someone else\'s head — and then with your own."', es: '"Leer es pensar con la cabeza de otra persona — y luego con la tuya."' },
        attr: { pt: '— Arthur Schopenhauer', en: '— Arthur Schopenhauer', es: '— Arthur Schopenhauer' },
        note: { pt: 'Registre as semanas de leitura reflexiva.\nFilosofia, ensaios, biografias — textos que fazem pensar.', en: 'Record weeks of reflective reading.\nPhilosophy, essays, biographies — texts that make you think.', es: 'Registra las semanas de lectura reflexiva.\nFilosofía, ensayos, biografías — textos que hacen pensar.' },
        tag: { pt: 'Pense através dos livros', en: 'Think through books', es: 'Piensa a través de los libros' },
        eyebrow: { pt: 'Painel da leitura', en: 'Reading panel', es: 'Panel de lectura' },
        ainda: { pt: 'Por refletir', en: 'To reflect', es: 'Por reflexionar' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas de leitura', act: 'Para colorir', fut: 'Por ler', total: 'Semanas totais', jv: 'Já vividas' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks of reading', act: 'To color', fut: 'Yet to read', total: 'Total weeks', jv: 'Already lived' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas de lectura', act: 'Para colorear', fut: 'Por leer', total: 'Semanas totales', jv: 'Ya vividas' },
    },
  },
  {
    id: 'social',
    label: 'Vida Social',
    icon: '👥',
    description: 'Amigos, família e conexões',
    gridMode: 'standard',
    tones: {
      acolhedor: {
        label: 'Acolhedor',
        quote: { pt: '"Somos a média das cinco pessoas com quem mais convivemos."', en: '"We are the average of the five people we spend the most time with."', es: '"Somos el promedio de las cinco personas con las que más convivimos."' },
        attr: { pt: '— Jim Rohn', en: '— Jim Rohn', es: '— Jim Rohn' },
        note: { pt: 'Preencha as semanas em que esteve presente para alguém.\nEncontros, ligações, gestos de carinho, apoio a quem precisa.', en: 'Mark weeks you were present for someone.\nMeetings, calls, gestures of affection, supporting those in need.', es: 'Marca las semanas que estuviste presente para alguien.\nEncuentros, llamadas, gestos de cariño, apoyo a quien lo necesita.' },
        tag: { pt: 'Estar presente é o presente', en: 'Being present is the present', es: 'Estar presente es el regalo' },
        eyebrow: { pt: 'Painel da vida social', en: 'Social life panel', es: 'Panel de vida social' },
        ainda: { pt: 'Por compartilhar', en: 'To share', es: 'Por compartir' },
      },
      festivo: {
        label: 'Festivo',
        quote: { pt: '"A felicidade só é real quando compartilhada."', en: '"Happiness is only real when shared."', es: '"La felicidad solo es real cuando se comparte."' },
        attr: { pt: '— Christopher McCandless', en: '— Christopher McCandless', es: '— Christopher McCandless' },
        note: { pt: 'Colora as semanas de encontros e celebrações.\nChurrascos, festas, cafés com amigos, reuniões de família.', en: 'Color weeks of gatherings and celebrations.\nBarbecues, parties, coffee with friends, family reunions.', es: 'Colorea las semanas de encuentros y celebraciones.\nAsados, fiestas, cafés con amigos, reuniones familiares.' },
        tag: { pt: 'Celebre quem está ao lado', en: 'Celebrate who stands beside you', es: 'Celebra a quien está a tu lado' },
        eyebrow: { pt: 'Painel da vida social', en: 'Social life panel', es: 'Panel de vida social' },
        ainda: { pt: 'Por celebrar', en: 'To celebrate', es: 'Por celebrar' },
      },
      familiar: {
        label: 'Familiar',
        quote: { pt: '"Família não é sobre sangue. É sobre quem está disposto a segurar sua mão quando você mais precisa."', en: '"Family is not about blood. It is about who is willing to hold your hand when you need it most."', es: '"La familia no es cuestión de sangre. Es sobre quién está dispuesto a tomar tu mano cuando más lo necesitas."' },
        attr: { pt: '— laços que o tempo fortalece', en: '— bonds that time strengthens', es: '— lazos que el tiempo fortalece' },
        note: { pt: 'Marque as semanas de presença familiar.\nJantar em família, brincadeiras com filhos, visita aos pais.', en: 'Mark weeks of family presence.\nFamily dinners, playing with kids, visiting parents.', es: 'Marca las semanas de presencia familiar.\nCenas familiares, juegos con hijos, visitas a los padres.' },
        tag: { pt: 'Família é raiz e asas', en: 'Family is roots and wings', es: 'Familia es raíz y alas' },
        eyebrow: { pt: 'Painel da vida social', en: 'Social life panel', es: 'Panel de vida social' },
        ainda: { pt: 'Por estar junto', en: 'To be together', es: 'Por estar juntos' },
      },
      generoso: {
        label: 'Generoso',
        quote: { pt: '"Ninguém é tão pobre que não possa dar, nem tão rico que não precise receber."', en: '"No one is so poor they cannot give, nor so rich they do not need to receive."', es: '"Nadie es tan pobre que no pueda dar, ni tan rico que no necesite recibir."' },
        attr: { pt: '— a generosidade multiplica', en: '— generosity multiplies', es: '— la generosidad multiplica' },
        note: { pt: 'Preencha as semanas em que foi generoso.\nTempo, atenção, ajuda, voluntariado, um ouvido amigo.', en: 'Fill weeks you were generous.\nTime, attention, help, volunteering, a listening ear.', es: 'Llena las semanas que fuiste generoso.\nTiempo, atención, ayuda, voluntariado, un oído amigo.' },
        tag: { pt: 'Dê o melhor de si', en: 'Give your best', es: 'Da lo mejor de ti' },
        eyebrow: { pt: 'Painel da vida social', en: 'Social life panel', es: 'Panel de vida social' },
        ainda: { pt: 'Por doar', en: 'To give', es: 'Por donar' },
      },
    },
    labels: {
      pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas de conexão', act: 'Para colorir', fut: 'Por conectar', total: 'Semanas totais', jv: 'Já vividas' },
      en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks of connection', act: 'To color', fut: 'Yet to connect', total: 'Total weeks', jv: 'Already lived' },
      es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas de conexión', act: 'Para colorear', fut: 'Por conectar', total: 'Semanas totales', jv: 'Ya vividas' },
    },
  },
];

export function getPanelType(id: string): PanelType {
  return PANEL_TYPES.find(p => p.id === id) || PANEL_TYPES[0];
}
