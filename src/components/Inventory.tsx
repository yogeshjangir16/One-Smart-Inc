import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from "../lib/supabase"; // If it's in `src/lib/supabase.ts`



interface Product {
  id: string;
  name: string;
  specifics: string;
  purchase_date: string;
  quantity: number;
  purchase_price: number;
  discount: number;
  mrp: number;
  expiry_date: string;
  user_id?: string; // Include user_id for security
}

export function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products for the authenticated user
  useEffect(() => {
    const fetchProducts = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id); // Ensure only fetching the user's products

      if (error) console.error('Error fetching products:', error);
      else setProducts(data || []);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('User not authenticated');
      setLoading(false);
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      specifics: formData.get('specifics') as string,
      purchase_date: formData.get('purchase_date') as string,
      quantity: Number(formData.get('quantity')),
      purchase_price: Number(formData.get('purchase_price')),
      discount: Number(formData.get('discount')),
      mrp: Number(formData.get('mrp')),
      expiry_date: formData.get('expiry_date') as string,
      user_id: user.id, // ✅ Include user_id for Supabase RLS policies
    };

    const { error } = await supabase.from('products').insert([newProduct]);

    if (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } else {
      alert('Product added successfully!');
      setProducts([...products, newProduct]); // Update state
    }

    setLoading(false);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Add New Product</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input name="name" required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specifics</label>
                <input name="specifics" required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Date</label>
                <input type="date" name="purchase_date" required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" name="quantity" required min="0" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Price</label>
                <input type="number" name="purchase_price" required min="0" step="0.01" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input type="number" name="discount" required min="0" max="100" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">MRP</label>
                <input type="number" name="mrp" required min="0" step="0.01" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input type="date" name="expiry_date" required className="w-full border rounded-lg px-3 py-2" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Specifics</th>
              <th className="px-4 py-3 text-left">Purchase Date</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Purchase Price</th>
              <th className="px-4 py-3 text-right">MRP</th>
              <th className="px-4 py-3 text-left">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.specifics}</td>
                <td className="px-4 py-3">{new Date(product.purchase_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">{product.quantity}</td>
                <td className="px-4 py-3 text-right">₹{product.purchase_price}</td>
                <td className="px-4 py-3 text-right">₹{product.mrp}</td>
                <td className="px-4 py-3">{new Date(product.expiry_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
