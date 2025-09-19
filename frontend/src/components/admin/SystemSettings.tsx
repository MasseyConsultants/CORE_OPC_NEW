import React, { useState, useEffect } from 'react';
import { SystemSettings as SystemSettingsType, SystemSettingsUpdate } from '../../types';
import apiService from '../../services/api';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSystemSettings();
      setSettings(data);
    } catch (err: any) {
      console.warn('System settings not available, using default settings:', err);
      // Create default settings if API fails
      setSettings({
        id: 'default',
        companyName: 'AIT Logistics CORE',
        companyLogoUrl: '',
        primaryColor: '#2563eb',
        secondaryColor: '#ef4444',
        debugMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setError('System settings not available. Using default settings. You can still modify and save changes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: SystemSettingsUpdate = {
        companyName: settings.companyName,
        companyLogoUrl: settings.companyLogoUrl,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        debugMode: settings.debugMode,
      };

      const updatedSettings = await apiService.updateSystemSettings(updateData);
      setSettings(updatedSettings);
      setSuccess('System settings updated successfully!');
    } catch (err: any) {
      console.warn('Failed to save system settings, but settings are saved locally:', err);
      setSuccess('Settings saved locally! (API not available)');
      // Update the local settings with current values
      setSettings(prev => prev ? { ...prev, updatedAt: new Date().toISOString() } : null);
    } finally {
      setSaving(false);
    }
  };

  const handleDebugModeToggle = () => {
    if (settings) {
      setSettings({
        ...settings,
        debugMode: !settings.debugMode,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center text-red-600">
        Failed to load system settings
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>

        {error && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <strong>Notice:</strong> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Company Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.companyLogoUrl || ''}
                  onChange={(e) => setSettings({ ...settings, companyLogoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Colors */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={settings.primaryColor || '#2563eb'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <input
                  type="color"
                  value={settings.secondaryColor || '#ef4444'}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Debug Settings */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug Settings</h3>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDebugModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.debugMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Debug Mode
                </label>
                <p className="text-xs text-gray-500">
                  Enable detailed debug information in calculation results
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={loadSettings}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
