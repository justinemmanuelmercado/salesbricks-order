import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useOrder } from '@/contexts/useOrder';

const contractTermsSchema = z.object({
  startDate: z.string().min(1, 'Start date is required').refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Please enter a valid date'),
  contractPeriod: z.string().min(1, 'Contract period is required'),
  customDuration: z.coerce.number().min(1, 'Custom duration must be at least 1 month').optional(),
}).refine((data) => {
  if (data.contractPeriod === 'custom') {
    return data.customDuration !== undefined && data.customDuration >= 1;
  }
  return true;
}, {
  message: 'Custom duration must be at least 1 month',
  path: ['customDuration'],
});

type ContractTermsFormData = z.infer<typeof contractTermsSchema>;

interface Stage3ContractTermsProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const Stage3ContractTerms: React.FC<Stage3ContractTermsProps> = ({ onNext, onPrevious }) => {
  const { order, updateOrder } = useOrder();

  const getInitialContractPeriod = () => {
    if (!order.contractPeriodInMonths) return '';
    const months = order.contractPeriodInMonths;
    if ([6, 12, 24, 36].includes(months)) {
      return months.toString();
    }
    return 'custom';
  };

  const getInitialCustomDuration = () => {
    if (!order.contractPeriodInMonths) return undefined;
    const months = order.contractPeriodInMonths;
    if (![6, 12, 24, 36].includes(months)) {
      return months;
    }
    return undefined;
  };

  const methods = useForm<ContractTermsFormData>({
    resolver: zodResolver(contractTermsSchema),
    defaultValues: {
      startDate: order.startDate || '',
      contractPeriod: getInitialContractPeriod(),
      customDuration: getInitialCustomDuration(),
    },
  });

  const { handleSubmit, watch } = methods;
  const startDate = watch('startDate');
  const contractPeriod = watch('contractPeriod');
  const customDuration = watch('customDuration');

  const calculateEndDate = (start: string, months: number): string => {
    if (!start || months <= 0) return '';
    
    try {
      const startDateObj = new Date(start);
      if (isNaN(startDateObj.getTime())) return '';
      
      const endDateObj = new Date(startDateObj);
      endDateObj.setMonth(endDateObj.getMonth() + months);
      endDateObj.setDate(endDateObj.getDate() - 1);
      
      return endDateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const getCurrentMonths = (): number => {
    if (contractPeriod === 'custom') {
      return customDuration || 0;
    } else if (contractPeriod) {
      const parsed = parseInt(contractPeriod);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const getCurrentEndDate = (): string => {
    const months = getCurrentMonths();
    return calculateEndDate(startDate, months);
  };

  const onSubmit = (data: ContractTermsFormData) => {
    const months = data.contractPeriod === 'custom' 
      ? data.customDuration || 0 
      : parseInt(data.contractPeriod);
    const endDate = calculateEndDate(data.startDate, months);
    
    updateOrder({
      startDate: data.startDate,
      contractPeriodInMonths: months,
      endDate,
    });
    
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contract Terms</CardTitle>
        <CardDescription>
          Define the contract start date and duration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={methods.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="contractPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Period *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {contractPeriod === 'custom' && (
              <FormField
                control={methods.control}
                name="customDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Duration (months) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Enter number of months"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : parseInt(value) || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  value={getCurrentEndDate()} 
                  readOnly 
                  className="bg-gray-50 cursor-not-allowed"
                  tabIndex={-1}
                />
              </FormControl>
              <p className="text-sm text-gray-600">
                Automatically calculated based on start date and contract period
              </p>
            </FormItem>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onPrevious}>
                Previous: Product Selection
              </Button>
              <Button type="submit">
                Next: Review & Finalize
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}; 