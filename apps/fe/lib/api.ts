const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

async function handle(res: Response) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function signin(body: { email: string; password: string }): Promise<string> {
  const res = await fetch(`${BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await handle(res);
  return j.token as string;
}

export async function getCalendar(courseId: string, token: string): Promise<{ id: string; calendarId: string }> {
  const res = await fetch(`${BASE}/calendar/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}
