-- Initial Swasthloop identity, doctor discovery, appointment, and notification schema.
-- Patient records are intentionally limited to account identity and appointment coordination.

create type public.account_role as enum ('patient', 'doctor', 'admin');
create type public.doctor_application_status as enum ('pending', 'approved', 'rejected');
create type public.appointment_status as enum (
  'pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'no_show'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
  role public.account_role not null default 'patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index specialties_name_ci_idx on public.specialties (lower(name));

create table public.doctor_verification_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  specialty_id uuid not null references public.specialties (id) on delete restrict,
  registration_authority text not null check (char_length(btrim(registration_authority)) between 2 and 200),
  registration_number text not null check (char_length(btrim(registration_number)) between 2 and 100),
  qualifications text not null check (char_length(btrim(qualifications)) between 2 and 2000),
  years_experience smallint not null check (years_experience between 0 and 70),
  status public.doctor_application_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  review_note text check (review_note is null or char_length(review_note) <= 1000),
  check (
    (status = 'pending' and reviewed_at is null and reviewed_by is null)
    or (status <> 'pending' and reviewed_at is not null and reviewed_by is not null)
  )
);
create index doctor_applications_applicant_idx
  on public.doctor_verification_applications (applicant_id, submitted_at desc);
create index doctor_applications_review_queue_idx
  on public.doctor_verification_applications (submitted_at)
  where status = 'pending';
create unique index doctor_applications_one_pending_per_user_idx
  on public.doctor_verification_applications (applicant_id)
  where status = 'pending';

create table public.doctor_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  specialty_id uuid not null references public.specialties (id) on delete restrict,
  qualifications text not null check (char_length(btrim(qualifications)) between 2 and 2000),
  years_experience smallint not null check (years_experience between 0 and 70),
  biography text check (biography is null or char_length(biography) <= 1600),
  is_verified boolean not null default false,
  verified_at timestamptz,
  verified_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (is_verified and verified_at is not null and verified_by is not null)
    or (not is_verified and verified_at is null and verified_by is null)
  )
);
create index doctor_profiles_specialty_verified_idx
  on public.doctor_profiles (specialty_id, user_id)
  where is_verified;

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 180),
  address_line text not null check (char_length(btrim(address_line)) between 5 and 300),
  locality text check (locality is null or char_length(locality) <= 120),
  city text not null default 'Gorakhpur' check (char_length(btrim(city)) between 2 and 120),
  state text not null default 'Uttar Pradesh' check (char_length(btrim(state)) between 2 and 120),
  postal_code text check (postal_code is null or postal_code ~ '^[0-9]{6}$'),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clinics_active_city_idx on public.clinics (city) where is_active;

create table public.doctor_clinics (
  doctor_user_id uuid not null references public.doctor_profiles (user_id) on delete cascade,
  clinic_id uuid not null references public.clinics (id) on delete restrict,
  is_primary boolean not null default false,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (doctor_user_id, clinic_id)
);
create index doctor_clinics_clinic_approved_idx
  on public.doctor_clinics (clinic_id, doctor_user_id)
  where is_approved;
create unique index doctor_clinics_one_primary_idx
  on public.doctor_clinics (doctor_user_id)
  where is_primary and is_approved;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_user_id uuid not null references public.profiles (id) on delete restrict,
  doctor_user_id uuid not null references public.doctor_profiles (user_id) on delete restrict,
  requested_for timestamptz not null,
  status public.appointment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (patient_user_id <> doctor_user_id)
);
create index appointments_patient_date_idx
  on public.appointments (patient_user_id, requested_for desc);
create index appointments_doctor_date_idx
  on public.appointments (doctor_user_id, requested_for desc);
create index appointments_status_date_idx
  on public.appointments (status, requested_for);

