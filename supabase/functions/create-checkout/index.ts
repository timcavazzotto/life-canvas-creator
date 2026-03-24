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
      cpf,
      full_address,
      pdf_storage_path,
    } = body;

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
        cpf: cpf || null,
        full_address: full_address || null,
        pdf_storage_path: pdf_storage_path || null,
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
    const infinitePayHandle = Deno.env.get("INFINITEPAY_HANDLE");
    if (!infinitePayHandle) {
      return new Response(
        JSON.stringify({
          order_id: order.id,
          message: "Payment provider not configured yet.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const siteUrl = body.site_url || "https://id-preview--89088344-711b-4e4e-95ac-0da1a6185711.lovable.app";

    const description = order_type === "digital"
      ? "Painel Projeto 80+ (PDF Digital)"
      : "Painel Projeto 80+ (Quadro Impresso)";

    const checkoutPayload = {
      handle: infinitePayHandle,
      items: [
        {
          quantity: 1,
          price: amount_cents,
          description,
        },
      ],
      order_nsu: order.id,
      redirect_url: `${siteUrl}/obrigado?order_id=${order.id}`,
      webhook_url: `${supabaseUrl}/functions/v1/payment-webhook`,
      customer: {
        name: customer_name || "Cliente",
        email,
      },
    };

    console.log("Creating InfinitePay checkout:", JSON.stringify(checkoutPayload));

    const checkoutRes = await fetch(
      "https://api.infinitepay.io/invoices/public/checkout/links",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutPayload),
      }
    );

    const checkoutData = await checkoutRes.json();
    console.log("InfinitePay response:", JSON.stringify(checkoutData));

    const paymentUrl = checkoutData.checkout_url || checkoutData.url;
    if (!checkoutRes.ok || !paymentUrl) {
      console.error("InfinitePay error:", checkoutData);
      return new Response(
        JSON.stringify({ error: "Failed to create payment link", details: checkoutData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save payment URL on order
    await supabase
      .from("orders")
      .update({ payment_url: paymentUrl })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        payment_url: paymentUrl,
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
