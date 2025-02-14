import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      console.error('Login Error:', error);
    } else {
      toast.success('Logged in successfully!');
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.error(error.message);
      console.error('Signup Error:', error);
    } else {
      toast.success('Signed up successfully! Check your email for verification.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Inventory Store System
        </h2>
        <p className="text-center text-sm text-gray-600">Sign in to manage your inventory</p>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Email address"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
          />

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-[48%] py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-[48%] py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              {loading ? 'Loading...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
