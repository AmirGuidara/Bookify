import * as XLSX from 'xlsx';
import type { Customer, Ticket } from '../types';

export async function updateBookingExcel(
  customer: Customer,
  tickets: Ticket[]
): Promise<void> {
  // Create workbook if it doesn't exist
  let workbook: XLSX.WorkBook;
  try {
    const response = await fetch('/bookings.xlsx');
    const buffer = await response.arrayBuffer();
    workbook = XLSX.read(buffer);
  } catch {
    workbook = XLSX.utils.book_new();
  }

  // Get or create worksheet
  let worksheet = workbook.Sheets['Bookings'] || XLSX.utils.aoa_to_sheet([
    ['First Name', 'Last Name', 'Email', 'Ticket Category', 'QR Code']
  ]);

  // Add new rows
  tickets.forEach(ticket => {
    XLSX.utils.sheet_add_aoa(worksheet, [[
      customer.firstName,
      customer.lastName,
      customer.email,
      ticket.categoryId,
      ticket.qrCode
    ]], { origin: -1 });
  });

  // Update workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  
  // Save workbook
  const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'bookings.xlsx';
  link.click();
}