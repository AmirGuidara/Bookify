/*
  # Add ticket relations and constraints

  1. Changes
    - Add relations between tickets and invoices
    - Add constraints for ticket categories
    - Add indexes for performance

  2. Security
    - Add policies for ticket-invoice relations
*/

-- Add invoice_id to tickets table
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tickets' AND column_name = 'invoice_id'
  ) THEN
    ALTER TABLE tickets ADD COLUMN invoice_id UUID REFERENCES invoices(id);
  END IF;
END $$;

-- Add category constraints
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tickets' AND column_name = 'category_name'
  ) THEN
    ALTER TABLE tickets ADD COLUMN category_name TEXT NOT NULL;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_invoice_id ON tickets(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);

-- Add policies for ticket-invoice relations
CREATE POLICY "Tickets are readable by invoice owner"
  ON tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = tickets.invoice_id
      AND invoices.customer_id = auth.uid()
    )
  );