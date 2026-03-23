export const THEMES = [
  { id: 'theme-classico', label: 'Clássico', bg: '#fafafa', accent: '#111', lived: '#d0d0d0' },
  { id: 'theme-verde', label: 'Floresta', bg: '#f4f8f4', accent: '#1a5c30', lived: '#b8d8c0' },
  { id: 'theme-terracota', label: 'Terracota', bg: '#faf5f0', accent: '#7a3018', lived: '#e8c8b0' },
  { id: 'theme-sepia', label: 'Sépia', bg: '#f8f2e0', accent: '#8a6820', lived: '#ddd0a0' },
  { id: 'theme-roxo', label: 'Púrpura', bg: '#f8f4fc', accent: '#5a1e88', lived: '#d8b8f0' },
  { id: 'theme-azul', label: 'Oceano', bg: '#f2f6fa', accent: '#104878', lived: '#a8c8e8' },
];

export const TONES: Record<string, {
  label: string;
  quote: Record<string, string>;
  attr: Record<string, string>;
  note: Record<string, string>;
  tag: Record<string, string>;
  eyebrow: Record<string, string>;
  ainda: Record<string, string>;
}> = {
  filosofico: {
    label: 'Filosófico',
    quote: { pt: '"O corpo é o único lugar onde você sempre terá que viver. Mova-o enquanto é seu."', en: '"The body is the only place you will always have to live. Move it while it is yours."', es: '"El cuerpo es el único lugar donde siempre tendrás que vivir. Muévelo mientras sea tuyo."' },
    attr: { pt: '— cada semana que passa não volta', en: '— every passing week is gone', es: '— cada semana que pasa no vuelve' },
    note: { pt: 'Preencha com caneta as semanas em que você se moveu.\n≥ 150 min de atividade moderada = semana ativa (OMS).', en: 'Mark the weeks you moved.\n≥ 150 min of moderate activity = active week (WHO).', es: 'Marca las semanas que te moviste.\n≥ 150 min de actividad moderada = semana activa (OMS).' },
    tag: { pt: 'Mova-se enquanto há tempo', en: 'Move while there is time', es: 'Muévete mientras hay tiempo' },
    eyebrow: { pt: 'Painel da vida em movimento', en: 'Life in motion panel', es: 'Panel de vida en movimiento' },
    ainda: { pt: 'Por conquistar', en: 'Yet to conquer', es: 'Por conquistar' },
  },
  otimista: {
    label: 'Otimista',
    quote: { pt: '"Cada semana movida é uma semana roubada do esquecimento."', en: '"Every active week is a week stolen from oblivion."', es: '"Cada semana activa es una semana robada al olvido."' },
    attr: { pt: '— celebre cada movimento', en: '— celebrate every movement', es: '— celebra cada movimiento' },
    note: { pt: 'Preencha com cor cada semana em que você se moveu.\n≥ 150 min de atividade moderada = semana ativa (OMS).', en: 'Color each week you moved.\n≥ 150 min of moderate activity = active week (WHO).', es: 'Colorea cada semana que te moviste.\n≥ 150 min de actividad moderada = semana activa (OMS).' },
    tag: { pt: 'Cada semana é uma vitória', en: 'Every week is a victory', es: 'Cada semana es una victoria' },
    eyebrow: { pt: 'Painel da vida em movimento', en: 'Life in motion panel', es: 'Panel de vida en movimiento' },
    ainda: { pt: 'Por celebrar', en: 'To celebrate', es: 'Por celebrar' },
  },
  cientifico: {
    label: 'Científico',
    quote: { pt: '"150 minutos de atividade moderada por semana reduzem em 35% o risco de morte prematura."', en: '"150 minutes of moderate activity per week reduces premature death risk by 35%."', es: '"150 minutos de actividad moderada semanal reducen en 35% el riesgo de muerte prematura."' },
    attr: { pt: '— Organização Mundial da Saúde, 2020', en: '— World Health Organization, 2020', es: '— Organización Mundial de la Salud, 2020' },
    note: { pt: 'Marque as semanas com ≥ 150 min de atividade moderada ou ≥ 75 min de atividade vigorosa.\nReferência: OMS 2020.', en: 'Mark weeks with ≥ 150 min moderate or ≥ 75 min vigorous activity.\nReference: WHO 2020.', es: 'Marca semanas con ≥ 150 min moderado o ≥ 75 min vigoroso.\nReferencia: OMS 2020.' },
    tag: { pt: 'Evidência em cada semana', en: 'Evidence in every week', es: 'Evidencia en cada semana' },
    eyebrow: { pt: 'Registro científico de atividade física ao longo da vida', en: 'Scientific physical activity record across a lifetime', es: 'Registro científico de actividad física a lo largo de la vida' },
  },
  espiritual: {
    label: 'Espiritual',
    quote: { pt: '"Cuidar do corpo é honrar o tempo que nos foi dado."', en: '"To care for the body is to honor the time we were given."', es: '"Cuidar el cuerpo es honrar el tiempo que nos fue dado."' },
    attr: { pt: '— presença em cada movimento', en: '— presence in every movement', es: '— presencia en cada movimiento' },
    note: { pt: 'Preencha com gratidão cada semana de movimento.\nO corpo é templo — cuide-o semana a semana.', en: 'Fill with gratitude each week of movement.\nThe body is a temple — tend it week by week.', es: 'Llena con gratitud cada semana de movimiento.\nEl cuerpo es un templo — cuídalo semana a semana.' },
    tag: { pt: 'Presença em cada semana', en: 'Presence in every week', es: 'Presencia en cada semana' },
    eyebrow: { pt: 'Painel sagrado da vida em movimento', en: 'Sacred panel of life in motion', es: 'Panel sagrado de vida en movimiento' },
  },
};

export const LANGS = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
];

export const MONTHS: Record<string, string[]> = {
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

export const LABELS: Record<string, Record<string, string>> = {
  pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas vividas', act: 'Para colorir', fut: 'Por viver', total: 'Semanas totais', jv: 'Já vividas', ainda: 'Ainda por viver' },
  en: { nome: 'Name', nasc: 'Birth year', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks lived', act: 'To color', fut: 'Yet to live', total: 'Total weeks', jv: 'Already lived', ainda: 'Still to live' },
  es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas vividas', act: 'Para colorear', fut: 'Por vivir', total: 'Semanas totales', jv: 'Ya vividas', ainda: 'Aún por vivir' },
};

export const WEEK_POS = [0, 4, 9, 13, 17, 21, 26, 30, 34, 38, 43, 47];
export const WEEKS = 52;

export interface PosterState {
  name: string;
  birth: string | null;
  expect: number;
  dedic: string;
  theme: string;
  tone: string;
  lang: string;
}
