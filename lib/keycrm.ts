const API_URL = "https://api.keycrm.app/v1";
const API_KEY = process.env.KEYCRM_API_KEY!;

async function keycrmFetch(endpoint: string, params?: Record<string, any>) {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { "Authorization": `Bearer ${API_KEY}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function keycrmFetchLocal(endpoint: string, params?: Record<string, any>) {
  const url = new URL(`/api/${endpoint}`, window.location.origin);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCategories() {
 
  const all = await keycrmFetchLocal("keycrm-categories", { limit: 50 });
  const parent = all.data.find((c: any) => c.name === "Шкіряні чохли на ID-паспорти");
  if (!parent) return [];
  const children = all.data.filter((c: any) => c.parent_id === parent.id &&
    ["Кіно та серіали", "Ігри", "Аніме", "Мультфільми"].includes(c.name));
  return { parent, children };
}

export async function getProductsByCategory(categoryId: number) {
  const res = await keycrmFetch("/products", { [`filter[category_id]`]: categoryId, limit: 50 });
  console.log("KeyCRM products response:", res);
  return res.data;
}