import { useState, useCallback } from 'react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const [selOption, setSelOption] = useState<'digital' | 'impresso'>('digital');
  const [email, setEmail] = useState('');
  const [addr, setAddr] = useState('');
  const [obs, setObs] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!email.includes('@')) return;
    setLoading(true);
    
    // TODO: InfinitePay checkout integration
    // For now, show success
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail('');
    setAddr('');
    setObs('');
    setSelOption('digital');
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
              <div
                className={`m-opt${selOption === 'digital' ? ' sel' : ''}`}
                onClick={() => setSelOption('digital')}
              >
                <div>
                  <div className="m-opt-title">PDF Digital</div>
                  <div className="m-opt-desc">Alta resolução · Baixe e imprima</div>
                </div>
                <div className="m-opt-price">R$ 29<small>entrega imediata</small></div>
              </div>
              <div
                className={`m-opt${selOption === 'impresso' ? ' sel' : ''}`}
                onClick={() => setSelOption('impresso')}
              >
                <div>
                  <div className="m-opt-title">Quadro Impresso</div>
                  <div className="m-opt-desc">Papel premium A3 · Enviado à sua casa</div>
                </div>
                <div className="m-opt-price">R$ 89<small>+ frete · 7–10 dias</small></div>
              </div>
            </div>
            <div className="mform">
              <div className="mf">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              {selOption === 'impresso' && (
                <div className="mf">
                  <label>Endereço completo</label>
                  <textarea
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                    placeholder="Rua, número, bairro, cidade, CEP"
                  />
                </div>
              )}
              <div className="mf">
                <label>Observações (opcional)</label>
                <input
                  type="text"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Ex: presente, tamanho…"
                />
              </div>
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
