import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useOrder } from '@/contexts/useOrder';
import { PRODUCTS } from '@/data/products';
import type { Product, Plan } from '@/types/order';

const productSelectionSchema = z.object({
  productLineId: z.string().min(1, 'Product line is required'),
  selectedPlanId: z.string().min(1, 'Plan selection is required'),
  customPlanPrice: z.number().optional(),
});

type ProductSelectionFormData = z.infer<typeof productSelectionSchema>;

interface Stage2ProductSelectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const Stage2ProductSelection: React.FC<Stage2ProductSelectionProps> = ({ onNext, onPrevious }) => {
  const { order, updateOrder } = useOrder();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingPriceForPlan, setEditingPriceForPlan] = useState<string | null>(null);
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});

  const methods = useForm<ProductSelectionFormData>({
    resolver: zodResolver(productSelectionSchema),
    defaultValues: {
      productLineId: '',
      selectedPlanId: order.selectedPlanId || '',
      customPlanPrice: order.customPlanPrice || undefined,
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const productLineId = watch('productLineId');
  const selectedPlanId = watch('selectedPlanId');

  useEffect(() => {
    if (productLineId) {
      const product = PRODUCTS.find(p => p.id === productLineId);
      setSelectedProduct(product || null);
      setValue('selectedPlanId', '');
      setCustomPrices({});
    }
  }, [productLineId, setValue]);

  useEffect(() => {
    if (selectedPlanId && selectedProduct) {
      const plan = selectedProduct.plans.find(p => p.id === selectedPlanId);
      if (plan && customPrices[selectedPlanId]) {
        setValue('customPlanPrice', customPrices[selectedPlanId]);
      } else if (plan) {
        setValue('customPlanPrice', plan.defaultPrice);
      }
    }
  }, [selectedPlanId, selectedProduct, customPrices, setValue]);

  const handleEditPrice = (planId: string) => {
    setEditingPriceForPlan(planId);
  };

  const handlePriceChange = (planId: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (!isNaN(price)) {
      setCustomPrices(prev => ({ ...prev, [planId]: price }));
      if (planId === selectedPlanId) {
        setValue('customPlanPrice', price);
      }
    }
  };

  const handlePriceBlur = () => {
    setEditingPriceForPlan(null);
  };

  const onSubmit = (data: ProductSelectionFormData) => {
    updateOrder({
      selectedPlanId: data.selectedPlanId,
      customPlanPrice: data.customPlanPrice || null,
    });
    onNext();
  };

  const getDisplayPrice = (plan: Plan): number => {
    if (customPrices[plan.id]) {
      return customPrices[plan.id];
    }
    return plan.defaultPrice;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Product Selection</CardTitle>
        <CardDescription>
          Choose your product line and plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={methods.control}
              name="productLineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Line *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product line" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCTS.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProduct && (
              <FormField
                control={methods.control}
                name="selectedPlanId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Plan *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid gap-4"
                      >
                        {selectedProduct.plans.map((plan) => (
                          <div key={plan.id} className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div className="flex-1">
                              <label htmlFor={plan.id} className="text-sm font-medium cursor-pointer">
                                {plan.name}
                              </label>
                              <div className="flex items-center gap-2 mt-2">
                                {editingPriceForPlan === plan.id ? (
                                  <Input
                                    type="number"
                                    step="0.01"
                                    defaultValue={getDisplayPrice(plan)}
                                    onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                                    onBlur={handlePriceBlur}
                                    className="w-24"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="text-lg font-semibold">
                                    ${getDisplayPrice(plan)}/{plan.priceInterval}
                                  </span>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPrice(plan.id)}
                                >
                                  Edit price
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onPrevious}>
                Previous: Customer Information
              </Button>
              <Button type="submit" disabled={!selectedPlanId}>
                Next: Contract Terms
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}; 