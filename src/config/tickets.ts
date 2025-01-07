import { TicketCategory } from '../types';

export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'adult',
    name: 'Adult',
    price: 40,
    ageRestriction: {
      min: 14
    },
    requiresStudentCard: false
  },
  {
    id: 'student',
    name: 'Student',
    price: 30,
    requiresStudentCard: true
  },
  {
    id: 'child',
    name: 'Child',
    price: 20,
    ageRestriction: {
      min: 4,
      max: 14
    },
    requiresStudentCard: false
  },
  {
    id: 'infant',
    name: 'Infant',
    price: 0,
    ageRestriction: {
      max: 4
    },
    requiresStudentCard: false
  }
];

export const EVENT_NAME = "MedinaFest مهرجان المدينة";
export const ORGANIZER_NAME = "Asslema";