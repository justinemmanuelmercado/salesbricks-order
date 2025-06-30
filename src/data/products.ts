import type { Product, AddOn } from '@/types/order';

export const PRODUCTS: Product[] = [
  {
    id: 'crm-basic',
    name: 'CRM Basic',
    plans: [
      {
        id: 'crm-basic-starter',
        name: 'Starter',
        defaultPrice: 19,
      },
      {
        id: 'crm-basic-standard',
        name: 'Standard',
        defaultPrice: 29,
      },
      {
        id: 'crm-basic-premium',
        name: 'Premium',
        defaultPrice: 39,
      },
    ],
  },
  {
    id: 'crm-pro',
    name: 'CRM Professional',
    plans: [
      {
        id: 'crm-pro-essential',
        name: 'Essential',
        defaultPrice: 59,
      },
      {
        id: 'crm-pro-advanced',
        name: 'Advanced',
        defaultPrice: 79,
      },
      {
        id: 'crm-pro-complete',
        name: 'Complete',
        defaultPrice: 99,
      },
    ],
  },
  {
    id: 'crm-enterprise',
    name: 'CRM Enterprise',
    plans: [
      {
        id: 'crm-enterprise-business',
        name: 'Business',
        defaultPrice: 129,
      },
      {
        id: 'crm-enterprise-corporate',
        name: 'Corporate',
        defaultPrice: 149,
      },
      {
        id: 'crm-enterprise-ultimate',
        name: 'Ultimate',
        defaultPrice: 199,
      },
    ],
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: 'advanced-reporting',
    name: 'Advanced Reporting',
    price: 15,
    priceLabel: '$15/mo per user',
  },
  {
    id: 'api-access',
    name: 'API Access',
    price: 25,
    priceLabel: '$25/mo per integration',
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    price: 10,
    priceLabel: '$10/mo per user',
  },
  {
    id: 'data-backup',
    name: 'Enhanced Data Backup',
    price: 20,
    priceLabel: '$20/mo per account',
  },
  {
    id: 'custom-integrations',
    name: 'Custom Integrations',
    price: 50,
    priceLabel: '$50/mo per integration',
  },
]; 