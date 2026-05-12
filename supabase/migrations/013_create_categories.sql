-- ============================================================
-- Migration: 013_create_categories.sql
-- Description: Creates the dynamic categories table and seeds initial data.
-- ============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- 3. Create Policies
-- Allow anyone (authenticated) to view categories
CREATE POLICY "Enable read access for all users" 
ON categories FOR SELECT 
USING (true);
-- Allow authenticated users to insert/update categories
-- (Adjust this if you have a specific 'is_admin' check)
CREATE POLICY "Enable insert for authenticated users" 
ON categories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" 
ON categories FOR UPDATE 
USING (auth.role() = 'authenticated');
-- 4. Seed with initial hardcoded data from constants.js
INSERT INTO categories (name) VALUES 
    ('General Sustainability'),
    ('Food'),
    ('Water'),
    ('Energy'),
    ('Transportation'),
    ('Consumption & Waste')
ON CONFLICT (name) DO NOTHING;
