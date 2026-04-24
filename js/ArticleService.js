const BASE_URL = "https://panda-market-api-crud.vercel.app";

export function getArticleList({ page = 1, pageSize = 10, keyword = "" } = {}) {
  return fetch(
    `${BASE_URL}/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
  )
    .then((res) => {
      if (!res.ok) {
        console.error(`에러 발생: ${res.status} ${res.statusText}`);
        return;
      }
      return res.json();
    })
    .catch((err) => console.error("getArticleList 오류:", err));
}

export function getArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`)
    .then((res) => {
      if (!res.ok) {
        console.error(`에러 발생: ${res.status} ${res.statusText}`);
        return;
      }
      return res.json();
    })
    .catch((err) => console.error("getArticle 오류:", err));
}

export function createArticle({ title, content, image }) {
  return fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`에러 발생: ${res.status} ${res.statusText}`);
        return;
      }
      return res.json();
    })
    .catch((err) => console.error("createArticle 오류:", err));
}

export function patchArticle(id, data) {
  return fetch(`${BASE_URL}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`에러 발생: ${res.status} ${res.statusText}`);
        return;
      }
      return res.json();
    })
    .catch((err) => console.error("patchArticle 오류:", err));
}

export function deleteArticle(id) {
  return fetch(`${BASE_URL}/articles/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`에러 발생: ${res.status} ${res.statusText}`);
        return;
      }
      return res.json();
    })
    .catch((err) => console.error("deleteArticle 오류:", err));
}
