

## Plano: Sistema de Múltiplos Painéis no Projeto 80+

### Visão geral

Adicionar um seletor de "tipo de painel" ao site atual, onde cada tipo traz textos, frases, legenda e lógica de grid próprios. O motor de grid, temas, checkout e PDF são reutilizados. O Painel da Vida em Casal tem lógica especial (dois grids que se fundem a partir da data do casamento).

### Arquitetura

```text
posterData.ts (atual)          panelTypes.ts (novo)
├── THEMES, WEEKS, LANGS ...   ├── PANEL_TYPES[]
└── PosterState                │   ├── id, label, icon, description
                               │   ├── tones (frases específicas)
                               │   ├── labels (legendas específicas)
                               │   ├── extraFields (ex: data casamento)
                               │   └── gridMode: 'standard' | 'couple'
                               └── PanelType interface
```

### Novos tipos de painel

| ID | Nome | Diferencial |
|---|---|---|
| `movimento` | Vida em Movimento | Atual, sem mudanças |
| `espiritual` | Vida Espiritual | Frases e legenda sobre espiritualidade |
| `casal` | Vida em Casal | Grid duplo que une na data do casamento |
| `prosperidade` | Prosperidade | Frases sobre carreira, estudo, crescimento |
| `lazer` | Lazer | Frases sobre hobbies e descanso |
| `leitura` | Leitura | Frases sobre leitura e aprendizado |
| `social` | Vida Social | Frases sobre amigos e família |

### Mudanças por arquivo

#### 1. `src/data/panelTypes.ts` (novo)
- Interface `PanelType` com: id, label, icon, description, tones (mesmo formato do TONES atual), labels, gridMode, extraFields
- Array `PANEL_TYPES` com os 7 tipos, cada um com 4 tons e 3 idiomas de frases
- O tipo `movimento` reutiliza os TONES e LABELS atuais

#### 2. `src/data/posterData.ts`
- Adicionar `panelType: string` ao `PosterState` (default `'movimento'`)
- Manter TONES e LABELS atuais como fallback

#### 3. `src/pages/Index.tsx`
- Novo seletor visual de painel (cards com ícone) acima do configurador, ou como primeira seção do sidebar
- State `panelType` alimenta os tones/labels dinâmicos
- Para o painel "casal": exibir campo extra "Data do casamento"
- Hero e textos da landing adaptam-se ao painel selecionado (ou mantêm genérico)

#### 4. `src/components/PosterPreview.tsx`
- Receber `panelType` via state
- Buscar tones e labels do painel selecionado em vez do TONES/LABELS globais
- Para `gridMode: 'couple'`: renderizar grid especial com duas linhas de vida que se fundem na data do casamento (2 colunas de semanas antes, 1 coluna compartilhada depois)

#### 5. `src/components/CoupleGrid.tsx` (novo)
- Componente especializado para o painel de casal
- Props: birth1, birth2, marriageDate, expect, theme
- Renderiza dois grids separados (pessoa 1 e pessoa 2) que se unem visualmente a partir da semana do casamento em um grid compartilhado
- Marcador visual na linha de união (coração/aliança)

#### 6. `supabase/functions/generate-pdf/index.ts`
- Receber `panelType` no payload
- Carregar tones/labels corretos por tipo
- Para o painel casal: lógica de renderização do grid duplo no PDF

#### 7. `src/components/OrderModal.tsx`
- Passar `panelType` no payload do pedido

#### 8. Banco de dados
- Adicionar coluna `panel_type TEXT DEFAULT 'movimento'` na tabela de pedidos (migration)

### Painel Casal - Lógica do Grid

```text
Pessoa A (nasce 1988)    |████████████░░░░░░░░░|
Pessoa B (nasce 1990)      |██████████░░░░░░░░░|
                                    ↕ casamento (2015)
Grid unido               |████████████░░░░░░░░░|
```

- Antes do casamento: duas fileiras por ano (A em cima, B embaixo), cada uma com 52 colunas
- Após o casamento: uma fileira única por ano, semanas vividas juntos preenchidas
- Campo extra no configurador: "Data do casamento" e "Nome do cônjuge"

### Ordem de implementação sugerida

1. Criar `panelTypes.ts` com dados dos 7 painéis
2. Adicionar seletor de painel no Index.tsx
3. Adaptar PosterPreview para carregar tones/labels dinâmicos
4. Implementar painéis simples (espiritual, prosperidade, lazer, leitura, social)
5. Implementar CoupleGrid e lógica especial do painel casal
6. Atualizar edge function de PDF
7. Migration no banco para `panel_type`

### Estimativa de esforço

- Painéis simples (5 tipos): mudança de dados/textos, ~80% reuso
- Painel casal: componente novo de grid + campos extras, ~40% novo
- PDF: adaptação moderada para cada tipo

