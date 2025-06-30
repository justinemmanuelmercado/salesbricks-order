import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useOrder } from '@/contexts/useOrder';
import { US_STATES } from '@/constants/states';

const customerInfoSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  prePopulateCustomerInformation: z.boolean(),
  customerAddress: z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
  }).optional(),
}).refine((data) => {
  if (data.prePopulateCustomerInformation) {
    return data.customerAddress !== undefined;
  }
  return true;
}, {
  message: 'Address information is required when prepopulate is checked',
  path: ['customerAddress'],
});

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

interface Stage1CustomerInfoProps {
  onNext: () => void;
}

export const Stage1CustomerInfo: React.FC<Stage1CustomerInfoProps> = ({ onNext }) => {
  const { order, updateOrder } = useOrder();
  
  const methods = useForm<CustomerInfoFormData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      customerName: order.customerName,
      prePopulateCustomerInformation: !!order.customerAddress,
      customerAddress: order.customerAddress || {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  const { handleSubmit, watch } = methods;
  const prePopulateCustomerInformation = watch('prePopulateCustomerInformation');

  const onSubmit = (data: CustomerInfoFormData) => {
    updateOrder({
      customerName: data.customerName,
      customerAddress: data.prePopulateCustomerInformation ? data.customerAddress : undefined,
    });
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
        <CardDescription>
          Enter the customer details for this order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={methods.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="prePopulateCustomerInformation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Pre-populate customer information
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {prePopulateCustomerInformation && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium">Customer Address</h3>
                
                <FormField
                  control={methods.control}
                  name="customerAddress.addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1 *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="customerAddress.addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2 (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="customerAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name="customerAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={methods.control}
                  name="customerAddress.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">
                Next: Product Selection
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}; 