-- 1) Enum des rôles
create type if not exists public.app_role as enum ('admin', 'moderator', 'user');

-- 2) Table user_roles
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

-- 3) Activer RLS
alter table public.user_roles enable row level security;

-- 4) Politique: chaque utilisateur peut lire ses propres rôles
create policy if not exists "Users can read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- 5) Fonction utilitaire pour vérifier un rôle (SECURITY DEFINER)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;