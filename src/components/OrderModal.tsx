import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PosterState } from '@/data/posterData';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterState?: PosterState;
  posterRef?: React.RefObject<HTMLDivElement>;
  paperSize?: string;
}

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const OrderModal = ({ isOpen, onClose, posterState }: OrderModalProps) => {
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cpf, setCpf] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [obs, setObs] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle');
  const [couponData, setCouponData] = useState<{ id: string; name: string; commission_pct: number } | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const validateCoupon = async () => {
    if (!coupon.trim()) {
      setCouponStatus('idle');
      setCouponData(null);
      return;
    }
    setCouponStatus('checking');
    const { data, error } = await supabase
      .from('affiliates')
      .select('id, name, commission_pct')
      .eq('code', coupon.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error || !data) {
      setCouponStatus('invalid');
      setCouponData(null);
    } else {
      setCouponStatus('valid');
      setCouponData(data);
    }
  };

  const cpfDigits = cpf.replace(/\D/g, '');

  const handleSubmit = async () => {
    if (!customerName.trim()) { setError('Informe seu nome completo.'); return; }
    if (!email.includes('@')) { setError('Informe um e-mail válido.'); return; }
    if (cpfDigits.length !== 11) { setError('Informe um CPF válido (11 dígitos).'); return; }
    if (!fullAddress.trim()) { setError('Informe seu endereço completo.'); return; }
    setError('');
    setLoading(true);

    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: {
          email,
          order_type: 'digital',
          amount_cents: 2900,
          affiliate_code: couponStatus === 'valid' ? coupon.trim().toUpperCase() : null,
          customer_name: customerName.trim(),
          cpf: cpfDigits,
          full_address: fullAddress.trim(),
          address: fullAddress.trim(),
          observations: obs || null,
          poster_config: posterState || {},
          site_url: window.location.origin,
        },
      });

      if (response.error) throw new Error(response.error.message);

      const data = response.data;
      if (data?.payment_url) {
        window.location.href = data.payment_url;
        return;
      }
      setSuccess(true);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail('');
    setCustomerName('');
    setCpf('');
    setFullAddress('');
    setObs('');
    setCoupon('');
    setCouponStatus('idle');
    setCouponData(null);
    setError('');
    onClose();
  };

  return (
    <div className={`overlay${isOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <button className="m-close" onClick={handleClose}>✕ fechar</button>
        {!success ? (
          <div>
            <div className="m-title">Seu painel</div>
            <div className="m-sub">Escolha como quer receber</div>
            <div className="m-opts">
              <div className="m-opt sel">
                <div>
                  <div className="m-opt-title">PDF Digital</div>
                  <div className="m-opt-desc">Alta resolução · Baixe e imprima</div>
                </div>
                <div className="m-opt-price">R$ 29<small>entrega imediata</small></div>
              </div>
              <div
                className="m-opt"
                style={{ opacity: 0.5, cursor: 'default', position: 'relative', pointerEvents: 'none' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Em breve
                </div>
                <div>
                  <div className="m-opt-title">Quadro Impresso</div>
                  <div className="m-opt-desc">Papel premium A3 · Enviado à sua casa</div>
                </div>
                <div className="m-opt-price">R$ 89<small>+ frete · 7–10 dias</small></div>
              </div>
            </div>
            <div className="mform">
              <div className="mf">
                <label>Nome completo *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="mf">
                <label>E-mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="mf">
                <label>CPF *</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              <div className="mf">
                <label>Endereço completo *</label>
                <textarea
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                />
              </div>
              <div className="mf">
                <label>Observações (opcional)</label>
                <input
                  type="text"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex: presente, tamanho…"
                />
              </div>
              <div className="mf">
                <label>Código de indicação (opcional)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value.toUpperCase());
                      if (couponStatus !== 'idle') setCouponStatus('idle');
                    }}
                    placeholder="Ex: MARIA10"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="m-coupon-btn"
                    onClick={validateCoupon}
                    disabled={!coupon.trim() || couponStatus === 'checking'}
                  >
                    {couponStatus === 'checking' ? '...' : 'Aplicar'}
                  </button>
                </div>
                {couponStatus === 'valid' && (
                  <div className="m-coupon-msg valid">✓ Código de {couponData?.name} aplicado!</div>
                )}
                {couponStatus === 'invalid' && (
                  <div className="m-coupon-msg invalid">Código inválido</div>
                )}
              </div>
              {error && <div className="m-error">{error}</div>}
              <button className="m-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processando...' : 'Finalizar pedido →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="m-success">
            <div className="m-success-icon">✦</div>
            <h3>Pedido recebido!</h3>
            <p>Entraremos em contato em até 24h no e-mail informado para confirmar pagamento e envio do seu painel.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
