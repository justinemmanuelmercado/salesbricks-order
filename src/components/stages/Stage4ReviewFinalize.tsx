import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useOrder } from '@/contexts/useOrder';
import { ADD_ONS } from '@/data/products';
import { PRODUCTS } from '@/data/products';

const addOnSchema = z.object({
  addOnId: z.string(),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative'),
});

const reviewFinalizeSchema = z.object({
  selectedAddOns: z.array(addOnSchema),
});

type ReviewFinalizeFormData = z.infer<typeof reviewFinalizeSchema>;

interface Stage4ReviewFinalizeProps {
  onPrevious: () => void;
}

export const Stage4ReviewFinalize: React.FC<Stage4ReviewFinalizeProps> = ({ onPrevious }) => {
  const { order, updateOrder } = useOrder();
  const [checkedAddOns, setCheckedAddOns] = useState<Set<string>>(
    new Set(order.selectedAddOns.map(addon => addon.addOnId))
  );
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>(
    order.selectedAddOns.reduce((acc, addon) => {
      acc[addon.addOnId] = addon.quantity;
      return acc;
    }, {} as Record<string, number>)
  );
  const [isFinalized, setIsFinalized] = useState(false);

  const methods = useForm<ReviewFinalizeFormData>({
    resolver: zodResolver(reviewFinalizeSchema),
    defaultValues: {
      selectedAddOns: order.selectedAddOns,
    },
  });

  const { handleSubmit } = methods;

  const handleAddOnCheck = (addOnId: string, checked: boolean) => {
    const newCheckedAddOns = new Set(checkedAddOns);
    if (checked) {
      newCheckedAddOns.add(addOnId);
      if (!addOnQuantities[addOnId]) {
        setAddOnQuantities(prev => ({ ...prev, [addOnId]: 1 }));
      }
    } else {
      newCheckedAddOns.delete(addOnId);
    }
    setCheckedAddOns(newCheckedAddOns);
    updateSelectedAddOns(newCheckedAddOns, addOnQuantities);
  };

  const handleQuantityChange = (addOnId: string, quantity: number) => {
    const newQuantities = { ...addOnQuantities, [addOnId]: quantity };
    setAddOnQuantities(newQuantities);
    updateSelectedAddOns(checkedAddOns, newQuantities);
  };

  const updateSelectedAddOns = (checked: Set<string>, quantities: Record<string, number>) => {
    const selectedAddOns = Array.from(checked).map(addOnId => ({
      addOnId,
      quantity: quantities[addOnId] || 1,
    }));
    updateOrder({ selectedAddOns });
  };

  const getSelectedProduct = () => {
    return PRODUCTS.find(product => 
      product.plans.some(plan => plan.id === order.selectedPlanId)
    );
  };

  const getSelectedPlan = () => {
    const product = getSelectedProduct();
    return product?.plans.find(plan => plan.id === order.selectedPlanId);
  };

  const calculateAddOnsTotal = () => {
    return Array.from(checkedAddOns).reduce((total, addOnId) => {
      const addOn = ADD_ONS.find(a => a.id === addOnId);
      const quantity = addOnQuantities[addOnId] || 1;
      return total + (addOn?.price || 0) * quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const planPrice = order.customPlanPrice || 0;
    const addOnsTotal = calculateAddOnsTotal();
    return planPrice + addOnsTotal;
  };

  const onSubmit = () => {
    setIsFinalized(true);
  };

  if (isFinalized) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-3xl text-green-600">Order Finalized Successfully!</CardTitle>
            <CardDescription className="text-lg mt-4">
              Your order has been submitted and will be processed shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-2">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Plan:</strong> {getSelectedPlan()?.name} - ${order.customPlanPrice}/mo</p>
              <p><strong>Contract Period:</strong> {order.contractPeriodInMonths} months</p>
              <p><strong>Total Monthly:</strong> ${calculateTotal()}</p>
            </div>
            <Button 
              onClick={() => setIsFinalized(false)}
              className="mt-6"
              variant="outline"
            >
              Back to Review
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add-ons Selection</CardTitle>
              <CardDescription>
                Choose additional features for your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    {ADD_ONS.map((addOn) => (
                      <div key={addOn.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          id={addOn.id}
                          checked={checkedAddOns.has(addOn.id)}
                          onCheckedChange={(checked) => handleAddOnCheck(addOn.id, !!checked)}
                        />
                        <div className="flex-1">
                          <label htmlFor={addOn.id} className="text-sm font-medium cursor-pointer">
                            {addOn.name}
                          </label>
                          <p className="text-sm text-gray-600">{addOn.priceLabel}</p>
                        </div>
                        {checkedAddOns.has(addOn.id) && (
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`quantity-${addOn.id}`} className="text-sm">Qty:</label>
                            <Input
                              id={`quantity-${addOn.id}`}
                              type="number"
                              min="0"
                              step="1"
                              value={addOnQuantities[addOn.id] || 1}
                              onChange={(e) => handleQuantityChange(addOn.id, parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="outline" onClick={onPrevious}>
                      Previous: Contract Terms
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Finalize Order
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Customer Information</h4>
                <p className="text-sm text-gray-600">{order.customerName}</p>
                {order.customerAddress && (
                  <div className="text-sm text-gray-600">
                    <p>{order.customerAddress.addressLine1}</p>
                    {order.customerAddress.addressLine2 && <p>{order.customerAddress.addressLine2}</p>}
                    <p>{order.customerAddress.city}, {order.customerAddress.state} {order.customerAddress.zipCode}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium">Product & Plan</h4>
                <p className="text-sm text-gray-600">{getSelectedProduct()?.name}</p>
                <p className="text-sm text-gray-600">{getSelectedPlan()?.name}</p>
                <p className="text-sm font-medium">${order.customPlanPrice}/mo</p>
              </div>

              <div>
                <h4 className="font-medium">Contract Terms</h4>
                <p className="text-sm text-gray-600">Start: {order.startDate}</p>
                <p className="text-sm text-gray-600">Duration: {order.contractPeriodInMonths} months</p>
                <p className="text-sm text-gray-600">End: {order.endDate}</p>
              </div>

              {Array.from(checkedAddOns).length > 0 && (
                <div>
                  <h4 className="font-medium">Add-ons</h4>
                  {Array.from(checkedAddOns).map(addOnId => {
                    const addOn = ADD_ONS.find(a => a.id === addOnId);
                    const quantity = addOnQuantities[addOnId] || 1;
                    return (
                      <div key={addOnId} className="flex justify-between text-sm">
                        <span>{addOn?.name} (x{quantity})</span>
                        <span>${(addOn?.price || 0) * quantity}/mo</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total Monthly</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 