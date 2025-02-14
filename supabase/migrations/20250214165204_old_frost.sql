-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update products table to include user_id
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can read their own products" ON products;
DROP POLICY IF EXISTS "Users can insert their own products" ON products;
DROP POLICY IF EXISTS "Users can update their own products" ON products;

CREATE POLICY "Users can read their own products"
ON products FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own products"
ON products FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own products"
ON products FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());