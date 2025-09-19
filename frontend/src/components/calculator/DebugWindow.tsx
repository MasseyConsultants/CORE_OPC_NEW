import React, { useState } from 'react';
import { DebugInfo } from '../../types';

interface DebugWindowProps {
  debugInfo: DebugInfo;
  isOpen: boolean;
  onClose: () => void;
}

const DebugWindow: React.FC<DebugWindowProps> = ({ debugInfo, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'algorithm' | 'cost' | 'timing'>('steps');

  if (!isOpen) return null;

  const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderSteps = () => (
    <div className="space-y-4">
      {debugInfo.steps.map((step, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">
              Step {step.step}: {step.name}
            </h4>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              step.status === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {step.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{step.details}</p>
          {Object.keys(step).filter(key => !['step', 'name', 'status', 'details'].includes(key)).map(key => (
            <div key={key} className="mt-2">
              <span className="text-xs font-medium text-gray-500 uppercase">{key}:</span>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                {formatValue(step[key])}
              </pre>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderAlgorithm = () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Strategy Attempts</h4>
        {debugInfo.algorithm_debug.strategy_attempts.map((attempt, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <span className="font-medium">{attempt.strategy}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                attempt.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {attempt.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Boxes used: {attempt.boxes_used} | Overflow items: {attempt.overflow_items}
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Final Selection</h4>
        <div className="text-sm text-gray-600">
          Selected strategy: <span className="font-medium">{debugInfo.algorithm_debug.final_selection.strategy}</span>
        </div>
      </div>

      {debugInfo.algorithm_debug.box_evaluations.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Box Evaluations</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {formatValue(debugInfo.algorithm_debug.box_evaluations)}
          </pre>
        </div>
      )}

      {debugInfo.algorithm_debug.item_placements.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Item Placements</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {formatValue(debugInfo.algorithm_debug.item_placements)}
          </pre>
        </div>
      )}
    </div>
  );

  const renderCost = () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Cost Calculation Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Zone:</span>
            <p className="text-lg font-semibold">{debugInfo.cost_calculation.zone}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Base Rate:</span>
            <p className="text-lg font-semibold">${debugInfo.cost_calculation.base_rate.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Material Rate:</span>
            <p className="text-lg font-semibold">${debugInfo.cost_calculation.material_rate.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Accessories Rate:</span>
            <p className="text-lg font-semibold">${debugInfo.cost_calculation.accessories_rate.toFixed(2)}</p>
          </div>
          <div className="col-span-2 border-t pt-3">
            <span className="text-sm font-medium text-gray-500">Total Cost:</span>
            <p className="text-xl font-bold text-blue-600">${debugInfo.cost_calculation.total_cost.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTiming = () => (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {formatValue(debugInfo.timing)}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">3D Packing Algorithm Debug Information</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: 'steps', label: 'Processing Steps' },
            { key: 'algorithm', label: 'Algorithm Details' },
            { key: 'cost', label: 'Cost Calculation' },
            { key: 'timing', label: 'Performance' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'steps' && renderSteps()}
          {activeTab === 'algorithm' && renderAlgorithm()}
          {activeTab === 'cost' && renderCost()}
          {activeTab === 'timing' && renderTiming()}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugWindow;
