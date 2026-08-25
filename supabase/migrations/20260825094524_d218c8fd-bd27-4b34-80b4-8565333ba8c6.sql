
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'admin@cleandeluxee.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  benefits text[] NOT NULL DEFAULT '{}',
  image_url text,
  duration_minutes integer NOT NULL DEFAULT 120,
  is_active boolean NOT NULL DEFAULT true,
  show_in_booking boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admin manages services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AVAILABILITY
CREATE TABLE public.availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_minutes integer NOT NULL DEFAULT 60,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability TO authenticated;
GRANT ALL ON public.availability TO service_role;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads availability" ON public.availability FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manages availability" ON public.availability FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- BLOCKED DATES
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_dates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_dates TO authenticated;
GRANT ALL ON public.blocked_dates TO service_role;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads blocked dates" ON public.blocked_dates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manages blocked dates" ON public.blocked_dates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- APPOINTMENTS
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  address_street text NOT NULL,
  address_number text NOT NULL,
  address_complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  consent_accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX appointments_unique_slot ON public.appointments (appointment_date, appointment_time)
  WHERE status <> 'cancelled';
GRANT INSERT ON public.appointments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can request appointment" ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (consent_accepted = true AND status = 'pending');
CREATE POLICY "admin reads appointments" ON public.appointments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin updates appointments" ON public.appointments FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin deletes appointments" ON public.appointments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER appointments_updated BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- taken slots without exposing customer data
CREATE OR REPLACE FUNCTION public.taken_times(_date date)
RETURNS TABLE (t time) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT appointment_time FROM public.appointments
  WHERE appointment_date = _date AND status <> 'cancelled';
$$;
REVOKE ALL ON FUNCTION public.taken_times(date) FROM public;
GRANT EXECUTE ON FUNCTION public.taken_times(date) TO anon, authenticated, service_role;

-- SEED: serviços iniciais e disponibilidade padrão
INSERT INTO public.services (slug, name, description, benefits, duration_minutes, sort_order) VALUES
('limpeza-residencial','Limpeza Residencial','Limpeza completa de casas e apartamentos, com atenção a cada ambiente e acabamento cuidadoso.',
 ARRAY['Todos os cômodos higienizados','Banheiros e cozinha com atenção especial','Organização e acabamento final'],120,1),
('limpeza-comercial','Limpeza Comercial','Limpeza de escritórios, lojas, salas e espaços comerciais, mantendo o ambiente sempre apresentável.',
 ARRAY['Ambiente pronto para receber clientes','Atendimento com horário combinado','Padrão de limpeza constante'],180,2),
('limpeza-pos-obra','Limpeza Pós-Obra','Remoção de resíduos, poeira fina e sujeira pesada deixados por obras e reformas.',
 ARRAY['Remoção de poeira fina e respingos','Vidros, pisos e rejuntes','Ambiente pronto para uso'],240,3);

INSERT INTO public.availability (weekday, start_time, end_time, slot_minutes, is_active) VALUES
(1,'08:00','17:00',60,true),
(2,'08:00','17:00',60,true),
(3,'08:00','17:00',60,true),
(4,'08:00','17:00',60,true),
(5,'08:00','17:00',60,true),
(6,'08:00','12:00',60,true);
