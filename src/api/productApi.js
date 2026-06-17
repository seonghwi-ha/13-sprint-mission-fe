const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "요청에 실패했습니다.");
  }

  return data;
}

export async function getProducts({ page = 1, limit = 10, keyword = "", sort = "recent" } = {}) {
  const params = new URLSearchParams({ page, limit, sort });
  if (keyword) params.append("keyword", keyword);
  return request(`/products?${params}`);
}

export async function getProduct(id) {
  return request(`/products/${id}`);
}

export async function createProduct({ name, description, price, tags }) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify({ name, description, price, tags }),
  });
}

export async function updateProduct(id, data) {
  return request(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}
