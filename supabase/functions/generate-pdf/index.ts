import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Theme definitions matching frontend
const THEMES: Record<string, { bg: string; accent: string; lived: string }> = {
  "theme-classico": { bg: "#fafafa", accent: "#111111", lived: "#d0d0d0" },
  "theme-verde": { bg: "#f4f8f4", accent: "#1a5c30", lived: "#b8d8c0" },
  "theme-terracota": { bg: "#faf5f0", accent: "#7a3018", lived: "#e8c8b0" },
  "theme-sepia": { bg: "#f8f2e0", accent: "#8a6820", lived: "#ddd0a0" },
  "theme-roxo": { bg: "#f8f4fc", accent: "#5a1e88", lived: "#d8b8f0" },
  "theme-azul": { bg: "#f2f6fa", accent: "#104878", lived: "#a8c8e8" },
};

const TONES: Record<string, {
  quote: Record<string, string>;
  attr: Record<string, string>;
  note: Record<string, string>;
  tag: Record<string, string>;
  eyebrow: Record<string, string>;
  ainda: Record<string, string>;
}> = {
  filosofico: {
    quote: { pt: '"O corpo é o único lugar onde você sempre terá que viver. Mova-o enquanto é seu."', en: '"The body is the only place you will always have to live. Move it while it is yours."', es: '"El cuerpo es el único lugar donde siempre tendrás que vivir. Muévelo mientras sea tuyo."' },
    attr: { pt: '— cada semana que passa não volta', en: '— every passing week is gone', es: '— cada semana que pasa no vuelve' },
    note: { pt: 'Preencha com caneta as semanas em que você se moveu.\n≥ 150 min de atividade moderada = semana ativa (OMS).', en: 'Mark the weeks you moved.\n≥ 150 min of moderate activity = active week (WHO).', es: 'Marca las semanas que te moviste.\n≥ 150 min de actividad moderada = semana activa (OMS).' },
    tag: { pt: 'Mova-se enquanto há tempo', en: 'Move while there is time', es: 'Muévete mientras hay tiempo' },
    eyebrow: { pt: 'Painel da vida em movimento', en: 'Life in motion panel', es: 'Panel de vida en movimiento' },
    ainda: { pt: 'Por conquistar', en: 'Yet to conquer', es: 'Por conquistar' },
  },
  otimista: {
    quote: { pt: '"Cada semana movida é uma semana roubada do esquecimento."', en: '"Every active week is a week stolen from oblivion."', es: '"Cada semana activa es una semana robada al olvido."' },
    attr: { pt: '— celebre cada movimento', en: '— celebrate every movement', es: '— celebra cada movimiento' },
    note: { pt: 'Preencha com cor cada semana em que você se moveu.\n≥ 150 min de atividade moderada = semana ativa (OMS).', en: 'Color each week you moved.\n≥ 150 min of moderate activity = active week (WHO).', es: 'Colorea cada semana que te moviste.\n≥ 150 min de actividad moderada = semana activa (OMS).' },
    tag: { pt: 'Cada semana é uma vitória', en: 'Every week is a victory', es: 'Cada semana es una victoria' },
    eyebrow: { pt: 'Painel da vida em movimento', en: 'Life in motion panel', es: 'Panel de vida en movimiento' },
    ainda: { pt: 'Por celebrar', en: 'To celebrate', es: 'Por celebrar' },
  },
  cientifico: {
    quote: { pt: '"150 minutos de atividade moderada por semana reduzem em 35% o risco de morte prematura."', en: '"150 minutes of moderate activity per week reduces premature death risk by 35%."', es: '"150 minutos de actividad moderada semanal reducen en 35% el riesgo de muerte prematura."' },
    attr: { pt: '— Organização Mundial da Saúde, 2020', en: '— World Health Organization, 2020', es: '— Organización Mundial de la Salud, 2020' },
    note: { pt: 'Marque as semanas com ≥ 150 min de atividade moderada ou ≥ 75 min de atividade vigorosa.\nReferência: OMS 2020.', en: 'Mark weeks with ≥ 150 min moderate or ≥ 75 min vigorous activity.\nReference: WHO 2020.', es: 'Marca semanas con ≥ 150 min moderado o ≥ 75 min vigoroso.\nReferencia: OMS 2020.' },
    tag: { pt: 'Evidência em cada semana', en: 'Evidence in every week', es: 'Evidencia en cada semana' },
    eyebrow: { pt: 'Registro científico de atividade física ao longo da vida', en: 'Scientific physical activity record across a lifetime', es: 'Registro científico de actividad física a lo largo de la vida' },
    ainda: { pt: 'Por registrar', en: 'To record', es: 'Por registrar' },
  },
  espiritual: {
    quote: { pt: '"Cuidar do corpo é honrar o tempo que nos foi dado."', en: '"To care for the body is to honor the time we were given."', es: '"Cuidar el cuerpo es honrar el tiempo que nos fue dado."' },
    attr: { pt: '— presença em cada movimento', en: '— presence in every movement', es: '— presencia en cada movimiento' },
    note: { pt: 'Preencha com gratidão cada semana de movimento.\nO corpo é templo — cuide-o semana a semana.', en: 'Fill with gratitude each week of movement.\nThe body is a temple — tend it week by week.', es: 'Llena con gratitud cada semana de movimiento.\nEl cuerpo es un templo — cuídalo semana a semana.' },
    tag: { pt: 'Presença em cada semana', en: 'Presence in every week', es: 'Presencia en cada semana' },
    eyebrow: { pt: 'Painel sagrado da vida em movimento', en: 'Sacred panel of life in motion', es: 'Panel sagrado de vida en movimiento' },
    ainda: { pt: 'Por honrar', en: 'To honor', es: 'Por honrar' },
  },
};

