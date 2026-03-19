import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
      return new Response(
        JSON.stringify({ error: "Missing order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch order details
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update print status
    await supabase
      .from("orders")
      .update({ print_status: "sent_to_printer" })
      .eq("id", order_id);

    // TODO: When the print partner defines their communication channel,
    // implement one of the following:
    //
    // Option A: API call
    // const response = await fetch('https://printer-api.com/orders', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${Deno.env.get('PRINTER_API_KEY')}` },
    //   body: JSON.stringify({ pdf_url: order.pdf_storage_path, address: order.address, ... })
    // });
    //
    // Option B: Email via SMTP/Resend/SendGrid
    // await sendEmail({ to: 'grafica@example.com', subject: `Pedido ${order.id}`, ... });
    //
    // Option C: Webhook
    // await fetch('https://printer-webhook.com/new-order', { method: 'POST', body: ... });

    console.log(`Order ${order_id} ready for printer. Data:`, {
      customer_name: order.customer_name,
      address: order.address,
      poster_config: order.poster_config,
      pdf_path: order.pdf_storage_path,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order prepared for printer (integration pending)",
        order_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Send to printer error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
