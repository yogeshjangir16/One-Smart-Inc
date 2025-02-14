/*
  # Create products table

  1. New Table
    - `products`
      - `id` (text, primary key)
      - `name` (text)
      - `specifics` (text)
      - `purchase_date` (timestamptz)
      - `quantity` (integer)
      - `purchase_price` (numeric)
      - `discount` (numeric)
      - `mrp` (numeric)
      - `expiry_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policy for authenticated users to read and modify their own data
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  specifics text,
  purchase_date timestamptz NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  purchase_price numeric(10,2) NOT NULL,
  discount numeric(5,2) NOT NULL DEFAULT 0,
  mrp numeric(10,2) NOT NULL,
  expiry_date timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);