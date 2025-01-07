import { jsPDF } from 'jspdf';
import type { Customer, Ticket } from '../../types';

export async function generateTicketsPDF(
  customer: Customer,
  tickets: Ticket[]
): Promise<string> {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Event Tickets', 105, 20, { align: 'center' });
  
  // Add customer info
  doc.setFontSize(12);
  doc.text(`${customer.firstName} ${customer.lastName}`, 20, 40);
  doc.text(customer.email, 20, 50);
  
  let yPos = 70;
  
  // Add tickets
  tickets.forEach((ticket, index) => {
    doc.text(`Ticket ${index + 1}: ${ticket.categoryId}`, 20, yPos);
    // Add QR code image
    doc.addImage(ticket.qrCode, 'PNG', 20, yPos + 10, 50, 50);
    yPos += 70;
    
    // Add new page if needed
    if (yPos > 250 && index < tickets.length - 1) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  return doc.output('datauristring');
}