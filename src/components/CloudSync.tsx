import React, { useState } from 'react';
import { CloudOff, CloudDrizzle, Check } from 'lucide-react';

export function CloudSync() {
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setLastSync(new Date().toISOString());
      setSyncing(false);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Cloud Synchronization</h2>
            {lastSync ? (
              <div className="flex items-center text-green-500">
                <Check size={20} className="mr-2" />
                <span>Synced</span>
              </div>
            ) : (
              <div className="flex items-center text-yellow-500">
                <CloudOff size={20} className="mr-2" />
                <span>Not synced</span>
              </div>
            )}
          </div>

          {lastSync && (
            <p className="text-gray-600 mb-6">
              Last synchronized: {new Date(lastSync).toLocaleString()}
            </p>
          )}

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-300"
          >
            {syncing ? (
              <>
                <CloudDrizzle size={20} className="animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <CloudDrizzle size={20} />
                <span>Sync Now</span>
              </>
            )}
          </button>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Sync Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Auto-sync daily</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Sync on startup</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Sync inventory changes immediately</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}