import { useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import '../App.css';
import DemoGrid from '@/components/DemoGrid';
import PosterPreview from '@/components/PosterPreview';
import OrderModal from '@/components/OrderModal';
import { THEMES, TONES, LANGS, WEEKS, type PosterState } from '@/data/posterData';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const Index = () => {
  const [st, setSt] = useState<PosterState>({
    name: '', birth: null, expect: 80, dedic: '', theme: 'theme-verde', tone: 'filosofico', lang: 'pt', paperSize: 'a3'
  });
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
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: st.paperSize });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 3;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;
    const ratio = Math.min(usableW / canvas.width, usableH / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
    pdf.save('projeto80plus.pdf');
    toast.success('PDF baixado!');
  }, [st.paperSize]);
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
  const lived = st.birth ? Math.min(Math.floor((Date.now() - new Date(st.birth).getTime()) / 6048e5), total) : 0;
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
                        {st.birth ? format(new Date(st.birth), "dd/MM/yyyy") : <span>Selecione a data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={st.birth ? new Date(st.birth) : undefined}
                        onSelect={(date) => update({ birth: date ? format(date, 'yyyy-MM-dd') : null })}
                        disabled={(date) => date > new Date() || date < new Date("1920-01-01")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        defaultMonth={st.birth ? new Date(st.birth) : new Date(1985, 0)}
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
                  {Object.entries(TONES).map(([key, val]) =>
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

            <div className="cfg-cta">
              <div className="cfg-field" style={{ marginBottom: 8 }}>
                <label>Formato do papel</label>
                <select value={st.paperSize} onChange={(e) => update({ paperSize: e.target.value as 'a2' | 'a3' })}>
                  <option value="a3">A3 (297 × 420 mm)</option>
                  <option value="a2">A2 (420 × 594 mm)</option>
                </select>
              </div>
              <button className="cfg-btn-gold bg-primary text-primary-foreground" onClick={downloadPDF}>▶ Quero meu painel</button>
              
              <div className="cfg-note">Impressão premium a partir de R$ 89</div>
            </div>
          </div>

          <div className="cfg-preview">
            <div className="cfg-preview-hint">Pré-visualização ao vivo</div>
            <PosterPreview ref={posterRef} state={st} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-brand">PROJETO 80<span style={{ fontSize: '0.7em' }}>+</span></div>
        <div className="footer-text">Mova-se enquanto há tempo · © 2025</div>
      </footer>

      {/* MODAL */}
      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} posterState={st} />
    </>);

};

export default Index;