const LABELS: Record<string, Record<string, string>> = {
  pt: { nome: 'Nome', nasc: 'Nascimento', exp: 'Expectativa', dedic: 'Dedicatória', lvd: 'Semanas vividas', fut: 'Por viver', total: 'Semanas totais', jv: 'Já vividas' },
  en: { nome: 'Name', nasc: 'Birth date', exp: 'Life expectancy', dedic: 'Dedication', lvd: 'Weeks lived', fut: 'Yet to live', total: 'Total weeks', jv: 'Already lived' },
  es: { nome: 'Nombre', nasc: 'Nacimiento', exp: 'Expectativa', dedic: 'Dedicatoria', lvd: 'Semanas vividas', fut: 'Por vivir', total: 'Semanas totales', jv: 'Ya vividas' },
};

const WEEKS = 52;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { order_id } = await req.json();
    if (!order_id) {
      return new Response(JSON.stringify({ error: "Missing order_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("poster_config, order_type")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      console.error("Order fetch error:", orderErr);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cfg = order.poster_config as {
      name?: string;
      birth?: string | null;
      expect?: number;
      dedic?: string;
      theme?: string;
      tone?: string;
      lang?: string;
    };

    const themeDef = THEMES[cfg.theme || "theme-verde"] || THEMES["theme-verde"];
    const toneDef = TONES[cfg.tone || "filosofico"] || TONES["filosofico"];
    const lang = cfg.lang || "pt";
    const lb = LABELS[lang] || LABELS["pt"];
    const expect = cfg.expect || 80;
    const total = expect * WEEKS;
    const lived = cfg.birth
      ? Math.min(Math.floor((Date.now() - new Date(cfg.birth).getTime()) / 6048e5), total)
      : 0;
    const left = Math.max(0, total - lived);
    const yr = lang === "pt" ? "anos" : lang === "es" ? "años" : "years";
    const wkLabel = lang === "pt" ? "semanas" : lang === "es" ? "semanas" : "weeks";
    const al = lang === "pt" ? "uma vida ativa" : lang === "es" ? "una vida activa" : "an active life";

    // PDF dimensions: A3 (297 × 420 mm)
    const W = 297;
    const H = 420;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [W, H] });

    // Background
    const bg = hexToRgb(themeDef.bg);
    doc.setFillColor(bg.r, bg.g, bg.b);
    doc.rect(0, 0, W, H, "F");

    const accent = hexToRgb(themeDef.accent);
    const livedColor = hexToRgb(themeDef.lived);
    const margin = 15;
    let y = margin;

    // --- HEADER ---
    // Eyebrow
    doc.setFontSize(7);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(toneDef.eyebrow[lang] || "", margin, y);
    y += 5;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PROJETO 80+", margin, y);
    y += 5;

    // Subtitle
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatNumber(total)} ${wkLabel} · ${expect} ${yr} · ${al}`, margin, y);

    // Quote (right side)
    const quoteX = W / 2 + 10;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    const quoteText = toneDef.quote[lang] || "";
    const quoteLines = doc.splitTextToSize(quoteText, W / 2 - margin - 10);
    doc.text(quoteLines, quoteX, margin + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text(toneDef.attr[lang] || "", quoteX, margin + 2 + quoteLines.length * 3.5);

    y += 6;

    // --- FIELDS ROW ---
    doc.setDrawColor(accent.r, accent.g, accent.b);
    doc.setLineWidth(0.15);
    doc.line(margin, y, W - margin, y);
    y += 4;

    const fieldW = (W - 2 * margin) / 3;

    // Name
    doc.setFontSize(5.5);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(lb.nome, margin, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(cfg.name || "", margin, y + 4.5);

    // Birth
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.text(lb.nasc, margin + fieldW, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(cfg.birth ? formatDate(cfg.birth) : "", margin + fieldW, y + 4.5);

    // Expectancy
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.text(lb.exp, margin + fieldW * 2, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${expect} ${yr}`, margin + fieldW * 2, y + 4.5);

    y += 10;

    // Dedication
    if (cfg.dedic && cfg.dedic.trim()) {
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      doc.text(lb.dedic, margin, y);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(cfg.dedic, margin, y + 4);
      y += 8;
    }

    // --- GRID ---
    const gridTop = y + 2;
    const decadeColW = 8;
    const gridLeft = margin + decadeColW;
    const gridRight = W - margin;
    const gridW = gridRight - gridLeft;
    const cellSize = Math.min(gridW / WEEKS, (H - gridTop - 45) / expect);
    const gap = cellSize * 0.12;
    const cellDraw = cellSize - gap;

    for (let yr = 0; yr < expect; yr++) {
      const rowY = gridTop + yr * cellSize;

      // Decade label
      if (yr % 10 === 0) {
        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(accent.r, accent.g, accent.b);
        doc.text(String(yr), margin, rowY + cellSize * 0.7);
      }

      // Decade separator line
      if (yr > 0 && yr % 10 === 0) {
        doc.setDrawColor(accent.r, accent.g, accent.b);
        doc.setLineWidth(0.1);
        doc.line(gridLeft, rowY - gap / 2, gridLeft + WEEKS * cellSize, rowY - gap / 2);
      }

      for (let w = 0; w < WEEKS; w++) {
        const idx = yr * WEEKS + w;
        const cellX = gridLeft + w * cellSize;
        const cellY = rowY;

        if (idx < lived) {
          doc.setFillColor(livedColor.r, livedColor.g, livedColor.b);
        } else {
          // Future: very light version of accent
          const futR = Math.round(bg.r * 0.85 + accent.r * 0.15);
          const futG = Math.round(bg.g * 0.85 + accent.g * 0.15);
          const futB = Math.round(bg.b * 0.85 + accent.b * 0.15);
          doc.setFillColor(futR, futG, futB);
        }

        doc.roundedRect(cellX, cellY, cellDraw, cellDraw, 0.2, 0.2, "F");
      }
    }

    // --- LEGEND ---
    const legendY = gridTop + expect * cellSize + 4;
    const legendCellSize = 3;

    doc.setFillColor(livedColor.r, livedColor.g, livedColor.b);
    doc.roundedRect(margin, legendY, legendCellSize, legendCellSize, 0.3, 0.3, "F");
    doc.setFontSize(6);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(lb.lvd, margin + legendCellSize + 2, legendY + 2.3);

    const futR2 = Math.round(bg.r * 0.85 + accent.r * 0.15);
    const futG2 = Math.round(bg.g * 0.85 + accent.g * 0.15);
    const futB2 = Math.round(bg.b * 0.85 + accent.b * 0.15);
    doc.setFillColor(futR2, futG2, futB2);
    doc.roundedRect(margin + 45, legendY, legendCellSize, legendCellSize, 0.3, 0.3, "F");
    doc.text(lb.fut, margin + 45 + legendCellSize + 2, legendY + 2.3);

    // Note
    doc.setFontSize(5);
    const noteLines = doc.splitTextToSize((toneDef.note[lang] || "").replace(/\n/g, " "), W - 2 * margin);
    doc.text(noteLines, margin, legendY + 7);

    // --- FOOTER ---
    const footY = H - margin;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(formatNumber(total), margin, footY - 4);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text(lb.total, margin, footY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(lived > 0 ? formatNumber(lived) : "—", margin + 35, footY - 4);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text(lb.jv, margin + 35, footY);

    // Center brand
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PROJETO 80+", W / 2, footY - 4, { align: "center" });
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.text(toneDef.tag[lang] || "", W / 2, footY, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(lived > 0 ? formatNumber(left) : "—", W - margin - 35, footY - 4);
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text(toneDef.ainda[lang] || "", W - margin - 35, footY);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("≥150", W - margin, footY - 4, { align: "right" });
    doc.setFontSize(5);
    doc.setFont("helvetica", "normal");
    doc.text("Min/sem · OMS", W - margin, footY, { align: "right" });

    // Generate PDF bytes
    const pdfBytes = doc.output("arraybuffer");
    const filePath = `${order_id}.pdf`;

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from("order-pdfs")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return new Response(JSON.stringify({ error: "Failed to upload PDF" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update order with path
    await supabase
      .from("orders")
      .update({ pdf_storage_path: filePath })
      .eq("id", order_id);

    console.log(`PDF generated and uploaded for order ${order_id}`);

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("PDF generation error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
