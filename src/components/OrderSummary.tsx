import React from 'react';
import { TICKET_CATEGORIES } from '../config/tickets';
import { CartItem } from '../types';

interface OrderSummaryProps {
  tickets: CartItem[];
  onConfirm: () => void;
  onBack: () => void;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export function OrderSummary({ tickets, customer, onConfirm, onBack }: OrderSummaryProps) {
  const calculateTotal = () => {
    return tickets.reduce((total, item) => {
      const category = TICKET_CATEGORIES.find(cat => cat.id === item.categoryId);
      return total + (category?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600">
          <h2 className="text-xl font-semibold text-white">Order Summary</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {customer && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                <p className="text-gray-600">{customer.firstName} {customer.lastName}</p>
                <p className="text-gray-600">{customer.email}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-gray-600">{customer.street} {customer.houseNumber}</p>
                <p className="text-gray-600">{customer.city}, {customer.postalCode}</p>
                <p className="text-gray-600">{customer.country}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tickets
              .filter(item => item.quantity > 0)
              .map(item => {
                const category = TICKET_CATEGORIES.find(cat => cat.id === item.categoryId);
                return (
                  <div key={item.categoryId} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{category?.name}</h3>
                      <p className="text-sm text-gray-500">€{category?.price} × {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      €{(category?.price || 0) * item.quantity}
                    </p>
                  </div>
                );
              })}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">Total</p>
              <p className="text-2xl font-bold text-indigo-600">€{calculateTotal()}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Proceed to Payment
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}