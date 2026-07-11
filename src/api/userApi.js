const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getMe(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return res.json();
}
