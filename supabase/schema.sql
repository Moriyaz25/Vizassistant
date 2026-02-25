-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create datasets table
create table if not exists public.datasets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    file_name text not null,
    upload_date timestamp with time zone default now() not null,
    row_count integer,
    column_count integer,
    raw_data jsonb,
    created_at timestamp with time zone default now()
);

-- Create insights table
create table if not exists public.insights (
    id uuid default uuid_generate_v4() primary key,
    dataset_id uuid references public.datasets(id) on delete cascade not null,
    summary_text text,
    created_at timestamp with time zone default now()
);

-- Create charts table (referenced in History.jsx)
create table if not exists public.charts (
    id uuid default uuid_generate_v4() primary key,
    dataset_id uuid references public.datasets(id) on delete cascade not null,
    chart_config jsonb,
    created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.datasets enable row level security;
alter table public.insights enable row level security;
alter table public.charts enable row level security;

-- Policies for datasets
create policy "Users can view their own datasets" on public.datasets
    for select using (auth.uid() = user_id);

create policy "Users can insert their own datasets" on public.datasets
    for insert with check (auth.uid() = user_id);

create policy "Users can delete their own datasets" on public.datasets
    for delete using (auth.uid() = user_id);

-- Policies for insights (via dataset ownership)
create policy "Users can view insights of their datasets" on public.insights
    for select using (
        exists (
            select 1 from public.datasets
            where datasets.id = insights.dataset_id
            and datasets.user_id = auth.uid()
        )
    );

create policy "Users can insert insights for their datasets" on public.insights
    for insert with check (
        exists (
            select 1 from public.datasets
            where datasets.id = insights.dataset_id
            and datasets.user_id = auth.uid()
        )
    );

create policy "Users can delete insights of their datasets" on public.insights
    for delete using (
        exists (
            select 1 from public.datasets
            where datasets.id = insights.dataset_id
            and datasets.user_id = auth.uid()
        )
    );

-- Policies for charts
create policy "Users can view charts of their datasets" on public.charts
    for select using (
        exists (
            select 1 from public.datasets
            where datasets.id = charts.dataset_id
            and datasets.user_id = auth.uid()
        )
    );

create policy "Users can insert charts for their datasets" on public.charts
    for insert with check (
        exists (
            select 1 from public.datasets
            where datasets.id = charts.dataset_id
            and datasets.user_id = auth.uid()
        )
    );

create policy "Users can delete charts of their datasets" on public.charts
    for delete using (
        exists (
            select 1 from public.datasets
            where datasets.id = charts.dataset_id
            and datasets.user_id = auth.uid()
        )
    );
