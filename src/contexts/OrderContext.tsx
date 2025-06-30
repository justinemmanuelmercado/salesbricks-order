import React, { createContext, useState, type ReactNode } from 'react';
import type { Order } from '@/types/order';

interface OrderContextType {
  order: Order;
  updateOrder: (updates: Partial<Order>) => void;
  currentStage: number;
  setCurrentStage: (stage: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const initialOrder: Order = {
  customerName: '',
  customerAddress: undefined,
  selectedPlanId: null,
  customPlanPrice: null,
  startDate: null,
  contractPeriodInMonths: 12,
  endDate: null,
  selectedAddOns: [],
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [currentStage, setCurrentStage] = useState(1);

  const updateOrder = (updates: Partial<Order>) => {
    setOrder(prev => ({ ...prev, ...updates }));
  };

  return (
    <OrderContext.Provider value={{
      order,
      updateOrder,
      currentStage,
      setCurrentStage,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext };