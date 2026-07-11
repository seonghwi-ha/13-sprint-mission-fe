const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "요청에 실패했습니다.");
  }

  return data;
}

export async function signIn({ email, password }) {
  return request("/auth/signIn", { email, password });
}

export async function signUp({
  email,
  password,
  nickname,
  passwordConfirmation,
}) {
  return request("/auth/signUp", {
    email,
    password,
    nickname,
    passwordConfirmation,
  });
}
