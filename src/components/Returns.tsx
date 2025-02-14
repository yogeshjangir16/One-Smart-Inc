import React, { useState, useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Product, ReturnProduct } from '../types';

interface ReturnsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function Returns({ products, setProducts }: ReturnsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [returns, setReturns] = useState<ReturnProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [actualMoneyReturn, setActualMoneyReturn] = useState<number>(0);

  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.specifics.toLowerCase().includes(searchLower)
    );
  }, [products, searchTerm]);

  const handleReturn = () => {
    if (!selectedProduct || !returnReason) {
      toast.error('Please provide all return details');
      return;
    }

    const maxReturnAmount = selectedProduct.purchasePrice * (1 - selectedProduct.discount / 100);
    
    if (actualMoneyReturn > maxReturnAmount) {
      toast.error(`Return amount cannot exceed ₹${maxReturnAmount}`);
      return;
    }

    const newReturn: ReturnProduct = {
      ...selectedProduct,
      returnDate: new Date().toISOString(),
      actualMoneyReceived: actualMoneyReturn,
      returnReason,
    };
    
    setReturns([...returns, newReturn]);
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    
    // Reset form
    setSelectedProduct(null);
    setReturnReason('');
    setActualMoneyReturn(0);
    setSearchTerm('');
    
    toast.success('Product return processed successfully');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Returns Management</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products to return..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            {searchTerm && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-white rounded-lg shadow-lg">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm('');
                      setActualMoneyReturn(product.purchasePrice * (1 - product.discount / 100));
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      {product.specifics}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-4">Return Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <div className="font-medium">{selectedProduct.name}</div>
                  <div className="text-sm text-gray-600">{selectedProduct.specifics}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Purchase Price</label>
                  <div>₹{selectedProduct.purchasePrice}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Return Reason</label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Return Amount</label>
                  <input
                    type="number"
                    value={actualMoneyReturn}
                    onChange={(e) => setActualMoneyReturn(Number(e.target.value))}
                    max={selectedProduct.purchasePrice * (1 - selectedProduct.discount / 100)}
                    step="0.01"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum return amount: ₹{(selectedProduct.purchasePrice * (1 - selectedProduct.discount / 100)).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleReturn}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Process Return
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-bold">Return History</h3>
          </div>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Return Date</th>
                  <th className="px-4 py-3 text-right">Original Price</th>
                  <th className="px-4 py-3 text-right">Return Amount</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.specifics}</div>
                      <div className="text-sm text-gray-500 mt-1">{item.returnReason}</div>
                    </td>
                    <td className="px-4 py-3">{new Date(item.returnDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">₹{item.purchasePrice}</td>
                    <td className="px-4 py-3 text-right">₹{item.actualMoneyReceived}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}