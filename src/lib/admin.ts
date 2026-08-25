import { supabase } from "@/integrations/supabase/client";

export type Appointment = {
  id: string;
  service_id: string | null;
  service_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  address_street: string;
  address_number: string;
  address_complement: string | null;
  neighborhood: string;
  city: string;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

export async function fetchAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function updateAppointmentStatus(id: string, status: Appointment["status"]) {
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function fetchAllServices() {
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function isCurrentUserAdmin() {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) return false;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin");
  return (data?.length ?? 0) > 0;
}