create table public.appointment_status_history (
  id bigint generated always as identity primary key,
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  previous_status public.appointment_status,
  new_status public.appointment_status not null,
  changed_by uuid references public.profiles (id) on delete set null,
  changed_at timestamptz not null default now()
);
create index appointment_history_appointment_time_idx
  on public.appointment_status_history (appointment_id, changed_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references public.profiles (id) on delete cascade,
  notification_type text not null check (
    notification_type in ('account', 'doctor_application', 'appointment')
  ),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_recipient_unread_idx
  on public.notifications (recipient_user_id, created_at desc)
  where read_at is null;

-- This SECURITY DEFINER helper can only return the caller's own database role.
create function public.current_user_role()
returns public.account_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles as p
  where p.id = (select auth.uid())
$$;

revoke all on function public.current_user_role() from public, anon;
grant execute on function public.current_user_role() to authenticated;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
create trigger doctor_profiles_set_updated_at
before update on public.doctor_profiles
for each row execute function public.set_updated_at();
create trigger clinics_set_updated_at
before update on public.clinics
for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

-- A new Auth identity always becomes a patient. Client-supplied role metadata is ignored.
create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_full_name text;
begin
  new_full_name := nullif(btrim(new.raw_user_meta_data ->> 'full_name'), '');
  if new_full_name is null or char_length(new_full_name) > 120 then
    raise exception 'A valid full name is required to create an account';
  end if;

  insert into public.profiles (id, full_name, role)
  values (new.id, new_full_name, 'patient');
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Admin review is the only application path that can promote an account or verify a doctor.
create function public.review_doctor_application(
  application_id uuid,
  decision public.doctor_application_status,
  note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  application_record public.doctor_verification_applications%rowtype;
begin
  if public.current_user_role() is distinct from 'admin'::public.account_role then
    raise exception 'Administrator access is required' using errcode = '42501';
  end if;
  if decision not in ('approved'::public.doctor_application_status, 'rejected'::public.doctor_application_status) then
    raise exception 'Decision must be approved or rejected' using errcode = '22023';
  end if;
  if note is not null and char_length(note) > 1000 then
    raise exception 'Review note is too long' using errcode = '22023';
  end if;

  update public.doctor_verification_applications as application
  set status = decision,
      reviewed_at = now(),
      reviewed_by = (select auth.uid()),
      review_note = nullif(btrim(note), '')
  where application.id = application_id
    and application.status = 'pending'
  returning application.* into application_record;

  if not found then
    raise exception 'Pending application was not found' using errcode = 'P0002';
  end if;

  if decision = 'approved'::public.doctor_application_status then
    update public.profiles
    set role = 'doctor'::public.account_role
    where id = application_record.applicant_id;

    insert into public.doctor_profiles (
      user_id, specialty_id, qualifications, years_experience,
      is_verified, verified_at, verified_by
    ) values (
      application_record.applicant_id,
      application_record.specialty_id,
      application_record.qualifications,
      application_record.years_experience,
      true,
      now(),
      (select auth.uid())
    )
    on conflict (user_id) do update set
      specialty_id = excluded.specialty_id,
      qualifications = excluded.qualifications,
      years_experience = excluded.years_experience,
      is_verified = true,
      verified_at = now(),
      verified_by = (select auth.uid());
  end if;

  insert into public.notifications (
    recipient_user_id, notification_type, title, message
  ) values (
    application_record.applicant_id,
    'doctor_application',
    'Doctor application reviewed',
    case when decision = 'approved'::public.doctor_application_status
      then 'Your doctor application has been approved.'
      else 'Your doctor application was not approved. Sign in to review the outcome.'
    end
  );
end;
$$;

revoke all on function public.review_doctor_application(uuid, public.doctor_application_status, text) from public, anon;
grant execute on function public.review_doctor_application(uuid, public.doctor_application_status, text) to authenticated;

create function public.record_appointment_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.appointment_status_history (
      appointment_id, previous_status, new_status, changed_by
    ) values (new.id, null, new.status, (select auth.uid()));
  elsif new.status is distinct from old.status then
    insert into public.appointment_status_history (
      appointment_id, previous_status, new_status, changed_by
    ) values (new.id, old.status, new.status, (select auth.uid()));
  end if;
  return new;
end;
$$;

revoke all on function public.record_appointment_status() from public, anon, authenticated;

create trigger appointments_record_status
after insert or update of status on public.appointments
for each row execute function public.record_appointment_status();

-- Revoke Supabase's default Data API grants before adding least-privilege grants.
revoke all on table
  public.profiles,
  public.specialties,
  public.doctor_verification_applications,
  public.doctor_profiles,
  public.clinics,
  public.doctor_clinics,
  public.appointments,
  public.appointment_status_history,
  public.notifications
from anon, authenticated;

grant select (id, full_name, role, created_at, updated_at) on public.profiles to anon, authenticated;
grant update (full_name) on public.profiles to authenticated;
grant select on public.specialties to anon, authenticated;
grant insert, update, delete on public.specialties to authenticated;
grant select on public.doctor_verification_applications to authenticated;
grant insert (
  applicant_id, specialty_id, registration_authority, registration_number,
  qualifications, years_experience
) on public.doctor_verification_applications to authenticated;
grant select (
  user_id, specialty_id, qualifications, years_experience, biography,
  is_verified, verified_at, created_at, updated_at
) on public.doctor_profiles to anon, authenticated;
grant select on public.clinics to anon, authenticated;
grant insert, update, delete on public.clinics to authenticated;
grant select on public.doctor_clinics to anon, authenticated;
grant insert (doctor_user_id, clinic_id, is_primary) on public.doctor_clinics to authenticated;
grant delete on public.doctor_clinics to authenticated;
grant select on public.appointments to authenticated;
grant select (
  id, appointment_id, previous_status, new_status, changed_at
) on public.appointment_status_history to authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

alter table public.profiles enable row level security;
alter table public.specialties enable row level security;
alter table public.doctor_verification_applications enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.clinics enable row level security;
alter table public.doctor_clinics enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_history enable row level security;
alter table public.notifications enable row level security;

create policy profiles_select_own
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy profiles_select_approved_doctors
on public.profiles for select to anon, authenticated
using (
  role = 'doctor'::public.account_role
  and exists (
    select 1 from public.doctor_profiles as doctor
    where doctor.user_id = profiles.id and doctor.is_verified
  )
);
create policy profiles_select_admin
on public.profiles for select to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role);

create policy specialties_select_active
on public.specialties for select to anon, authenticated
using (is_active);
create policy specialties_admin_manage
on public.specialties for all to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role)
with check ((select public.current_user_role()) = 'admin'::public.account_role);

