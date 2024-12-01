create table public.message_history (
    id bigint primary key generated always as identity,
    text text not null,
    sender text not null,
    is_hidden boolean default false,
    timestamp timestamptz default now(),
    filter_result jsonb,
    created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.message_history enable row level security;

-- Create a policy that allows all operations (for demo purposes)
create policy "Allow all operations for message_history"
    on public.message_history
    for all
    using (true)
    with check (true);