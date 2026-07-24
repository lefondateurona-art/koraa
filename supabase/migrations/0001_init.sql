-- KORAA initial schema
-- Run this against your Supabase project's SQL editor or via `supabase db push`.

create extension if not exists pg_trgm;
create extension if not exists "uuid-ossp";

-- ========== profiles ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_username_idx on public.profiles using gin (username gin_trgm_ops);

alter table public.profiles enable row level security;
create policy "profiles are publicly readable" on public.profiles for select using (true);
create policy "users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- ========== shops ==========
create table if not exists public.shops (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  description text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shops_owner_idx on public.shops(owner_id);
create index if not exists shops_name_trgm_idx on public.shops using gin (name gin_trgm_ops);

alter table public.shops enable row level security;
create policy "shops are publicly readable" on public.shops for select using (true);
create policy "owners can insert their shop" on public.shops for insert with check (auth.uid() = owner_id);
create policy "owners can update their shop" on public.shops for update using (auth.uid() = owner_id);
create policy "owners can delete their shop" on public.shops for delete using (auth.uid() = owner_id);

-- ========== products ==========
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  description text,
  price integer not null,
  old_price integer,
  category text,
  image_url text,
  search_vector tsvector generated always as (to_tsvector('french', coalesce(name, '') || ' ' || coalesce(description, ''))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_shop_idx on public.products(shop_id);
create index if not exists products_search_idx on public.products using gin (search_vector);

alter table public.products enable row level security;
create policy "products are publicly readable" on public.products for select using (true);
create policy "shop owners can insert products" on public.products for insert
  with check (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));
create policy "shop owners can update products" on public.products for update
  using (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));
create policy "shop owners can delete products" on public.products for delete
  using (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));

-- ========== posts (video/photo content, drives the "Commander" button) ==========
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  video_url text not null,
  caption text,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists posts_shop_idx on public.posts(shop_id);
create index if not exists posts_created_idx on public.posts(created_at desc);

alter table public.posts enable row level security;
create policy "posts are publicly readable" on public.posts for select using (true);
create policy "authors can insert their posts" on public.posts for insert with check (auth.uid() = author_id);
create policy "authors can update their posts" on public.posts for update using (auth.uid() = author_id);
create policy "authors can delete their posts" on public.posts for delete using (auth.uid() = author_id);

-- ========== orders ==========
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  price integer not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_buyer_idx on public.orders(buyer_id);
create index if not exists orders_shop_idx on public.orders(shop_id);

alter table public.orders enable row level security;
create policy "buyers can read their orders" on public.orders for select using (auth.uid() = buyer_id);
create policy "shop owners can read orders for their shop" on public.orders for select
  using (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));
create policy "buyers can insert orders" on public.orders for insert with check (auth.uid() = buyer_id);
create policy "shop owners can update order status" on public.orders for update
  using (exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid()));

-- ========== favorites ==========
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, shop_id)
);

alter table public.favorites enable row level security;
create policy "users can read their favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "users can insert their favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "users can delete their favorites" on public.favorites for delete using (auth.uid() = user_id);

-- ========== follows ==========
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table public.follows enable row level security;
create policy "follows are publicly readable" on public.follows for select using (true);
create policy "users can follow" on public.follows for insert with check (auth.uid() = follower_id);
create policy "users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

-- ========== conversations ==========
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  participant_one uuid not null references public.profiles(id) on delete cascade,
  participant_two uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (participant_one, participant_two)
);
create index if not exists conversations_p1_idx on public.conversations(participant_one);
create index if not exists conversations_p2_idx on public.conversations(participant_two);

alter table public.conversations enable row level security;
create policy "participants can read their conversation" on public.conversations for select
  using (auth.uid() = participant_one or auth.uid() = participant_two);
create policy "participants can create a conversation" on public.conversations for insert
  with check (auth.uid() = participant_one or auth.uid() = participant_two);

-- ========== messages ==========
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);

alter table public.messages enable row level security;
create policy "participants can read messages" on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (auth.uid() = c.participant_one or auth.uid() = c.participant_two)
  ));
create policy "participants can send messages" on public.messages for insert
  with check (auth.uid() = author_id and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (auth.uid() = c.participant_one or auth.uid() = c.participant_two)
  ));

-- ========== notifications ==========
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

alter table public.notifications enable row level security;
create policy "users can read their notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "users can update their notifications" on public.notifications for update using (auth.uid() = user_id);

-- ========== updated_at triggers ==========
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_shops_updated_at before update on public.shops
  for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
