import { supabase } from '../../lib/supabase';
import type { Customer } from '../../types';

export async function createCustomer(
  customer: Omit<Customer, 'id' | 'createdAt'>
): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      street: customer.street,
      city: customer.city,
      postal_code: customer.postalCode,
      country: customer.country
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    street: data.street,
    city: data.city,
    postalCode: data.postal_code,
    country: data.country,
    createdAt: new Date(data.created_at)
  };
}