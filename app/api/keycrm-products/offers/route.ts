export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  let url = "https://openapi.keycrm.app/v1/offers";
  if (productId) {
    url += `?filter[product_id]=${productId}`;
  }

  try {
    const apiRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.KEYCRM_API_KEY}`,
        Accept: "application/json"
      }
    });
    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "Not JSON", raw: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    // Гарантуємо, що повертаємо саме масив offers у полі data
    return new Response(JSON.stringify({ data: data.data || [] }), {
      status: apiRes.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || e.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}