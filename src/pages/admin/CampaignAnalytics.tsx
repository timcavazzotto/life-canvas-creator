import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { subDays } from 'date-fns';

type Order = {
  affiliate_code: string | null;
  affiliate_id: string | null;
  amount_cents: number;
  commission_cents: number | null;
  status: string;
  created_at: string;
};

type Affiliate = {
  id: string;
  name: string;
  code: string;
};

type AffiliateStats = {
  name: string;
  code: string;
  totalSales: number;
  revenue: number;
  commissions: number;
};

const CampaignAnalytics = () => {
  const [stats, setStats] = useState<AffiliateStats[]>([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const since = subDays(new Date(), period).toISOString();

      const [{ data: orders }, { data: affiliates }] = await Promise.all([
        supabase
          .from('orders')
          .select('affiliate_code, affiliate_id, amount_cents, commission_cents, status, created_at')
          .not('affiliate_code', 'is', null)
          .gte('created_at', since),
        supabase.from('affiliates').select('id, name, code'),
      ]);

      const affMap = new Map((affiliates ?? []).map(a => [a.id, a]));
      const statsMap = new Map<string, AffiliateStats>();

      (orders ?? []).forEach(o => {
        if (!o.affiliate_id) return;
        const aff = affMap.get(o.affiliate_id);
        if (!aff) return;
        const existing = statsMap.get(aff.id) ?? {
          name: aff.name,
          code: aff.code,
          totalSales: 0,
          revenue: 0,
          commissions: 0,
        };
        existing.totalSales++;
        if (o.status === 'paid') {
          existing.revenue += o.amount_cents;
          existing.commissions += o.commission_cents ?? 0;
        }
        statsMap.set(aff.id, existing);
      });

      const sorted = Array.from(statsMap.values()).sort((a, b) => b.revenue - a.revenue);
      setStats(sorted);
      setLoading(false);
    };
    fetch();
  }, [period]);

  const totalCommissions = stats.reduce((s, a) => s + a.commissions, 0);
  const totalAffiliateSales = stats.reduce((s, a) => s + a.totalSales, 0);

  const chartConfig = {
    revenue: { label: 'Receita (R$)', color: 'hsl(var(--chart-1))' },
    commissions: { label: 'Comissões (R$)', color: 'hsl(var(--chart-2))' },
  };

  const chartData = stats.map(s => ({
    name: s.code,
    revenue: s.revenue / 100,
    commissions: s.commissions / 100,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics de Campanhas</h1>
        <div className="flex gap-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                period === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Vendas via Afiliados</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalAffiliateSales}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comissões Totais</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">R$ {(totalCommissions / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Afiliados Ativos</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.length}</p></CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Receita vs Comissões por Afiliado</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commissions" fill="var(--color-commissions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Ranking table */}
      <Card>
        <CardHeader><CardTitle>Ranking de Afiliados</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Carregando…</p>
          ) : stats.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma venda via afiliado no período.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Vendas</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Comissões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((s, i) => (
                  <TableRow key={s.code}>
                    <TableCell className="font-bold">{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="font-mono text-sm">{s.code}</TableCell>
                    <TableCell>{s.totalSales}</TableCell>
                    <TableCell>R$ {(s.revenue / 100).toFixed(2)}</TableCell>
                    <TableCell>R$ {(s.commissions / 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalytics;
