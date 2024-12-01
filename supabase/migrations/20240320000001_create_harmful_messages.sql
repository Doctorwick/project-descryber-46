create table public.harmful_messages (
    id bigint primary key generated always as identity,
    text text not null,
    categories text[] not null,
    severity text not null,
    confidence numeric not null,
    timestamp timestamptz default now(),
    created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.harmful_messages enable row level security;

-- Create a policy that allows all operations (for demo purposes)
create policy "Allow all operations for harmful_messages"
    on public.harmful_messages
    for all
    using (true)
    with check (true);