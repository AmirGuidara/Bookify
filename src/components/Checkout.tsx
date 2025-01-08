import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { TICKET_CATEGORIES } from '../config/tickets';
import { CartItem } from '../types';
import { AlertTriangle } from 'lucide-react';

interface CheckoutProps {
  bookingData: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    tickets: CartItem[];
  };
  onPaymentSuccess: (orderId: string) => void;
  onPaymentError: (error: any) => void;
  onBack: () => void;
}

export function Checkout({ bookingData, onPaymentSuccess, onPaymentError, onBack }: CheckoutProps) {
  const [paypalError, setPaypalError] = useState<string | null>(null);
  
  const calculateTotal = () => {
    return bookingData.tickets.reduce((total, item) => {
      const category = TICKET_CATEGORIES.find(cat => cat.id === item.categoryId);
      return total + (category?.price || 0) * item.quantity;
    }, 0);
  };

  const total = calculateTotal();
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">PayPal configuration is missing. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
            <p className="text-gray-600">{bookingData.firstName} {bookingData.lastName}</p>
            <p className="text-gray-600">{bookingData.email}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
            <p className="text-gray-600">{bookingData.street}</p>
            <p className="text-gray-600">{bookingData.city}, {bookingData.postalCode}</p>
            <p className="text-gray-600">{bookingData.country}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Tickets</h3>
            <div className="space-y-2">
              {bookingData.tickets
                .filter(item => item.quantity > 0)
                .map(item => {
                  const category = TICKET_CATEGORIES.find(cat => cat.id === item.categoryId);
                  return (
                    <div key={item.categoryId} className="flex justify-between text-gray-600">
                      <span>{category?.name} × {item.quantity}</span>
                      <span>€{(category?.price || 0) * item.quantity}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>€{total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-bold">Payment Method</h3>
          {paypalError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{paypalError}</p>
              </div>
            </div>
          )}
          <PayPalScriptProvider options={{ 
            clientId: paypalClientId,
            currency: "EUR"
          }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: total.toString(),
                      currency_code: "EUR"
                    }
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  const order = await actions.order.capture();
                  onPaymentSuccess(order.id);
                }
              }}
              onError={(err) => {
                setPaypalError('There was an error processing your payment. Please try again.');
                onPaymentError(err);
              }}
            />
          </PayPalScriptProvider>
          
          <button
            onClick={onBack}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
}