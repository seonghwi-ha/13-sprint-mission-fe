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

export async function getArticles({ page = 1, limit = 10, keyword = "", sort = "recent" } = {}) {
  const params = new URLSearchParams({ page, limit, sort });
  if (keyword) params.append("keyword", keyword);
  return request(`/articles?${params}`);
}

export async function getBestArticles() {
  return request("/articles?page=1&limit=3&sort=recent");
}

export async function getArticle(id) {
  return request(`/articles/${id}`);
}

export async function createArticle({ title, content }) {
  return request("/articles", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
}

export async function updateArticle(id, { title, content }) {
  return request(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title, content }),
  });
}

export async function deleteArticle(id) {
  return request(`/articles/${id}`, { method: "DELETE" });
}

export async function getComments(articleId, { cursor, limit = 10 } = {}) {
  const params = new URLSearchParams({ limit });
  if (cursor) params.append("cursor", cursor);
  return request(`/articles/${articleId}/comments?${params}`);
}

export async function createComment(articleId, content) {
  return request(`/articles/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function updateComment(commentId, content) {
  return request(`/comments/articles/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId) {
  return request(`/comments/articles/${commentId}`, { method: "DELETE" });
}