create policy doctor_applications_select_own
on public.doctor_verification_applications for select to authenticated
using ((select auth.uid()) = applicant_id);
create policy doctor_applications_submit_own
on public.doctor_verification_applications for insert to authenticated
with check (
  applicant_id = (select auth.uid())
  and status = 'pending'::public.doctor_application_status
  and reviewed_at is null
  and reviewed_by is null
  and (select public.current_user_role()) = 'patient'::public.account_role
  and not exists (
    select 1 from public.doctor_profiles as doctor
    where doctor.user_id = (select auth.uid())
  )
);
create policy doctor_applications_admin_read
on public.doctor_verification_applications for select to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role);

create policy doctor_profiles_select_verified
on public.doctor_profiles for select to anon, authenticated
using (is_verified);
create policy doctor_profiles_select_own
on public.doctor_profiles for select to authenticated
using ((select auth.uid()) = user_id);
create policy doctor_profiles_admin_read
on public.doctor_profiles for select to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role);

create policy clinics_select_active
on public.clinics for select to anon, authenticated
using (is_active);
create policy clinics_admin_manage
on public.clinics for all to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role)
with check ((select public.current_user_role()) = 'admin'::public.account_role);

create policy doctor_clinics_select_approved
on public.doctor_clinics for select to anon, authenticated
using (
  is_approved
  and exists (
    select 1 from public.doctor_profiles as doctor
    where doctor.user_id = doctor_clinics.doctor_user_id and doctor.is_verified
  )
  and exists (
    select 1 from public.clinics as clinic
    where clinic.id = doctor_clinics.clinic_id and clinic.is_active
  )
);
create policy doctor_clinics_select_own
on public.doctor_clinics for select to authenticated
using ((select auth.uid()) = doctor_user_id);
create policy doctor_clinics_submit_own_pending
on public.doctor_clinics for insert to authenticated
with check (
  doctor_user_id = (select auth.uid())
  and not is_approved
  and exists (
    select 1 from public.doctor_profiles as doctor
    where doctor.user_id = (select auth.uid()) and doctor.is_verified
  )
  and exists (
    select 1 from public.clinics as clinic
    where clinic.id = doctor_clinics.clinic_id and clinic.is_active
  )
);
create policy doctor_clinics_delete_own_pending
on public.doctor_clinics for delete to authenticated
using ((select auth.uid()) = doctor_user_id and not is_approved);
create policy doctor_clinics_admin_manage
on public.doctor_clinics for all to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role)
with check ((select public.current_user_role()) = 'admin'::public.account_role);

create policy appointments_select_patient
on public.appointments for select to authenticated
using ((select auth.uid()) = patient_user_id);
create policy appointments_select_assigned_doctor
on public.appointments for select to authenticated
using ((select auth.uid()) = doctor_user_id);
create policy appointments_admin_read
on public.appointments for select to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role);

create policy appointment_history_select_participant
on public.appointment_status_history for select to authenticated
using (
  exists (
    select 1 from public.appointments as appointment
    where appointment.id = appointment_status_history.appointment_id
      and (
        appointment.patient_user_id = (select auth.uid())
        or appointment.doctor_user_id = (select auth.uid())
        or (select public.current_user_role()) = 'admin'::public.account_role
      )
  )
);

create policy notifications_select_recipient
on public.notifications for select to authenticated
using ((select auth.uid()) = recipient_user_id);
create policy notifications_select_admin
on public.notifications for select to authenticated
using ((select public.current_user_role()) = 'admin'::public.account_role);
create policy notifications_mark_own_read
on public.notifications for update to authenticated
using ((select auth.uid()) = recipient_user_id)
with check ((select auth.uid()) = recipient_user_id);

comment on table public.appointments is
  'Schema only in this milestone. Client insert and update privileges are intentionally withheld until the booking workflow is implemented.';
comment on table public.doctor_verification_applications is
  'Private application data; applicant and authorized administrators only. Verification evidence uploads are not supported in this prototype.';
