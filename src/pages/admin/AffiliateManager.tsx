import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

type Affiliate = {
  id: string;
  name: string;
  code: string;
  email: string;
  commission_pct: number;
  active: boolean;
  created_at: string;
};

const AffiliateManager = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', email: '', commission_pct: '10' });

  const fetchAffiliates = async () => {
    const { data } = await supabase
      .from('affiliates')
      .select('*')
      .order('created_at', { ascending: false });
    setAffiliates(data ?? []);
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
    });
    if (error) {
      toast.error('Erro ao adicionar: ' + error.message);
    } else {
      toast.success('Afiliada adicionada!');
      setForm({ name: '', code: '', email: '', commission_pct: '10' });
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

  const deleteAffiliate = async (id: string) => {
    if (!confirm('Remover esta afiliada?')) return;
    await supabase.from('affiliates').delete().eq('id', id);
    fetchAffiliates();
    toast.success('Afiliada removida');
  };

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
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => deleteAffiliate(a.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
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

export default AffiliateManager;
