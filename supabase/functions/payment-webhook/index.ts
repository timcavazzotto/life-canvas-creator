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

    // TODO: Validate InfinitePay webhook signature
    // const signature = req.headers.get('x-infinitepay-signature');
    // if (!validateSignature(signature, body)) { return 401 }

    const { order_id, payment_id, status } = body;

    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ error: "Missing order_id or status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (status === "approved" || status === "paid") {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_id: payment_id || null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      if (error) {
        console.error("Update order error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update order" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Trigger PDF generation / printer notification for 'impresso' orders
      const { data: order } = await supabase
        .from("orders")
        .select("order_type")
        .eq("id", order_id)
        .single();

      if (order?.order_type === "impresso") {
        // Call send-to-printer function
        const baseUrl = Deno.env.get("SUPABASE_URL")!;
        await fetch(`${baseUrl}/functions/v1/send-to-printer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ order_id }),
        });
      }

      console.log(`Order ${order_id} marked as paid`);
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
