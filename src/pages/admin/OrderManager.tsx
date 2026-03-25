import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, Eye, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type Order = Tables<'orders'>;

const statusColors: Record<string, string> = {
  paid: 'bg-green-600',
  pending: 'bg-yellow-500',
  failed: 'bg-destructive',
};

const printStatusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  printing: 'bg-blue-500',
  shipped: 'bg-green-600',
  delivered: 'bg-green-800',
};

export default function OrderManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  // editable fields in modal
  const [editPrintStatus, setEditPrintStatus] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editObs, setEditObs] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: { id: string; print_status: string; tracking_code: string; observations: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({
          print_status: updates.print_status,
          tracking_code: updates.tracking_code,
          observations: updates.observations,
        })
        .eq('id', updates.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Pedido atualizado!');
      setSelected(null);
    },
    onError: () => toast.error('Erro ao atualizar pedido'),
  });

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (o.customer_name?.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchType = typeFilter === 'all' || o.order_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const orderTypes = [...new Set(orders.map((o) => o.order_type))];

  const openDetail = (order: Order) => {
    setSelected(order);
    setEditPrintStatus(order.print_status || 'pending');
    setEditTracking(order.tracking_code || '');
    setEditObs(order.observations || '');
  };

  const handleSave = () => {
    if (!selected) return;
    updateMutation.mutate({
      id: selected.id,
      print_status: editPrintStatus,
      tracking_code: editTracking,
      observations: editObs,
    });
  };

  const formatCents = (cents: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos tipos</SelectItem>
            {orderTypes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Afiliado</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum pedido encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => openDetail(o)}>
                    <TableCell className="whitespace-nowrap">{format(new Date(o.created_at), 'dd/MM/yy HH:mm')}</TableCell>
                    <TableCell>{o.customer_name || '—'}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{o.email}</TableCell>
                    <TableCell><Badge variant="outline">{o.order_type}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap">{formatCents(o.amount_cents)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[o.status] || 'bg-muted'}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">{o.affiliate_code || '—'}</TableCell>
                    <TableCell><Eye className="h-4 w-4 text-muted-foreground" /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-sm text-muted-foreground">{filtered.length} pedido(s)</p>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>ID: {selected?.id}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Cliente" value={selected.customer_name} />
                <Detail label="Email" value={selected.email} />
                <Detail label="CPF" value={(selected as any).cpf} />
                <Detail label="Endereço completo" value={(selected as any).full_address || selected.address} />
                <Detail label="Tipo" value={selected.order_type} />
                <Detail label="Valor" value={formatCents(selected.amount_cents)} />
                <Detail label="Status Pagamento" value={selected.status} />
                <Detail label="Pago em" value={selected.paid_at ? format(new Date(selected.paid_at), 'dd/MM/yy HH:mm') : '—'} />
                <Detail label="Provedor" value={selected.payment_provider} />
                <Detail label="Payment ID" value={selected.payment_id} />
                <Detail label="Cupom Afiliado" value={selected.affiliate_code} />
                <Detail label="Comissão" value={selected.commission_cents ? formatCents(selected.commission_cents) : '—'} />
                <Detail label="Criado em" value={format(new Date(selected.created_at), 'dd/MM/yy HH:mm')} />
              </div>

              {/* Poster Config */}
              <div>
                <p className="font-medium mb-1">Configuração do Poster</p>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selected.poster_config, null, 2)}
                </pre>
              </div>

              {/* Editable fields */}
              <div className="space-y-3 border-t pt-4">
                <p className="font-medium">Editar</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Status Impressão</label>
                    <Select value={editPrintStatus} onValueChange={setEditPrintStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="printing">Imprimindo</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Código de Rastreio</label>
                    <Input value={editTracking} onChange={(e) => setEditTracking(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Observações</label>
                  <Textarea value={editObs} onChange={(e) => setEditObs(e.target.value)} rows={3} />
                </div>
                <Button onClick={handleSave} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Salvar alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  );
}
