-- Server-side, append-only acceptance audit for the contract gate.
-- The existing public.contract_acceptance_audit table is retained so historical
-- evidence and new first-party events remain in one auditable surface.

create schema if not exists private;

create unique index if not exists contract_acceptance_audit_user_version_uq
  on public.contract_acceptance_audit (subject_user_id, contract_version)
  where subject_user_id is not null and acceptance_status = 'accepted';

alter table public.contract_acceptance_audit enable row level security;

drop policy if exists "Users can view their own contract acceptance" on public.contract_acceptance_audit;
create policy "Users can view their own contract acceptance"
  on public.contract_acceptance_audit
  for select
  to authenticated
  using ((select auth.uid()) = subject_user_id);

revoke insert, update, delete, truncate on public.contract_acceptance_audit from anon, authenticated;
grant select on public.contract_acceptance_audit to authenticated;

create or replace function private.prevent_contract_acceptance_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'contract acceptance audit is append-only';
end;
$$;

drop trigger if exists contract_acceptance_audit_append_only on public.contract_acceptance_audit;
create trigger contract_acceptance_audit_append_only
  before update or delete on public.contract_acceptance_audit
  for each row execute function private.prevent_contract_acceptance_mutation();

create or replace function public.get_contract_acceptance_status(p_contract_version text)
returns table (
  required boolean,
  accepted boolean,
  event_id uuid,
  accepted_at timestamptz,
  contract_version text,
  contract_sha256 text
)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    lower(coalesce(p.status, '')) = 'active' and e.id is null as required,
    e.id is not null as accepted,
    e.id,
    e.original_accepted_at,
    coalesce(e.contract_version, p_contract_version),
    e.evidence ->> 'contract_sha256'
  from public.profiles p
  left join lateral (
    select a.id, a.original_accepted_at, a.contract_version, a.evidence
    from public.contract_acceptance_audit a
    where a.subject_user_id = auth.uid()
      and a.contract_version = p_contract_version
      and a.acceptance_status = 'accepted'
    order by a.recorded_at desc
    limit 1
  ) e on true
  where p.id = auth.uid();
$$;

create or replace function public.record_contract_acceptance(
  p_contract_version text,
  p_acceptance_action text default 'checkbox_and_confirm_button'
)
returns table (
  event_id uuid,
  accepted_at timestamptz,
  contract_version text
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_event_id uuid;
  v_now timestamptz := clock_timestamp();
  v_name text;
  v_email text;
  v_status text;
  v_headers jsonb;
  v_contract_sha256 constant text := '3f654498e5339154d1f90960fa5d6a26fe1b2bd67d143ebada22b7a64dd9ef96';
begin
  if v_user_id is null then
    raise exception 'authenticated session required';
  end if;

  if p_contract_version is distinct from '2025-08-21-v1' then
    raise exception 'unsupported contract version';
  end if;

  select p.name, p.email, p.status
    into v_name, v_email, v_status
  from public.profiles p
  where p.id = v_user_id;

  if not found or lower(coalesce(v_status, '')) <> 'active' then
    raise exception 'only active profiles may accept the contract';
  end if;

  select a.id, a.original_accepted_at, a.contract_version
    into event_id, accepted_at, contract_version
  from public.contract_acceptance_audit a
  where a.subject_user_id = v_user_id
    and a.contract_version = p_contract_version
    and a.acceptance_status = 'accepted'
  order by a.recorded_at desc
  limit 1;

  if found then
    return next;
    return;
  end if;

  v_event_id := gen_random_uuid();
  v_headers := coalesce(nullif(current_setting('request.headers', true), '')::jsonb, '{}'::jsonb);

  insert into public.contract_acceptance_audit (
    id,
    subject_name,
    subject_user_id,
    event_type,
    record_type,
    acceptance_status,
    original_accepted_at,
    historical_reference_date,
    historical_reference_type,
    recorded_at,
    contract_version,
    evidence,
    notes
  ) values (
    v_event_id,
    coalesce(nullif(v_name, ''), nullif(v_email, ''), v_user_id::text),
    v_user_id,
    'contract_acceptance',
    'original_event',
    'accepted',
    v_now,
    v_now::date,
    'site_acceptance',
    v_now,
    p_contract_version,
    jsonb_build_object(
      'event', 'contract_accepted',
      'user_id', v_user_id,
      'user_email', v_email,
      'accepted_at', v_now,
      'source_type', 'supabase_database',
      'source_table', 'public.contract_acceptance_audit',
      'source_record_id', v_event_id,
      'contract_version', p_contract_version,
      'contract_sha256', v_contract_sha256,
      'application_rule', 'dashboard_access_requires_contract_acceptance',
      'acceptance_action', coalesce(nullif(p_acceptance_action, ''), 'checkbox_and_confirm_button'),
      'acceptance_method', 'authenticated_web_session',
      'user_agent', v_headers ->> 'user-agent',
      'client_ip', coalesce(v_headers ->> 'x-forwarded-for', v_headers ->> 'cf-connecting-ip'),
      'source_created_at', v_now,
      'source_updated_at', v_now,
      'evidence_collected_at', v_now,
      'evidence_collected_by', 'contract_acceptance_rpc'
    ),
    'Aceite registrado pelo fluxo autenticado do site.'
  );

  update public.profiles
  set contract_accepted = true,
      updated_at = v_now
  where id = v_user_id;

  event_id := v_event_id;
  accepted_at := v_now;
  contract_version := p_contract_version;
  return next;
end;
$$;

revoke all on function public.get_contract_acceptance_status(text) from public, anon;
grant execute on function public.get_contract_acceptance_status(text) to authenticated;

revoke all on function public.record_contract_acceptance(text, text) from public, anon;
grant execute on function public.record_contract_acceptance(text, text) to authenticated;

comment on function public.get_contract_acceptance_status(text) is
  'Returns the authenticated user contract gate status for a published contract version.';

comment on function public.record_contract_acceptance(text, text) is
  'Appends one server-timestamped contract acceptance event for the authenticated active profile.';

