import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, MapPin, Building, Globe } from 'lucide-react';
import { TICKET_CATEGORIES } from '../config/tickets';
import { countries } from '../data/countries';
import { useLanguage } from '../contexts/LanguageContext';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  tickets: z.array(z.object({
    categoryId: z.string(),
    quantity: z.number().min(0)
  }))
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      tickets: TICKET_CATEGORIES.map(category => ({
        categoryId: category.id,
        quantity: 0
      }))
    }
  });

  const tickets = watch('tickets');
  const hasTickets = tickets?.some(ticket => ticket.quantity > 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('form.personalInfo')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={18} />
              {t('form.firstName')}
            </label>
            <input
              {...register('firstName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={18} />
              {t('form.lastName')}
            </label>
            <input
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={18} />
              {t('form.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={18} />
              {t('form.street')}
            </label>
            <input
              {...register('street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building size={18} />
              {t('form.city')}
            </label>
            <input
              {...register('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={18} />
              {t('form.postalCode')}
            </label>
            <input
              {...register('postalCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Globe size={18} />
              {t('form.country')}
            </label>
            <select
              {...register('country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">{t('form.selectCountry')}</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('tickets.title')}</h2>
        
        <div className="space-y-4">
          {TICKET_CATEGORIES.map((category, index) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-medium text-indigo-600">
                      {category.price === 0 ? t('tickets.free') : `€${category.price}`}
                    </p>
                    <p className="text-gray-500">
                      {category.ageRestriction && (
                        <span className="block">
                          {category.ageRestriction.min && t('tickets.ageRestriction.min').replace('{{age}}', category.ageRestriction.min.toString())}
                          {category.ageRestriction.max && t('tickets.ageRestriction.max').replace('{{age}}', category.ageRestriction.max.toString())}
                        </span>
                      )}
                      {category.requiresStudentCard && (
                        <span className="block text-amber-600">
                          {t('tickets.studentRequired')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('tickets.quantity')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register(`tickets.${index}.quantity` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={!hasTickets}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('tickets.continueToCheckout')}
        </button>
        {!hasTickets && (
          <p className="mt-2 text-sm text-center text-gray-500">
            {t('tickets.selectAtLeastOne')}
          </p>
        )}
      </div>
    </form>
  );
}