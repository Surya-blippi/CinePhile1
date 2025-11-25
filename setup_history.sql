-- Create a table to store user generated history
create table if not exists user_history (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  image_url text not null,
  poster_id text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table user_history enable row level security;

-- Create a policy that allows anyone to read/insert (since we are doing client-side auth for this MVP)
create policy "Allow public access to user_history"
  on user_history
  for all
  using (true)
  with check (true);
