-- Create a table to store user credits
create table if not exists user_credits (
  user_id text primary key,
  credits integer default 0,
  last_updated timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table user_credits enable row level security;

-- Create a policy that allows anyone to read/insert/update (since we are doing client-side auth for this MVP)
-- In a real app, you would restrict this to authenticated users
create policy "Allow public access to user_credits"
  on user_credits
  for all
  using (true)
  with check (true);
