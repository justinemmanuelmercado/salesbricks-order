import React from 'react';
import { OrderProvider } from './contexts/OrderContext';
import { OrderBuilder } from './components/OrderBuilder';
import './App.css';

function App() {
  return (
    <OrderProvider>
      <div className="App">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Salesbricks Order Builder
            </h1>
          </div>
        </header>
        <main>
          <OrderBuilder />
        </main>
      </div>
    </OrderProvider>
  );
}

export default App;
