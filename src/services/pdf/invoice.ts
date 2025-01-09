import { jsPDF } from 'jspdf';
import type { Customer, Invoice, Ticket } from '../../types';
import { TICKET_CATEGORIES } from '../../config/tickets';

export async function generateInvoicePDF(
  invoice: Invoice,
  customer: Customer,
  tickets: Ticket[]
): Promise<string> {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Invoice', 105, 20, { align: 'center' });
  
  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.id}`, 20, 40);
  doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`, 20, 50);
  
  // Add customer info
  doc.text('Bill To:', 20, 70);
  doc.text(`${customer.firstName} ${customer.lastName}`, 20, 80);
  doc.text(`${customer.street} ${customer.houseNumber}`, 20, 90);
  doc.text(`${customer.city}, ${customer.postalCode}`, 20, 100);
  doc.text(customer.country, 20, 110);
  
  // Add ticket details
  let yPos = 130;
  doc.text('Description', 20, yPos);
  doc.text('Quantity', 100, yPos);
  doc.text('Price', 140, yPos);
  doc.text('Total', 180, yPos);
  
  yPos += 10;
  
  // Group tickets by category
  const ticketsByCategory = tickets.reduce((acc, ticket) => {
    acc[ticket.categoryId] = (acc[ticket.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(ticketsByCategory).forEach(([categoryId, quantity]) => {
    const category = TICKET_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return;
    
    doc.text(category.name, 20, yPos);
    doc.text(quantity.toString(), 100, yPos);
    doc.text(`€${category.price}`, 140, yPos);
    doc.text(`€${category.price * quantity}`, 180, yPos);
    yPos += 10;
  });
  
  // Add total
  doc.text('Total:', 140, yPos + 20);
  doc.text(`€${invoice.totalAmount}`, 180, yPos + 20);
  
  return doc.output('datauristring');
}