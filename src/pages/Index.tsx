import { useState, useCallback, useRef } from 'react';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Activity, Sparkles, Heart, TrendingUp, Palette, BookOpen, Users } from 'lucide-react';
import '../App.css';
import DemoGrid from '@/components/DemoGrid';
import PosterPreview from '@/components/PosterPreview';
import OrderModal from '@/components/OrderModal';
import { THEMES, LANGS, WEEKS, PAPER_FORMATS, type PosterState, type PaperSize } from '@/data/posterData';
import { PANEL_TYPES, getPanelType } from '@/data/panelTypes';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Index = () => {
  const [st, setSt] = useState<PosterState>({
    name: '', birth: null, expect: 80, dedic: '', theme: 'theme-verde', tone: 'filosofico', lang: 'pt', panelType: 'movimento'
  });
  const [paperSize, setPaperSize] = useState<PaperSize>('30x40');
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPDF = useCallback(async () => {
    if (!posterRef.current) return;
    const { toast } = await import('sonner');
    toast('Gerando PDF…');
    const el = posterRef.current;
    const origBoxShadow = el.style.boxShadow;
    el.style.boxShadow = 'none';
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');
    const canvas = await html2canvas(el, { scale: 4, useCORS: true });
    el.style.boxShadow = origBoxShadow;
    const imgData = canvas.toDataURL('image/png');
    const fmt = PAPER_FORMATS[paperSize];
    const totalW = fmt.mmWidth + fmt.bleed * 2;
    const totalH = fmt.mmHeight + fmt.bleed * 2;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [totalW, totalH] });
    pdf.addImage(imgData, 'PNG', 0, 0, totalW, totalH);
    pdf.save('projeto80plus.pdf');
    toast.success('PDF baixado!');
  }, [paperSize]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true, stats: true, color: true, tone: true, lang: false
  });

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const update = useCallback((partial: Partial<PosterState>) => {
    setSt((prev) => ({ ...prev, ...partial }));
  }, []);

  // Stats
  const total = st.expect * WEEKS;
  const lived = st.birth ? Math.min(Math.floor((Date.now() - parse(st.birth, 'yyyy-MM-dd', new Date()).getTime()) / 6048e5), total) : 0;
  const left = Math.max(0, total - lived);
  const pct = lived > 0 ? Math.round(lived / total * 100) : 0;

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => scrollTo('how')}>Como funciona</button>
          <button className="nav-link" onClick={() => scrollTo('pricing')}>Preços</button>
          <button className="nav-link" onClick={() => scrollTo('config')}>Criar meu painel</button>
          <button className="nav-cta bg-primary" onClick={() => scrollTo('config')}>Começar →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Painel da vida em movimento</div>
          <h1 className="hero-title">PROJETO<br />80<span style={{ fontSize: '0.6em' }}>+</span></h1>
          <div className="hero-sub">
            Uma vida inteira em 4.160 quadrados.<br />
            Cada um é uma semana. Quantas você vai colorir?
          </div>
          <div className="hero-tagline">Personalize · Imprima · Viva ativamente</div>
          <div className="hero-actions">
            <button className="btn-hero bg-primary" onClick={() => scrollTo('config')}>Fazer meu PROJETO 80+</button>
            <button className="btn-hero-ghost" onClick={() => scrollTo('how')}>Como funciona</button>
          </div>
          <div className="hero-proof">
            <div className="proof-item">
              <div className="proof-val">4.160</div>
              <div className="proof-lbl">Semanas de vida</div>
            </div>
            <div className="proof-item">
              <div className="proof-val">≥150</div>
              <div className="proof-lbl">Min/sem recomendados</div>
            </div>
            <div className="proof-item">
              <div className="proof-val">35%</div>
              <div className="proof-lbl">Menos risco de morte prematura</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div style={{ position: 'relative' }}>
            <div className="demo-poster">
              <div className="dp-header">
                <div>
                  <div className="dp-title">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div>
                  <div className="dp-sub">4.160 semanas · 80 anos · uma vida ativa</div>
                </div>
                <div className="dp-quote">"O corpo é o único lugar onde você sempre terá que viver."</div>
              </div>
              <DemoGrid />
              <div className="dp-name-row">
                <div>
                  <div className="dp-field-lbl">Nome</div>
                  <div className="dp-field-val">Seu nome aqui</div>
                </div>
                <div>
                  <div className="dp-field-lbl">Nascimento</div>
                  <div className="dp-field-val">1985</div>
                </div>
                <div>
                  <div className="dp-field-lbl">Expectativa</div>
                  <div className="dp-field-val">80 anos</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="section-eyebrow">Como funciona</div>
        <div className="section-title">Três passos para o seu painel</div>
        <div className="steps">
          <div className="step">
            <div className="step-num"><span>1</span></div>
            <div className="step-title">Personalize</div>
            <div className="step-desc">Informe seu nome, ano de nascimento e expectativa de vida. Escolha a paleta, o tom das frases e o idioma. O painel se monta em tempo real.</div>
          </div>
          <div className="step">
            <div className="step-num"><span>2</span></div>
            <div className="step-title">Escolha o formato</div>
            <div className="step-desc">PDF digital de alta resolução para imprimir onde quiser, ou quadro impresso em papel premium enviado diretamente à sua casa.</div>
          </div>
          <div className="step">
            <div className="step-num"><span>3</span></div>
            <div className="step-title">Colora e viva</div>
            <div className="step-desc">Preencha com caneta cada semana em que você se moveu. Veja o painel ganhar cor ao longo dos anos — e deixe-o ser seu lembrete diário.</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="section-eyebrow">Quem já tem o seu</div>
        <div className="section-title">O que dizem</div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-text">"Coloquei na parede do escritório. Toda vez que não quero me exercitar, olho para aquelas semanas vazias e mudo de ideia."</div>
            <div className="testi-author">Mariana C.</div>
            <div className="testi-role">São Paulo · 38 anos</div>
          </div>
          <div className="testi-card">
            <div className="testi-text">"Dei de presente para meu pai nos 60 anos dele. Ele me ligou emocionado. Disse que nunca tinha pensado na vida assim — em semanas."</div>
            <div className="testi-author">Felipe R.</div>
            <div className="testi-role">Curitiba · 34 anos</div>
          </div>
          <div className="testi-card">
            <div className="testi-text">"Como médica, uso com pacientes sedentários. Mostrar visualmente quantas semanas já passaram e quantas restam transforma a conversa."</div>
            <div className="testi-author">Dra. Ana L.</div>
            <div className="testi-role">Cardiologista · Porto Alegre</div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="section-eyebrow">Formatos</div>
        <div className="section-title">Escolha o seu</div>
        <div className="pricing-cards">
          <div className="price-card">
            <div className="price-tag">PDF Digital</div>
            <div className="price-name">Digital</div>
            <div className="price-val"><small>R$</small> 29</div>
            <div className="price-note">Entrega imediata </div>
            <ul className="price-features">
              <li>PDF em alta resolução (300 dpi)</li>
              <li>Personalizado com seus dados</li>
              <li>Pronto para imprimir </li>
              <li>Tamanho A3 ou A2</li>
            </ul>
            <button className="price-btn outline" onClick={() => scrollTo('config')}>Criar e baixar</button>
          </div>
          <div className="price-card">
            <div className="price-tag">✦ Mais popular</div>
            <div className="price-name">Quadro Impresso</div>
            <div className="price-val"><small>R$</small> 89</div>
            <div className="price-note">+ frete · entrega em 7–10 dias úteis</div>
            <ul className="price-features">
              <li>Papel premium 250g/m²</li>
              <li>Tamanho A3 (42 × 30 cm)</li>
              <li>Personalizado com seus dados</li>
              <li>Pronto para imprimir</li>
            </ul>
            <button className="price-btn outline" onClick={() => scrollTo('config')}>Criar e encomendar</button>
          </div>
        </div>
      </section>

      {/* CONFIGURATOR */}
      <section className="config-section" id="config">
        <div className="config-header">
          <div>
            <div className="config-header-title">Crie seu PROJETO 80<span style={{ fontSize: '0.7em', color: 'var(--accent)' }}>+</span></div>
            <div className="config-header-sub">Personalize ao vivo · o painel atualiza em tempo real</div>
          </div>
          <button className="nav-cta" onClick={downloadPDF}>▶ Quero meu painel</button>
        </div>

        <div className="config-body">
          <div className="cfg-sidebar">
            {/* Panel Type Selector */}
            <div className={`cfg-section open`}>
              <div className="cfg-section-head">
                <span className="cfg-lbl">Tipo de painel</span>
              </div>
              <div className="cfg-body-inner">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {PANEL_TYPES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        const firstTone = Object.keys(p.tones)[0];
                        update({ panelType: p.id, tone: firstTone });
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        borderRadius: '999px',
                        border: st.panelType === p.id ? '1.5px solid #365545' : '1px solid var(--border-soft, rgba(0,0,0,0.12))',
                        background: st.panelType === p.id ? '#365545' : 'transparent',
                        color: st.panelType === p.id ? '#fff' : 'inherit',
                        cursor: 'pointer',
                        fontWeight: st.panelType === p.id ? 600 : 400,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {(() => {
                        const iconMap: Record<string, React.ReactNode> = {
                          'activity': <Activity size={14} />,
                          'sparkles': <Sparkles size={14} />,
                          'heart': <Heart size={14} />,
                          'trending-up': <TrendingUp size={14} />,
                          'palette': <Palette size={14} />,
                          'book-open': <BookOpen size={14} />,
                          'users': <Users size={14} />,
                        };
                        return iconMap[p.icon] || null;
                      })()}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className={`cfg-section${openSections.identity ? ' open' : ''}`}>
              <div className="cfg-section-head" onClick={() => toggleSection('identity')}>
                <span className="cfg-lbl">Identidade</span><span className="cfg-arrow">▾</span>
              </div>
              <div className="cfg-body-inner">
                <div className="cfg-field">
                  <label>Nome completo</label>
                  <input type="text" placeholder="Ex: Ana Souza" maxLength={30} value={st.name} onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div className="cfg-field">
                  <label>Data de nascimento</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !st.birth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {st.birth ? format(parse(st.birth, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy") : <span>Selecione a data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={st.birth ? parse(st.birth, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => update({ birth: date ? format(date, 'yyyy-MM-dd') : null })}
                        disabled={(date) => date > new Date() || date < new Date("1920-01-01")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        defaultMonth={st.birth ? parse(st.birth, 'yyyy-MM-dd', new Date()) : new Date(1985, 0)}
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="cfg-field">
                  <label>Expectativa de vida</label>
                  <select value={st.expect} onChange={(e) => update({ expect: parseInt(e.target.value) })}>
                    <option value={75}>75 anos</option>
                    <option value={80}>80 anos</option>
                    <option value={85}>85 anos</option>
                    <option value={90}>90 anos</option>
                    <option value={95}>95 anos</option>
                  </select>
                </div>
                <div className="cfg-field">
                  <label>Dedicatória (opcional)</label>
                  <textarea placeholder="Para alguém especial…" value={st.dedic} onChange={(e) => update({ dedic: e.target.value })} />
                </div>

                {/* Couple-specific fields */}
                {st.panelType === 'casal' && (
                  <>
                    <div className="cfg-field">
                      <label>Nome do cônjuge</label>
                      <input type="text" placeholder="Ex: João Silva" maxLength={30} value={st.partnerName || ''} onChange={(e) => update({ partnerName: e.target.value })} />
                    </div>
                    <div className="cfg-field">
                      <label>Data do casamento</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !st.marriageDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {st.marriageDate ? format(parse(st.marriageDate, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy") : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" captionLayout="dropdown-buttons" selected={st.marriageDate ? parse(st.marriageDate, 'yyyy-MM-dd', new Date()) : undefined} onSelect={(date) => update({ marriageDate: date ? format(date, 'yyyy-MM-dd') : null })} disabled={(date) => date > new Date() || date < new Date("1920-01-01")} initialFocus className={cn("p-3 pointer-events-auto")} defaultMonth={st.marriageDate ? parse(st.marriageDate, 'yyyy-MM-dd', new Date()) : new Date(2010, 0)} fromYear={1950} toYear={new Date().getFullYear()} locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Stats */}
            <div className={`cfg-section${openSections.stats ? ' open' : ''}`}>
              <div className="cfg-section-head" onClick={() => toggleSection('stats')}>
                <span className="cfg-lbl">Sua vida em números</span><span className="cfg-arrow">▾</span>
              </div>
              <div className="cfg-body-inner">
                <div className="cfg-stats">
                  <div className="cfg-stat"><div className="cfg-stat-val">{lived > 0 ? lived.toLocaleString('pt-BR') : '—'}</div><div className="cfg-stat-lbl">Vividas</div></div>
                  <div className="cfg-stat"><div className="cfg-stat-val">{lived > 0 ? left.toLocaleString('pt-BR') : '—'}</div><div className="cfg-stat-lbl">Restantes</div></div>
                  <div className="cfg-stat"><div className="cfg-stat-val">{total.toLocaleString('pt-BR')}</div><div className="cfg-stat-lbl">Total</div></div>
                  <div className="cfg-stat"><div className="cfg-stat-val">{lived > 0 ? pct + '%' : '—'}</div><div className="cfg-stat-lbl">Vivido</div></div>
                </div>
                <div className="cfg-bar"><div className="cfg-bar-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            </div>

            {/* Color */}
            <div className={`cfg-section${openSections.color ? ' open' : ''}`}>
              <div className="cfg-section-head" onClick={() => toggleSection('color')}>
                <span className="cfg-lbl">Paleta</span><span className="cfg-arrow">▾</span>
              </div>
              <div className="cfg-body-inner">
                <div className="cfg-swatches">
                  {THEMES.map((t) =>
                  <div
                    key={t.id}
                    className={`cfg-swatch${st.theme === t.id ? ' active' : ''}`}
                    onClick={() => update({ theme: t.id })}>
                    
                      <div
                      className="cfg-swatch-preview"
                      style={{
                        background: t.bg,
                        borderBottom: `2px solid ${t.accent}`,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '3px 4px',
                        gap: 2
                      }}>
                      
                        <div style={{ width: '55%', height: 4, background: t.lived, borderRadius: 1 }} />
                        <div style={{ width: '30%', height: 4, background: t.accent, borderRadius: 1, opacity: 0.35 }} />
                      </div>
                      <div className="cfg-swatch-lbl">{t.label}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className={`cfg-section${openSections.tone ? ' open' : ''}`}>
              <div className="cfg-section-head" onClick={() => toggleSection('tone')}>
                <span className="cfg-lbl">Tom das frases</span><span className="cfg-arrow">▾</span>
              </div>
              <div className="cfg-body-inner">
                <div className="cfg-pills">
                  {Object.entries(getPanelType(st.panelType).tones).map(([key, val]) =>
                  <button
                    key={key}
                    className={`cfg-pill${st.tone === key ? ' active' : ''}`}
                    onClick={() => update({ tone: key })}>
                    
                      {val.label}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lang */}
            <div className={`cfg-section${openSections.lang ? ' open' : ''}`}>
              <div className="cfg-section-head" onClick={() => toggleSection('lang')}>
                <span className="cfg-lbl">Idioma</span><span className="cfg-arrow">▾</span>
              </div>
              <div className="cfg-body-inner">
                <div className="cfg-lang-pills">
                  {LANGS.map((l) =>
                  <button
                    key={l.id}
                    className={`cfg-lang-pill${st.lang === l.id ? ' active' : ''}`}
                    onClick={() => update({ lang: l.id })}>
                    
                      {l.label}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Paper Size */}
            <div className="cfg-section open">
              <div className="cfg-section-head">
                <span className="cfg-lbl">Formato do papel</span>
              </div>
              <div className="cfg-body-inner" style={{ display: 'flex' }}>
                <div className="cfg-pills">
                  {(Object.entries(PAPER_FORMATS) as [PaperSize, typeof PAPER_FORMATS[PaperSize]][]).map(([key, fmt]) => (
                    <button
                      key={key}
                      className={`cfg-pill${paperSize === key ? ' active' : ''}`}
                      onClick={() => setPaperSize(key)}
                      title={fmt.desc}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="cfg-cta">
              <button className="cfg-btn-gold bg-primary text-primary-foreground" onClick={() => setModalOpen(true)}>▶ Quero meu painel</button>
              
              <div className="cfg-note">Impressão premium a partir de R$ 89</div>
            </div>
          </div>

          <div className="cfg-preview">
            <div className="cfg-preview-hint">Pré-visualização ao vivo</div>
            <PosterPreview ref={posterRef} state={st} posterHeight={PAPER_FORMATS[paperSize].previewHeight} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" style={{ color: '#f5f3ef' }}>
        <div className="footer-brand">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div>
        <div className="footer-text">Mova-se enquanto há tempo · © 2025</div>
        <div className="footer-text" style={{ opacity: 0.6 }}>Uma marca Studio Mets</div>
        <a
          href="https://linktr.ee/studio.mets"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: '#f5f3ef', textDecoration: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.953 15.066l-.038-4.28 4.817-.002.002-3.239H8.39L11.9 3.66l-2.69-.001L6.275 7.545l-2.996-3.886-2.69.001 3.558 3.884H.463v3.239h4.6L5.1 15.066zM12.047 15.066l.038-4.28-4.817-.002-.002-3.239h4.384L8.1 3.66l2.69-.001 2.935 3.886 2.996-3.886 2.69.001-3.558 3.884h3.684v3.239h-4.6l-.037 4.283zM8.874 18.465c0-.924.754-1.672 1.684-1.672.929 0 1.683.748 1.683 1.672a1.678 1.678 0 01-1.683 1.672c-.93 0-1.684-.748-1.684-1.672z"/>
          </svg>
          linktr.ee/studio.mets
        </a>
      </footer>

      {/* MODAL */}
      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} posterState={st} posterRef={posterRef} paperSize={paperSize} />
    </>);

};

export default Index;