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

    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    // InfinitePay webhook fields
    const {
      order_nsu,
      transaction_nsu,
      invoice_slug,
      amount,
      paid_amount,
      capture_method,
      status,
      // Fallback for older format
      order_id: legacyOrderId,
      payment_id: legacyPaymentId,
    } = body;

    const orderId = order_nsu || legacyOrderId;
    const paymentId = transaction_nsu || legacyPaymentId;
    const paymentStatus = status || (paid_amount ? "paid" : null);

    if (!orderId) {
      console.error("Missing order identifier in webhook");
      return new Response(
        JSON.stringify({ error: "Missing order identifier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Consider payment successful if paid_amount exists or status indicates success
    const isPaid =
      paymentStatus === "approved" ||
      paymentStatus === "paid" ||
      (paid_amount && paid_amount > 0);

    if (isPaid) {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: paymentId || null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        console.error("Update order error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Trigger printer for 'impresso' orders
      const { data: order } = await supabase
        .from("orders")
        .select("order_type, pdf_storage_path")
        .eq("id", orderId)
        .single();

      const baseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      if (order?.order_type === "impresso") {
        await fetch(`${baseUrl}/functions/v1/send-to-printer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        });
      }

      if (order?.order_type === "digital") {
        await fetch(`${baseUrl}/functions/v1/generate-pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        });
      }

      console.log(`Order ${orderId} marked as paid`);
    } else {
      console.log(`Webhook for order ${orderId} with status: ${paymentStatus} - no action taken`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
