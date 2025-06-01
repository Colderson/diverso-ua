export async function GET(request: Request) {
  try {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const apiRes = await fetch(`https://openapi.keycrm.app/v1/products?limit=50&page=${page}`, {
        headers: {
          Authorization: "Bearer ZjM5NjliMDA2ODZjYjAzM2JkOTNiZjQyZDg2NTg1ZmE4MjBkZDZlYQ",
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
      allProducts = allProducts.concat(data.data || []);
      hasMore = data.data && data.data.length === 50;
      page++;
    }

    return new Response(JSON.stringify(allProducts), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || e.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}