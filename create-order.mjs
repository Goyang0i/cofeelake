
export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const body = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables are missing");

      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/create_coffee_order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ order_data: body })
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Supabase order request failed:", response.status, result);

      return new Response(
        JSON.stringify({ error: "Could not save order. Please try again." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Order function error:", error);

    return new Response(
      JSON.stringify({ error: "Invalid request or server error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
