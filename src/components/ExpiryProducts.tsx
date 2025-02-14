import React from 'react';
import { AlertCircle } from 'lucide-react';
import { addDays, isWithinInterval } from 'date-fns';
import type { Product } from '../types';

interface ExpiryProductsProps {
  products: Product[];
}

export function ExpiryProducts({ products }: ExpiryProductsProps) {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);

  const expiringProducts = products.filter(product => 
    isWithinInterval(new Date(product.expiry_date), {
      start: now,
      end: thirtyDaysFromNow
    })
  );

  return (
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <AlertCircle className="text-yellow-500" size={24} />
        <h2 className="text-2xl font-bold">Products Expiring Soon</h2>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b bg-yellow-50">
          <p className="text-yellow-800">
            Showing products that will expire in the next 30 days
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Specifics</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Purchase Price</th>
              <th className="px-4 py-3 text-right">MRP</th>
              <th className="px-4 py-3 text-center">Expiry Date</th>
              <th className="px-4 py-3 text-center">Days Until Expiry</th>
            </tr>
          </thead>
          <tbody>
            {expiringProducts.map((product) => {
              const daysUntilExpiry = Math.ceil(
                (new Date(product.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.specifics}</td>
                  <td className="px-4 py-3 text-right">{product.quantity}</td>
                  <td className="px-4 py-3 text-right">₹{product.purchase_price}</td>
                  <td className="px-4 py-3 text-right">₹{product.mrp}</td>
                  <td className="px-4 py-3 text-center">
                    {new Date(product.expiry_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                      ${daysUntilExpiry <= 7 ? 'bg-red-100 text-red-800' :
                        daysUntilExpiry <= 14 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {daysUntilExpiry} days
                    </span>
                  </td>
                </tr>
              );
            })}
            {expiringProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No products are expiring in the next 30 days
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}