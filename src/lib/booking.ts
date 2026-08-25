import { supabase } from "@/integrations/supabase/client";
import { hhmm, toISODate } from "./site";

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  benefits: string[];
  image_url: string | null;
  duration_minutes: number;
  is_active: boolean;
  show_in_booking: boolean;
  sort_order: number;
};

export async function fetchPublicServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

export async function fetchAvailability() {
  const { data, error } = await supabase.from("availability").select("*").order("start_time");
  if (error) throw error;
  return data ?? [];
}

export async function fetchBlockedDates() {
  const { data, error } = await supabase.from("blocked_dates").select("*").order("blocked_date");
  if (error) throw error;
  return data ?? [];
}

function buildSlots(start: string, end: string, step: number) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const out: string[] = [];
  let cur = (sh ?? 0) * 60 + (sm ?? 0);
  const last = (eh ?? 0) * 60 + (em ?? 0);
  while (cur < last) {
    out.push(`${String(Math.floor(cur / 60)).padStart(2, "0")}:${String(cur % 60).padStart(2, "0")}`);
    cur += step > 0 ? step : 60;
  }
  return out;
}

export type SlotInfo = { time: string; available: boolean };

export async function fetchSlotsForDate(isoDate: string): Promise<SlotInfo[]> {
  const date = new Date(`${isoDate}T12:00:00`);
  const weekday = date.getDay();

  const [{ data: avail }, { data: blocked }, { data: taken }] = await Promise.all([
    supabase.from("availability").select("*").eq("weekday", weekday).eq("is_active", true),
    supabase.from("blocked_dates").select("blocked_date").eq("blocked_date", isoDate),
    supabase.rpc("taken_times", { _date: isoDate }),
  ]);

  if (blocked && blocked.length > 0) return [];

  const takenSet = new Set(
    ((taken ?? []) as Array<{ t: string } | string>).map((row) =>
      typeof row === "string" ? hhmm(row) : hhmm(row.t),
    ),
  );

  const slots = new Set<string>();
  for (const row of avail ?? []) {
    for (const s of buildSlots(hhmm(row.start_time), hhmm(row.end_time), row.slot_minutes)) {
      slots.add(s);
    }
  }

  const now = new Date();
  const isToday = isoDate === toISODate(now);

  return [...slots]
    .sort()
    .filter((t) => {
      if (!isToday) return true;
      const [h, m] = t.split(":").map(Number);
      const slotDate = new Date(now);
      slotDate.setHours(h ?? 0, m ?? 0, 0, 0);
      return slotDate.getTime() > now.getTime();
    })
    .map((t) => ({ time: t, available: !takenSet.has(t) }));
}
