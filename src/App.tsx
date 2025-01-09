import React, { useState } from 'react';
import { BookingForm } from './components/BookingForm';
import { Checkout } from './components/Checkout';
import { TICKET_CATEGORIES, EVENT_NAME, ORGANIZER_NAME } from './config/tickets';
import { Ticket } from 'lucide-react';
import { CartItem, Customer } from './types';
import { createCustomer, createInvoice, createTicket } from './services/database';
import { generateTicketQR } from './services/qr';
import { generateTicketsPDF, generateInvoicePDF } from './services/pdf';
import { updateBookingExcel } from './services/excel';
import { sendTicketEmail } from './services/email';
import { useLanguage } from './contexts/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

type BookingStep = 'form' | 'checkout';

function App() {
  const { t } = useLanguage();
  const [step, setStep] = useState<BookingStep>('form');
  const [bookingData, setBookingData] = useState<{
    customer: Omit<Customer, 'id' | 'createdAt'>;
    tickets: CartItem[];
  } | null>(null);

  const handleBookingSubmit = (data: any) => {
    const selectedTickets = data.tickets.filter((t: CartItem) => t.quantity > 0);
    setBookingData({
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        street: data.street,
        houseNumber: data.houseNumber,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country
      },
      tickets: selectedTickets
    });
    setStep('checkout');
  };

  const handlePaymentSuccess = async (orderId: string) => {
    if (!bookingData) return;

    try {
      // Create customer
      const customer = await createCustomer(bookingData.customer);

      // Generate tickets with QR codes
      const tickets = [];
      for (const item of bookingData.tickets) {
        for (let i = 0; i < item.quantity; i++) {
          const qrCode = await generateTicketQR({
            categoryId: item.categoryId,
            customerId: customer.id,
            eventName: EVENT_NAME,
            organizerName: ORGANIZER_NAME
          });

          const ticket = await createTicket({
            categoryId: item.categoryId,
            customerId: customer.id,
            qrCode,
            eventName: EVENT_NAME,
            organizerName: ORGANIZER_NAME
          });

          tickets.push(ticket);
        }
      }

      // Generate PDFs
      const ticketsPDF = await generateTicketsPDF(customer, tickets);
      const invoicePDF = await generateInvoicePDF(
        {
          id: orderId,
          customerId: customer.id,
          totalAmount: calculateTotal(bookingData.tickets),
          pdfPath: `invoices/${orderId}.pdf`,
          createdAt: new Date(),
          tickets
        },
        customer,
        tickets
      );

      // Create invoice in database
      await createInvoice(
        customer.id,
        calculateTotal(bookingData.tickets),
        `invoices/${orderId}.pdf`
      );

      // Update Excel file
      await updateBookingExcel(customer, tickets);

      // Send email
      await sendTicketEmail(customer, tickets, ticketsPDF);

      // Reset form
      setBookingData(null);
      setStep('form');

    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error appropriately
    }
  };

  const calculateTotal = (tickets: CartItem[]) => {
    return tickets.reduce((total, item) => {
      const category = TICKET_CATEGORIES.find(cat => cat.id === item.categoryId);
      return total + (category?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Ticket className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{EVENT_NAME}</h1>
                <p className="text-sm text-gray-500">
                  {t('header.organizedBy')} {ORGANIZER_NAME}
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {step === 'form' && (
          <BookingForm onSubmit={handleBookingSubmit} />
        )}
        
        {step === 'checkout' && bookingData && (
          <Checkout
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={(error) => console.error('Payment error:', error)}
            onBack={() => setStep('form')}
          />
        )}
      </main>
    </div>
  );
}

export default App;