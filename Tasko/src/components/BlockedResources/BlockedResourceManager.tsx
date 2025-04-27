import React, { useState, useEffect } from 'react';
import { Plus, X, Focus, Focus as FocusOff, AlertCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlockedSite {
  url: string;
  name: string;
}

interface BlockedResourcesState {
  sites: BlockedSite[];
  isTaskActive: boolean;
}

const isExtensionEnvironment = () => {
  return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
};

const BlockedResourceManager: React.FC = () => {
  const [newSite, setNewSite] = useState({ url: '', name: '' });
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtension, setIsExtension] = useState(false);

  useEffect(() => {
    const extensionAvailable = isExtensionEnvironment();
    setIsExtension(extensionAvailable);

    if (extensionAvailable) {
      // Load initial state from chrome.storage.sync
      chrome.storage.sync.get(['sites', 'isTaskActive'], (result) => {
        if (result.sites) {
          setBlockedSites(result.sites);
        }
        if (typeof result.isTaskActive === 'boolean') {
          setIsTaskActive(result.isTaskActive);
        }
      });
    }
  }, []);

  const validateUrl = (url: string): boolean => {
    try {
      const urlToTest = url.startsWith('http') ? url : `http://${url}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddSite = () => {
    setError(null);
    
    if (!newSite.url.trim() || !newSite.name.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateUrl(newSite.url)) {
      setError('Invalid URL');
      return;
    }

    const formattedUrl = newSite.url.toLowerCase().trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    if (blockedSites.some(site => site.url === formattedUrl)) {
      setError('This site is already in the list');
      return;
    }

    const updatedSites = [...blockedSites, { url: formattedUrl, name: newSite.name.trim() }];
    setBlockedSites(updatedSites);
    
    if (isExtension) {
      // Save to chrome.storage.sync
      chrome.storage.sync.set({ sites: updatedSites }, () => {
        if (chrome.runtime.lastError) {
          toast.error('Error saving site');
          console.error(chrome.runtime.lastError);
        } else {
          toast.success('Site added successfully');
          setNewSite({ url: '', name: '' });
        }
      });
    } else {
      toast.success('Site added successfully');
      setNewSite({ url: '', name: '' });
    }
  };

  const handleRemoveSite = (url: string) => {
    const updatedSites = blockedSites.filter(site => site.url !== url);
    setBlockedSites(updatedSites);
    
    if (isExtension) {
      chrome.storage.sync.set({ sites: updatedSites }, () => {
        if (chrome.runtime.lastError) {
          toast.error('Error removing site');
          console.error(chrome.runtime.lastError);
        } else {
          toast.success('Site removed successfully');
        }
      });
    } else {
      toast.success('Site removed successfully');
    }
  };

  const toggleFocusMode = () => {
    const newState: BlockedResourcesState = {
      sites: blockedSites,
      isTaskActive: !isTaskActive
    };

    if (isExtension) {
      chrome.storage.sync.set(newState, () => {
        if (chrome.runtime.lastError) {
          toast.error('Error changing mode');
          console.error(chrome.runtime.lastError);
        } else {
          setIsTaskActive(!isTaskActive);
          toast.success(isTaskActive ? 'Focus mode disabled' : 'Focus mode enabled');
          
          // Notify extension of state change
          chrome.runtime.sendMessage({
            type: 'UPDATE_BLOCKED_SITES',
            sites: blockedSites,
            isActive: !isTaskActive
          });
        }
      });
    } else {
      setIsTaskActive(!isTaskActive);
      toast.success(isTaskActive ? 'Focus mode disabled' : 'Focus mode enabled');
    }
  };

  if (!isExtension) {
    return (
      <div className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-lg font-medium mb-2">Extension Not Detected</p>
          <p>The Focus Mode feature requires the Chrome extension to be installed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
          Focus Mode
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Block distracting sites during your work sessions
        </p>
      </div>

      <div className="space-y-6">
        {/* Add form */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={newSite.name}
              onChange={(e) => setNewSite(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Site name (e.g., YouTube)"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-dark-700 
                border border-gray-300 dark:border-dark-600 rounded-xl
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSite.url}
              onChange={(e) => setNewSite(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Site URL (e.g., youtube.com)"
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-dark-700 
                border border-gray-300 dark:border-dark-600 rounded-xl
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
            />
            <button
              onClick={handleAddSite}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-xl
                hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors
                flex items-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {error && (
            <div className="flex items-center text-red-500 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}
        </div>

        {/* Blocked sites list */}
        <div className="space-y-2">
          {blockedSites.map((site, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl"
            >
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {site.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {site.url}
                </div>
              </div>
              <button
                onClick={() => handleRemoveSite(site.url)}
                className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 
                  dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-600 rounded-lg
                  transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleFocusMode}
          className={`w-full py-3 px-4 rounded-xl font-medium
            flex items-center justify-center space-x-2
            transition-colors ${
              isTaskActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          {isTaskActive ? (
            <>
              <FocusOff className="w-5 h-5" />
              <span>Disable focus</span>
            </>
          ) : (
            <>
              <Focus className="w-5 h-5" />
              <span>Enable focus</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BlockedResourceManager;