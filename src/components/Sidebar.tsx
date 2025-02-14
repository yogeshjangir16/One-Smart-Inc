import React from 'react';
import { Package, ShoppingCart, RotateCcw, Cloud as CloudSync, AlertCircle } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'billing', icon: ShoppingCart, label: 'Billing' },
    { id: 'returns', icon: RotateCcw, label: 'Returns' },
    { id: 'expiry', icon: AlertCircle, label: 'Expiring Products' },
    { id: 'sync', icon: CloudSync, label: 'Cloud Sync' },
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-white text-xl font-bold">Inventory Store System</h1>
      </div>
      <nav className="flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-gray-700 ${
                activeTab === tab.id ? 'bg-gray-700' : ''
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}