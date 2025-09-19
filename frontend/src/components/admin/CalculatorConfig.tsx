/**
 * Calculator Configuration component for admins
 */

import React, { useState } from 'react';

const CalculatorConfig: React.FC = () => {
  const [config, setConfig] = useState({
    defaultServiceLevel: 'Ground',
    maxWeightPerBox: 70,
    enableDryIceCalculation: true,
    dryIceWeightPerCubicFoot: 0.5,
    priorityWeightMultiplier: 1.2,
    holdWeightMultiplier: 0.8,
    enable3DVisualization: false,
    defaultOriginZip: '60540',
    calculationTimeout: 30,
    enableCaching: true,
    cacheExpirationHours: 24,
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    console.log('Saving config:', config);
    alert('Configuration saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Calculator Configuration</h1>
        <p className="text-gray-600">
          Configure the 3D Bin Packing Problem calculator parameters and settings.
        </p>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Service Level
              </label>
              <select
                value={config.defaultServiceLevel}
                onChange={(e) => handleConfigChange('defaultServiceLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ground">Ground</option>
                <option value="TwoDay">2-Day</option>
                <option value="StandardOvernight">Standard Overnight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Weight Per Box (lbs)
              </label>
              <input
                type="number"
                value={config.maxWeightPerBox}
                onChange={(e) => handleConfigChange('maxWeightPerBox', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Origin ZIP Code
              </label>
              <input
                type="text"
                value={config.defaultOriginZip}
                onChange={(e) => handleConfigChange('defaultOriginZip', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Dry Ice Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dry Ice Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableDryIce"
                checked={config.enableDryIceCalculation}
                onChange={(e) => handleConfigChange('enableDryIceCalculation', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="enableDryIce" className="ml-2 text-sm text-gray-700">
                Enable Dry Ice Calculation
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dry Ice Weight Per Cubic Foot (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                value={config.dryIceWeightPerCubicFoot}
                onChange={(e) => handleConfigChange('dryIceWeightPerCubicFoot', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Priority Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Weight Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={config.priorityWeightMultiplier}
                onChange={(e) => handleConfigChange('priorityWeightMultiplier', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Higher priority items get this weight multiplier</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hold Weight Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={config.holdWeightMultiplier}
                onChange={(e) => handleConfigChange('holdWeightMultiplier', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Items on hold get this weight multiplier</p>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calculation Timeout (seconds)
              </label>
              <input
                type="number"
                value={config.calculationTimeout}
                onChange={(e) => handleConfigChange('calculationTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableCaching"
                checked={config.enableCaching}
                onChange={(e) => handleConfigChange('enableCaching', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="enableCaching" className="ml-2 text-sm text-gray-700">
                Enable Calculation Caching
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cache Expiration (hours)
              </label>
              <input
                type="number"
                value={config.cacheExpirationHours}
                onChange={(e) => handleConfigChange('cacheExpirationHours', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <span>💾</span>
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

export default CalculatorConfig;
