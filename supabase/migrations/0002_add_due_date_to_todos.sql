alter table public.todos
  add column if not exists due_date timestamptz;
