import type { Product } from '@/types/order';

export const PRODUCTS: Product[] = [
  {
    id: 'crm-basic',
    name: 'CRM Basic',
    plans: [
      {
        id: 'crm-basic-monthly',
        name: 'Basic Monthly',
        defaultPrice: 29,
        priceInterval: 'mo',
      },
      {
        id: 'crm-basic-yearly',
        name: 'Basic Yearly',
        defaultPrice: 290,
        priceInterval: 'yr',
      },
    ],
  },
  {
    id: 'crm-pro',
    name: 'CRM Professional',
    plans: [
      {
        id: 'crm-pro-monthly',
        name: 'Professional Monthly',
        defaultPrice: 79,
        priceInterval: 'mo',
      },
      {
        id: 'crm-pro-yearly',
        name: 'Professional Yearly',
        defaultPrice: 790,
        priceInterval: 'yr',
      },
    ],
  },
  {
    id: 'crm-enterprise',
    name: 'CRM Enterprise',
    plans: [
      {
        id: 'crm-enterprise-monthly',
        name: 'Enterprise Monthly',
        defaultPrice: 149,
        priceInterval: 'mo',
      },
      {
        id: 'crm-enterprise-yearly',
        name: 'Enterprise Yearly',
        defaultPrice: 1490,
        priceInterval: 'yr',
      },
    ],
  },
]; 