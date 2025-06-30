export interface Order {
  customerName: string;
  customerAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  selectedPlanId: string | null;
  customPlanPrice: number | null;
  startDate: string | null;
  contractPeriodInMonths: number;
  endDate: string | null;
  selectedAddOns: {
    addOnId: string;
    quantity: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  plans: Plan[];
}

export interface Plan {
  id: string;
  name: string;
  defaultPrice: number;
  priceInterval: 'mo' | 'yr';
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
} 