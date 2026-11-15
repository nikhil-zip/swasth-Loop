begin;

select plan(25);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'doctor_verification_applications', 'doctor application table exists');
select has_table('public', 'doctor_profiles', 'doctor profile table exists');
select has_table('public', 'specialties', 'specialties table exists');
select has_table('public', 'clinics', 'clinics table exists');
select has_table('public', 'doctor_clinics', 'doctor-clinic relationship table exists');
select has_table('public', 'appointments', 'appointments table exists');
select has_table('public', 'appointment_status_history', 'appointment history table exists');
select has_table('public', 'notifications', 'notifications table exists');
select ok(
  (select bool_and(relrowsecurity)
   from pg_class
   where oid = any (array[
     'public.profiles'::regclass,
     'public.doctor_verification_applications'::regclass,
     'public.doctor_profiles'::regclass,
     'public.specialties'::regclass,
     'public.clinics'::regclass,
     'public.doctor_clinics'::regclass,
     'public.appointments'::regclass,
     'public.appointment_status_history'::regclass,
     'public.notifications'::regclass
   ])),
  'RLS is enabled on every public table'
);

-- These are synthetic local-only identities. The Auth trigger creates patient profiles.
insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'patient-a@test.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Test Patient A","role":"admin"}', now(), now()),
  ('00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'patient-b@test.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Test Patient B"}', now(), now()),
  ('00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'applicant@test.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Test Doctor Applicant"}', now(), now()),
  ('00000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'admin@test.invalid', '', now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Test Administrator"}', now(), now());

-- Role assignment is an out-of-band administrative bootstrap in tests and production setup.
update public.profiles
set role = 'admin'
where id = '00000000-0000-4000-8000-000000000004';

insert into public.specialties (id, name, slug, is_active)
values ('10000000-0000-4000-8000-000000000001', 'Test Specialty', 'test-specialty', true);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

select is(
  (select count(*)::integer from public.profiles),
  1,
  'a patient can read only their own profile'
);
select is(
  (select role::text from public.profiles where id = auth.uid()),
  'patient',
  'client-supplied role metadata cannot assign admin privileges'
);
select throws_ok(
  $$update public.profiles set role = 'admin' where id = auth.uid()$$,
  '42501', null,
  'patients cannot promote their own account'
);
select lives_ok(
  $$insert into public.doctor_verification_applications
    (applicant_id, specialty_id, registration_authority, registration_number, qualifications, years_experience)
    values ('00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Test Council', 'TEST-001', 'Test qualification', 2)$$,
  'a patient can submit their own doctor application'
);
select throws_ok(
  $$insert into public.doctor_verification_applications
    (applicant_id, specialty_id, registration_authority, registration_number, qualifications, years_experience)
    values ('00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Test Council', 'TEST-002', 'Test qualification', 2)$$,
  '42501', null,
  'a patient cannot submit an application for another user'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select is(
  (select count(*)::integer from public.doctor_verification_applications),
  0,
  'applicants cannot read another user’s application'
);
select throws_ok(
  $$select public.review_doctor_application(
    (select id from public.doctor_verification_applications limit 1), 'approved', null
  )$$,
  '42501', null,
  'a patient cannot approve an application'
);
select throws_ok(
  $$insert into public.appointments (patient_user_id, doctor_user_id, requested_for)
    values ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', now() + interval '1 day')$$,
  '42501', null,
  'appointment writes are not exposed before the booking milestone'
);

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select is(
  (select count(*)::integer from public.doctor_verification_applications where status = 'pending'),
  1,
  'administrators can read the pending application queue'
);
select lives_ok(
  $$select public.review_doctor_application(
    (select id from public.doctor_verification_applications where applicant_id = '00000000-0000-4000-8000-000000000001'),
    'approved', null
  )$$,
  'an administrator can approve a pending application'
);
select is(
  (select role::text from public.profiles where id = '00000000-0000-4000-8000-000000000001'),
  'doctor',
  'approval promotes the applicant to doctor'
);
select ok(
  (select is_verified from public.doctor_profiles where user_id = '00000000-0000-4000-8000-000000000001'),
  'approval creates a verified doctor profile'
);
select is(
  (select count(*)::integer from public.notifications where recipient_user_id = '00000000-0000-4000-8000-000000000001'),
  1,
  'application review creates a notification for the applicant'
);

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is(
  (select count(*)::integer from public.profiles),
  1,
  'public profile reads expose verified doctors only'
);
select throws_ok(
  $$select * from public.doctor_verification_applications$$,
  '42501', null,
  'anonymous users cannot read doctor applications'
);

select * from finish();
rollback;
