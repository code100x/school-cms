"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "../../../../components/RequireAuth";
import { getCalendar } from "../../../../lib/api";

export default function CalendarPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const r = useRouter();
  const [loading, setLoading] = useState(true);
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return r.replace("/signin");
        const res = await getCalendar(courseId, token);
        const id = res.calendarId;
        const url = id?.startsWith("http") ? id : `https://petal-estimate-4e9.notion.site/${id}`;
        setCalendarUrl(url);
      } catch (e: any) {
        setErr(e?.message || "Failed to load calendar");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, r]);

  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Course Calendar</h1>
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {err && <div className="text-sm text-red-600">{err}</div>}
        {calendarUrl && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <iframe
              src={calendarUrl}
              className="h-[75vh] w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
