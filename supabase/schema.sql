-- Longtress Orders Table
-- Run this in the Supabase SQL editor to set up the database

create table if not exists orders (
  id              text primary key,                -- e.g. "LT-A1B2C" derived from stripe session
  stripe_session_id text unique not null,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null default '',
  shipping_address jsonb not null,               -- { line1, apt?, city, state, zip, country }
  items           jsonb not null,                -- [{ name, qty, price }]
  subtotal        numeric(10,2) not null,
  shipping_cost   numeric(10,2) not null default 0,
  tax             numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  shipping_method text not null default 'standard', -- 'standard' | 'express'
  status          text not null default 'Pending',  -- Pending | Processing | Shipped | Delivered | Cancelled
  notes           text,
  created_at      timestamptz not null default now()
);

-- Index for common queries
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_customer_email_idx on orders(customer_email);

-- Disable RLS (service role key is used for all server operations)
alter table orders disable row level security;
