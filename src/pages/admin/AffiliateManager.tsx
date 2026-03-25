import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, DollarSign } from 'lucide-react';

type Affiliate = {
  id: string;
  name: string;
  code: string;
  email: string;
  commission_pct: number;
  active: boolean;
  created_at: string;
  user_id: string | null;
};

type AffiliateWithBalance = Affiliate & {
  total_commission: number;
  total_paid: number;
  pending_balance: number;
};

const AffiliateManager = () => {
  const [affiliates, setAffiliates] = useState<AffiliateWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', email: '', commission_pct: '10', discount_pct: '0' });
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; affiliate: AffiliateWithBalance | null }>({ open: false, affiliate: null });
  const [paymentForm, setPaymentForm] = useState({ amount: '', notes: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchAffiliates = async () => {
    const { data: affs } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!affs) { setAffiliates([]); setLoading(false); return; }

    // Fetch commission totals and payments for each affiliate
    const enriched: AffiliateWithBalance[] = await Promise.all(
      affs.map(async (a) => {
        const [ordersRes, paymentsRes] = await Promise.all([
          supabase
            .from('orders')
            .select('commission_cents')
            .eq('affiliate_id', a.id)
            .eq('status', 'paid'),
          supabase
            .from('commission_payments')
            .select('amount_cents')
            .eq('affiliate_id', a.id),
        ]);
        const total_commission = (ordersRes.data ?? []).reduce((s, o) => s + (o.commission_cents ?? 0), 0);
        const total_paid = (paymentsRes.data ?? []).reduce((s, p) => s + p.amount_cents, 0);
        return {
          ...a,
          total_commission,
          total_paid,
          pending_balance: total_commission - total_paid,
        };
      })
    );

    setAffiliates(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchAffiliates(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('affiliates').insert({
      name: form.name,
      code: form.code.toUpperCase(),
      email: form.email,
      commission_pct: parseFloat(form.commission_pct) || 10,
      discount_pct: parseFloat(form.discount_pct) || 0,
    });
    if (error) {
      toast.error('Erro ao adicionar: ' + error.message);
    } else {
      toast.success('Afiliada adicionada!');
      setForm({ name: '', code: '', email: '', commission_pct: '10', discount_pct: '0' });
      setShowForm(false);
      fetchAffiliates();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('affiliates').update({ active: !current }).eq('id', id);
    fetchAffiliates();
  };

  const updateCommission = async (id: string, pct: number) => {
    await supabase.from('affiliates').update({ commission_pct: pct }).eq('id', id);
    toast.success('Comissão atualizada');
  };

  const updateDiscount = async (id: string, pct: number) => {
    await supabase.from('affiliates').update({ discount_pct: pct }).eq('id', id);
    toast.success('Desconto atualizado');
  };

  const deleteAffiliate = async (id: string) => {
    if (!confirm('Remover esta afiliada?')) return;
    await supabase.from('affiliates').delete().eq('id', id);
    fetchAffiliates();
    toast.success('Afiliada removida');
  };

  const handleRegisterPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal.affiliate) return;
    setPaymentLoading(true);

    const amountCents = Math.round(parseFloat(paymentForm.amount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
      toast.error('Valor inválido');
      setPaymentLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('commission_payments').insert({
      affiliate_id: paymentModal.affiliate.id,
      amount_cents: amountCents,
      notes: paymentForm.notes || null,
      created_by: user?.id ?? null,
    });

    if (error) {
      toast.error('Erro ao registrar pagamento: ' + error.message);
    } else {
      toast.success('Pagamento registrado!');
      setPaymentModal({ open: false, affiliate: null });
      setPaymentForm({ amount: '', notes: '' });
      fetchAffiliates();
    }
    setPaymentLoading(false);
  };

  const fmt = (cents: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Afiliados</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Nova afiliada
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Adicionar afiliada</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <Input placeholder="Código (ex: MARIA10)" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required />
              <Input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <div className="flex gap-2">
              <Input type="number" placeholder="Comissão %" value={form.commission_pct} onChange={e => setForm(f => ({ ...f, commission_pct: e.target.value }))} min={0} max={100} className="w-24" />
                <Input type="number" placeholder="Desconto %" value={form.discount_pct} onChange={e => setForm(f => ({ ...f, discount_pct: e.target.value }))} min={0} max={100} className="w-24" />
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-muted-foreground">Carregando…</p>
          ) : affiliates.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma afiliada cadastrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Comissão %</TableHead>
                  <TableHead>Saldo Pendente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.name}
                      {a.user_id && <span className="ml-1 text-xs text-muted-foreground">(vinculada)</span>}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{a.code}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={a.commission_pct}
                        min={0}
                        max={100}
                        className="w-20 h-8 text-sm"
                        onBlur={e => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v !== a.commission_pct) updateCommission(a.id, v);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        defaultValue={(a as any).discount_pct ?? 0}
                        min={0}
                        max={100}
                        className="w-20 h-8 text-sm"
                        onBlur={e => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v !== (a as any).discount_pct) updateDiscount(a.id, v);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className={a.pending_balance > 0 ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                          {fmt(a.pending_balance)}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          Total: {fmt(a.total_commission)} | Pago: {fmt(a.total_paid)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(a.id, a.active)}
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          a.active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {a.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Registrar pagamento"
                          onClick={() => {
                            setPaymentModal({ open: true, affiliate: a });
                            setPaymentForm({ amount: (a.pending_balance / 100).toFixed(2), notes: '' });
                          }}
                        >
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteAffiliate(a.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment Registration Modal */}
      <Dialog open={paymentModal.open} onOpenChange={(open) => { if (!open) setPaymentModal({ open: false, affiliate: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento — {paymentModal.affiliate?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegisterPayment} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Saldo pendente: <span className="font-medium">{fmt(paymentModal.affiliate?.pending_balance ?? 0)}</span>
            </div>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={paymentForm.amount}
                onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Textarea
                value={paymentForm.notes}
                onChange={e => setPaymentForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Ex: PIX, transferência bancária…"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPaymentModal({ open: false, affiliate: null })}>
                Cancelar
              </Button>
              <Button type="submit" disabled={paymentLoading}>
                {paymentLoading ? 'Registrando…' : 'Registrar Pagamento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateManager;
