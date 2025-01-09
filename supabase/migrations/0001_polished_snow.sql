/*
  # Initial Schema Setup for MedinaFest Ticket Booking System

  1. New Tables
    - customers: Stores customer information
    - tickets: Stores ticket information with QR codes
    - invoices: Stores invoice information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  street TEXT NOT NULL,
  house_number TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  qr_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  total_amount DECIMAL NOT NULL,
  pdf_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Customers can read their own data"
  ON customers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Tickets are readable by ticket owner"
  ON tickets
  FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Invoices are readable by invoice owner"
  ON invoices
  FOR SELECT
  USING (auth.uid() = customer_id);