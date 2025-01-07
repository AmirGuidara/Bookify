import { supabase } from '../../lib/supabase';
import type { Ticket } from '../../types';

export async function createTicket(
  ticket: Omit<Ticket, 'id' | 'createdAt'>
): Promise<Ticket> {
  const { data, error } = await supabase
    .from('tickets')
    .insert([{
      category_id: ticket.categoryId,
      customer_id: ticket.customerId,
      qr_code: ticket.qrCode,
      event_name: ticket.eventName,
      organizer_name: ticket.organizerName
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    categoryId: data.category_id,
    customerId: data.customer_id,
    qrCode: data.qr_code,
    eventName: data.event_name,
    organizerName: data.organizer_name,
    createdAt: new Date(data.created_at)
  };
}