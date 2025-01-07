import { supabase } from '../../lib/supabase';
import type { Invoice } from '../../types';

export async function createInvoice(
  customerId: string,
  totalAmount: number,
  pdfPath: string
): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      customer_id: customerId,
      total_amount: totalAmount,
      pdf_path: pdfPath
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    customerId: data.customer_id,
    totalAmount: data.total_amount,
    pdfPath: data.pdf_path,
    createdAt: new Date(data.created_at),
    tickets: [] // Tickets will be linked separately
  };
}