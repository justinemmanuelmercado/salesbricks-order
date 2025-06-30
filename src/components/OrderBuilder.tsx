import React from 'react';
import { useOrder } from '@/contexts/useOrder';
import { Stage1CustomerInfo } from './stages/Stage1CustomerInfo';
import { Stage2ProductSelection } from './stages/Stage2ProductSelection';
import { Stage3ContractTerms } from './stages/Stage3ContractTerms';

export const OrderBuilder: React.FC = () => {
  const { currentStage, setCurrentStage } = useOrder();

  const { order } = useOrder();

  const handleNext = () => {
    console.log('order', order);
    setCurrentStage(currentStage + 1);
  };

  const handlePrevious = () => {
    setCurrentStage(currentStage - 1);
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1CustomerInfo onNext={handleNext} />;
      case 2:
        return <Stage2ProductSelection onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <Stage3ContractTerms onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold">Stage 4: Review & Finalize</h2>
            <p className="text-gray-600 mt-2">Coming soon...</p>
            <button 
              onClick={handlePrevious}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Contract Terms
            </button>
          </div>
        );
      default:
        return <Stage1CustomerInfo onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <nav className="flex space-x-4">
            <div className={`px-3 py-1 rounded ${currentStage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              1. Customer Information
            </div>
            <div className={`px-3 py-1 rounded ${currentStage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              2. Product Selection
            </div>
            <div className={`px-3 py-1 rounded ${currentStage === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              3. Contract Terms
            </div>
            <div className={`px-3 py-1 rounded ${currentStage === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              4. Review & Finalize
            </div>
          </nav>
        </div>

        {renderStage()}
      </div>
    </div>
  );
}; 