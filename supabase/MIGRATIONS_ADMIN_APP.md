# Supabase Admin App Migrations

Run these migration files in production in this order:

1. `supabase/migrations/20260716_admin_push_tokens.sql`
2. `supabase/migrations/20260716_notification_logs.sql`

## Safe Execution Steps

1. Open Supabase SQL Editor for the production project.
2. Run migration 1 and confirm success.
3. Run migration 2 and confirm success.
4. Verify objects:

```sql
select to_regclass('public.admin_push_tokens') as admin_push_tokens_table;
select to_regclass('public.notification_logs') as notification_logs_table;
```

5. Verify columns:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('admin_push_tokens', 'notification_logs')
order by table_name, ordinal_position;
```

## Rollback (Emergency)

```sql
begin;
drop table if exists public.notification_logs;
drop table if exists public.admin_push_tokens;
commit;
```

Use rollback only if you must fully remove this feature.
