import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Order = {
  id: string;
  email: string;
  customer_name: string | null;
  amount_cents: number;
  status: string;
  order_type: string;
  created_at: string;
  affiliate_code: string | null;
};

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const since = subDays(new Date(), period).toISOString();
      const { data } = await supabase
        .from('orders')
        .select('id, email, customer_name, amount_cents, status, order_type, created_at, affiliate_code')
        .gte('created_at', since)
        .order('created_at', { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [period]);

  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.amount_cents, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Chart data: daily sales
  const chartData = (() => {
    const days: Record<string, number> = {};
    for (let i = period - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'dd/MM');
      days[d] = 0;
    }
    paidOrders.forEach(o => {
      const d = format(new Date(o.created_at), 'dd/MM');
      if (d in days) days[d] += o.amount_cents / 100;
    });
    return Object.entries(days).map(([day, revenue]) => ({ day, revenue }));
  })();

  const chartConfig = {
    revenue: { label: 'Receita (R$)', color: 'hsl(var(--chart-1))' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Pedidos</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalOrders}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Receita Total</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">R$ {(totalRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pagos</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-green-600">{paidOrders.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pendentes</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-amber-600">{pendingOrders}</p></CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle>Receita por dia</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card>
        <CardHeader><CardTitle>Pedidos recentes</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Carregando…</p>
          ) : orders.length === 0 ? (
            <p className="text-muted-foreground">Nenhum pedido no período.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cupom</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 20).map(o => (
                  <TableRow key={o.id}>
                    <TableCell>{format(new Date(o.created_at), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell>{o.customer_name || o.email}</TableCell>
                    <TableCell className="capitalize">{o.order_type}</TableCell>
                    <TableCell>R$ {(o.amount_cents / 100).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        o.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>{o.affiliate_code || '—'}</TableCell>
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

export default Dashboard;
