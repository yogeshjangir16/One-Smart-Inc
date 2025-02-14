import React, { useState, useMemo } from 'react';
import { Search, Printer, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Product, BillItem, Bill } from '../types';

interface BillingProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export function Billing({ products, setProducts }: BillingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [bills, setBills] = useState<Bill[]>([]);

  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return products.filter(
      product => 
        product.quantity > 0 && 
        (product.name.toLowerCase().includes(searchLower) || 
         product.specifics.toLowerCase().includes(searchLower))
    );
  }, [products, searchTerm]);

  const handleAddItem = (product: Product) => {
    const existingItem = currentBill.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCurrentBill(currentBill.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.error('Not enough quantity in stock!');
      }
    } else {
      setCurrentBill([
        ...currentBill,
        {
          productId: product.id,
          quantity: 1,
          price: product.mrp,
        },
      ]);
    }
    setSearchTerm('');
  };

  const calculateBillTotals = () => {
    const subtotal = currentBill.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.mrp || 0) * item.quantity;
    }, 0);

    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    const profit = currentBill.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return sum + ((product.mrp - product.purchasePrice) * item.quantity);
      }
      return sum;
    }, 0);

    return { subtotal, tax, total, profit };
  };

  const handlePrint = () => {
    const { subtotal, tax, total, profit } = calculateBillTotals();
    const change = paymentAmount - total;

    if (change < 0) {
      toast.error('Insufficient payment amount!');
      return;
    }

    // Update product quantities
    setProducts(products.map(product => {
      const billItem = currentBill.find(item => item.productId === product.id);
      if (billItem) {
        return {
          ...product,
          quantity: product.quantity - billItem.quantity,
        };
      }
      return product;
    }));

    const bill: Bill = {
      id: Date.now().toString(),
      items: currentBill,
      subtotal,
      tax,
      total,
      profit,
      date: new Date().toISOString(),
      paymentMethod,
      paymentReceived: paymentAmount,
      change,
    };

    setBills([...bills, bill]);
    
    // Generate printable bill
    const printContent = `
      One Desktop Solution
      -------------------
      Bill No: ${bill.id}
      Date: ${new Date(bill.date).toLocaleString()}
      
      Items:
      ${bill.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `${product?.name} x${item.quantity} - ₹${item.price * item.quantity}`;
      }).join('\n')}
      
      Subtotal: ₹${bill.subtotal.toFixed(2)}
      GST (18%): ₹${bill.tax.toFixed(2)}
      Total: ₹${bill.total.toFixed(2)}
      
      Payment Method: ${bill.paymentMethod.toUpperCase()}
      Amount Paid: ₹${bill.paymentReceived.toFixed(2)}
      Change: ₹${bill.change.toFixed(2)}
      
      Thank you for shopping with us!
    `;

    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    printFrame.contentDocument?.write(printContent);
    printFrame.contentDocument?.close();
    printFrame.contentWindow?.print();
    document.body.removeChild(printFrame);

    // Reset form
    setCurrentBill([]);
    setPaymentAmount(0);
    setPaymentMethod('cash');
    toast.success('Bill printed successfully!');
  };

  const { subtotal, tax, total } = calculateBillTotals();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddItem(product)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.specifics}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">₹{product.mrp}</div>
                  <div className="text-sm text-gray-600">Stock: {product.quantity}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentBill.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <div className="font-medium">{product?.name}</div>
                        <div className="text-sm text-gray-600">{product?.specifics}</div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={product?.quantity || 1}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            if (product && newQuantity <= product.quantity) {
                              const newBill = [...currentBill];
                              newBill[index].quantity = newQuantity;
                              setCurrentBill(newBill);
                            }
                          }}
                          className="w-20 border rounded px-2 py-1 text-right"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">₹{item.price}</td>
                      <td className="px-4 py-2 text-right">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">Subtotal:</td>
                  <td className="px-4 py-2 text-right">₹{subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">GST (18%):</td>
                  <td className="px-4 py-2 text-right">₹{tax.toFixed(2)}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                  <td className="px-4 py-2 text-right">₹{total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4">Payment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center p-2 rounded-lg border ${
                    paymentMethod === 'cash' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Banknote size={20} className="mr-1" />
                  <span>Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center p-2 rounded-lg border ${
                    paymentMethod === 'card' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <CreditCard size={20} className="mr-1" />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center p-2 rounded-lg border ${
                    paymentMethod === 'upi' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <Smartphone size={20} className="mr-1" />
                  <span>UPI</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Amount
              </label>
              <div className="text-2xl font-bold">
                ₹{total.toFixed(2)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Payment Received
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                min={total}
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            {paymentAmount >= total && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Change
                </label>
                <div className="text-xl font-bold text-green-600">
                  ₹{(paymentAmount - total).toFixed(2)}
                </div>
              </div>
            )}
            <button
              onClick={handlePrint}
              disabled={currentBill.length === 0 || paymentAmount < total}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              <Printer size={20} />
              <span>Print Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}