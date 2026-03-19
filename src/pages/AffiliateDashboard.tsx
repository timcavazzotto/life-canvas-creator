import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAffiliateAuth } from '@/hooks/useAffiliateAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, TrendingUp, Wallet, LogOut } from 'lucide-react';

type Order = {
  id: string;
  created_at: string;
  amount_cents: number;
  commission_cents: number | null;
  commission_paid: boolean;
  status: string;
  customer_name: string | null;
};

type Payment = {
  id: string;
  amount_cents: number;
  paid_at: string;
  notes: string | null;
};

const AffiliateDashboard = () => {
  const { user, affiliate, loading, signOut } = useAffiliateAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !affiliate)) {
      navigate('/afiliado/login');
    }
  }, [loading, user, affiliate, navigate]);

  useEffect(() => {
    if (!affiliate) return;
    const fetchData = async () => {
      const [ordersRes, paymentsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, created_at, amount_cents, commission_cents, commission_paid, status, customer_name')
          .eq('affiliate_id', affiliate.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('commission_payments')
          .select('id, amount_cents, paid_at, notes')
          .eq('affiliate_id', affiliate.id)
          .order('paid_at', { ascending: false }),
      ]);
      setOrders((ordersRes.data as Order[]) ?? []);
      setPayments((paymentsRes.data as Payment[]) ?? []);
      setDataLoading(false);
    };
    fetchData();
  }, [affiliate]);

  if (loading || !affiliate) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando…</div>;
  }

  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalSales = paidOrders.reduce((s, o) => s + o.amount_cents, 0);
  const totalCommission = paidOrders.reduce((s, o) => s + (o.commission_cents ?? 0), 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount_cents, 0);
  const pendingBalance = totalCommission - totalPaid;

  const fmt = (cents: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div>
            <h1 className="text-xl font-bold">Olá, {affiliate.name}</h1>
            <p className="text-sm text-muted-foreground">Código: <span className="font-mono">{affiliate.code}</span></p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/afiliado/login'); }}>
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidOrders.length}</div>
              <p className="text-xs text-muted-foreground">{fmt(totalSales)} em vendas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(totalCommission)}</div>
              <p className="text-xs text-muted-foreground">{affiliate.commission_pct}% por venda</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Já Recebido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(totalPaid)}</div>
              <p className="text-xs text-muted-foreground">{payments.length} pagamento(s)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Pendente</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${pendingBalance > 0 ? 'text-green-600' : ''}`}>
                {fmt(pendingBalance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <p className="text-muted-foreground">Carregando…</p>
            ) : paidOrders.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma venda registrada ainda.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidOrders.map(o => (
                    <TableRow key={o.id}>
                      <TableCell>{fmtDate(o.created_at)}</TableCell>
                      <TableCell>{o.customer_name || '—'}</TableCell>
                      <TableCell>{fmt(o.amount_cents)}</TableCell>
                      <TableCell>{fmt(o.commission_cents ?? 0)}</TableCell>
                      <TableCell>
                        <Badge variant={o.commission_paid ? 'default' : 'secondary'}>
                          {o.commission_paid ? 'Pago' : 'Pendente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payments history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground">Nenhum pagamento registrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{fmtDate(p.paid_at)}</TableCell>
                      <TableCell className="font-medium">{fmt(p.amount_cents)}</TableCell>
                      <TableCell>{p.notes || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AffiliateDashboard;
