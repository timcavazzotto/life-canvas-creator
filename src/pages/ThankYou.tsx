import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import '../App.css';

type OrderStatus = {
  status: string;
  order_type: string;
  pdf_storage_path: string | null;
};

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [polling, setPolling] = useState(true);
  const [error, setError] = useState('');

  const checkStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-order-status', {
        body: { order_id: orderId },
      });
      if (fnError) throw fnError;
      setOrderStatus(data);
      if (data.status === 'paid' && (data.order_type !== 'digital' || data.pdf_storage_path)) {
        setPolling(false);
      }
    } catch (err) {
      console.error('Status check error:', err);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      setError('Pedido não encontrado.');
      return;
    }
    checkStatus();
    const interval = setInterval(() => {
      if (polling) checkStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, polling, checkStatus]);

  const downloadPdf = async () => {
    if (!orderStatus?.pdf_storage_path) return;
    const { data } = await supabase.storage
      .from('order-pdfs')
      .createSignedUrl(orderStatus.pdf_storage_path, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>{error}</h2>
        </div>
      </div>
    );
  }

  const isPaid = orderStatus?.status === 'paid';
  const isDigital = orderStatus?.order_type === 'digital';
  const isImpresso = orderStatus?.order_type === 'impresso';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ textAlign: 'center', padding: 40, maxWidth: 500 }}>
        {!isPaid ? (
          <>
            <div className="thankyou-spinner" />
            <h2 style={{ fontSize: 24, marginBottom: 8, marginTop: 24 }}>Processando pagamento…</h2>
            <p style={{ color: '#888', fontSize: 14 }}>
              Aguarde enquanto confirmamos seu pagamento. Isso pode levar alguns segundos.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✦</div>
            <h2 style={{ fontSize: 28, marginBottom: 8 }}>Pagamento confirmado!</h2>
            {isDigital && (
              <>
                <p style={{ color: '#aaa', fontSize: 14, marginBottom: 24 }}>
                  Seu painel está pronto para download.
                </p>
                {orderStatus?.pdf_storage_path ? (
                  <button
                    onClick={downloadPdf}
                    style={{
                      background: '#fff',
                      color: '#000',
                      border: 'none',
                      padding: '14px 32px',
                      fontSize: 16,
                      fontWeight: 600,
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Baixar PDF ↓
                  </button>
                ) : (
                  <p style={{ color: '#888', fontSize: 13 }}>
                    O PDF está sendo gerado. Você receberá o link por e-mail em breve.
                  </p>
                )}
              </>
            )}
            {isImpresso && (
              <p style={{ color: '#aaa', fontSize: 14 }}>
                Seu quadro será produzido e enviado em até 7–10 dias úteis. Você receberá o código de rastreio por e-mail.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
