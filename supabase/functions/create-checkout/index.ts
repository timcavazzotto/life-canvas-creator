import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    const {
      email,
      order_type,
      amount_cents,
      affiliate_code,
      customer_name,
      address,
      observations,
      poster_config,
    } = body;

    // Validate
    if (!email || !order_type || !amount_cents) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check affiliate code
    let affiliate_id = null;
    let commission_cents = 0;
    if (affiliate_code) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id, commission_pct")
        .eq("code", affiliate_code)
        .eq("active", true)
        .maybeSingle();

      if (affiliate) {
        affiliate_id = affiliate.id;
        commission_cents = Math.round(
          (amount_cents * affiliate.commission_pct) / 100
        );
      }
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email,
        order_type,
        amount_cents,
        affiliate_code: affiliate_code || null,
        affiliate_id,
        commission_cents,
        customer_name,
        address,
        observations,
        poster_config,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // InfinitePay checkout
    const infinitePayKey = Deno.env.get("INFINITEPAY_API_KEY");
    if (infinitePayKey) {
      // TODO: Call InfinitePay API to create checkout
      // const checkoutResponse = await fetch('https://api.infinitepay.io/v2/checkout', { ... });
      // const checkoutData = await checkoutResponse.json();
      // Update order with payment_url and payment_id
      // return Response with payment_url for redirect

      return new Response(
        JSON.stringify({
          order_id: order.id,
          message: "InfinitePay integration ready - configure API endpoint",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // No payment key configured - return order info
    return new Response(
      JSON.stringify({
        order_id: order.id,
        message: "Order created. Payment provider not configured yet.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
