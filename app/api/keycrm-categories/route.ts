export async function GET(request: Request) {
  try {
    const apiRes = await fetch("https://openapi.keycrm.app/v1/products/categories?limit=50", {
      headers: {
        Authorization: "Bearer ZjM5NjliMDA2ODZjYjAzM2JkOTNiZjQyZDg2NTg1ZmE4MjBkZDZlYQ",
        Accept: "application/json"
      }
    });
    const text = await apiRes.text();
    console.log("KeyCRM API response:", text);
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "Not JSON", raw: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(data.data), {
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