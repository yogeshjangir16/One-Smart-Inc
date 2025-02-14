import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { addDays, isWithinInterval } from 'date-fns';
import { Sidebar } from './components/Sidebar';
import { Inventory } from './components/Inventory';
import { Billing } from './components/Billing';
import { Returns } from './components/Returns';
import { CloudSync } from './components/CloudSync';
import { ExpiryProducts } from './components/ExpiryProducts';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import type { Product } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProducts();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProducts();
      } else {
        setProducts([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    const now = new Date();
    const thirtyDaysFromNow = addDays(now, 30);
    
    const expiringProducts = products.filter(product => 
      isWithinInterval(new Date(product.expiry_date), {
        start: now,
        end: thirtyDaysFromNow
      })
    );

    if (expiringProducts.length > 0) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white shadow-lg rounded-lg p-4 max-w-md`}>
          <h3 className="font-bold text-red-500 mb-2">Products Expiring Soon!</h3>
          <p className="text-sm text-gray-600">
            {expiringProducts.length} products will expire in the next 30 days.
            Check the expiring products section for details.
          </p>
        </div>
      ));
    }
  }, [products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert([product]);

      if (error) {
        throw error;
      }

      await loadProducts(); // Reload to get the server-generated fields
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const updateProducts = async (updatedProducts: Product[]) => {
    try {
      // First update the UI
      setProducts(updatedProducts);

      // Then sync with Supabase
      const { error } = await supabase
        .from('products')
        .upsert(updatedProducts);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
      // Reload products to ensure consistency
      loadProducts();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'inventory' && (
          <Inventory 
            products={products} 
            onAddProduct={addProduct}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        )}
        {activeTab === 'billing' && (
          <Billing 
            products={products} 
            setProducts={updateProducts} 
          />
        )}
        {activeTab === 'returns' && (
          <Returns 
            products={products} 
            setProducts={updateProducts} 
          />
        )}
        {activeTab === 'expiry' && (
          <ExpiryProducts products={products} />
        )}
        {activeTab === 'sync' && <CloudSync />}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}