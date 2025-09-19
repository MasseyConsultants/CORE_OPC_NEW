/**
 * Main shipping calculator component
 */

import React from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { useAuthStore } from '../../store/useAuthStore';
import apiService from '../../services/api';

const ShippingCalculator: React.FC = () => {
  const {
    selectedProducts,
    destinationZip,
    originZip,
    serviceLevel,
    calculation,
    loading,
    error,
    setDestinationZip,
    setOriginZip,
    setServiceLevel,
    setCalculation,
    setLoading,
    setError,
    clearError
  } = useCalculatorStore();

  const { user } = useAuthStore();

  // Removed unused loadBoxes function

  const calculateShipping = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }

    if (!destinationZip) {
      setError('Please enter destination ZIP code');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      clearError();

      // Convert selected products to API format
      const items = selectedProducts.map(product => ({
        id: product.id.toString(),
        name: product.name,
        length: product.length,
        width: product.width,
        height: product.height,
        weight: product.weight,
        quantity: (product as any).quantity || 1
      }));

      // Call the enhanced calculation API
      const result = await apiService.calculateShipping({
        items,
        destination_zip: destinationZip,
        service_level: serviceLevel.toLowerCase(),
        origin_zip: originZip || '60540',
        customer_id: user.customerId
      });

      setCalculation(result);
    } catch (error: any) {
      setError(error.response?.data?.detail || error.message || 'Failed to calculate shipping');
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = selectedProducts.reduce((sum, product) => {
    const quantity = (product as any).quantity || 1;
    return sum + (product.weight * quantity);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Shipping Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origin ZIP Code
            </label>
            <input
              type="text"
              value={originZip}
              onChange={(e) => setOriginZip(e.target.value)}
              placeholder="60540"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination ZIP Code *
            </label>
            <input
              type="text"
              value={destinationZip}
              onChange={(e) => setDestinationZip(e.target.value)}
              placeholder="Enter ZIP code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Level
            </label>
            <select
              value={serviceLevel}
              onChange={(e) => setServiceLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Ground">Ground</option>
              <option value="TwoDay">2-Day</option>
              <option value="StandardOvernight">Standard Overnight</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Selected Products</h3>
          
          <div className="space-y-2">
            {selectedProducts.map((product) => {
              const quantity = (product as any).quantity || 1;
              return (
                <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({product.sku})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Qty: {quantity} • {product.weight * quantity} lbs
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-lg font-medium">
              <span>Total Weight:</span>
              <span>{totalWeight.toFixed(2)} lbs</span>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center">
        <button
          onClick={calculateShipping}
          disabled={loading || selectedProducts.length === 0 || !destinationZip}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
        >
          <span>{loading ? '⏳' : '🚀'}</span>
          <span>{loading ? 'Calculating...' : 'Calculate Shipping'}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Calculation Results */}
      {calculation && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{calculation.total_boxes}</div>
                <div className="text-sm text-blue-800">Boxes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{calculation.total_weight.toFixed(1)}</div>
                <div className="text-sm text-green-800">Total Weight (lbs)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{calculation.overall_efficiency.toFixed(1)}%</div>
                <div className="text-sm text-purple-800">Efficiency</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">${calculation.cost_breakdown.total_cost.toFixed(2)}</div>
                <div className="text-sm text-orange-800">Total Cost</div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span>${calculation.cost_breakdown.base_rate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Rate:</span>
                  <span>${calculation.cost_breakdown.material_rate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessories:</span>
                  <span>${calculation.cost_breakdown.accessories.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Total Cost:</span>
                  <span>${calculation.cost_breakdown.total_cost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Packed Boxes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Packed Boxes</h4>
            <div className="space-y-4">
              {calculation.packed_boxes.map((packedBox, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900">{packedBox.box.name}</h5>
                      <p className="text-sm text-gray-600">
                        {packedBox.box.length}" × {packedBox.box.width}" × {packedBox.box.height}"
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-600">Utilization: {packedBox.utilization.toFixed(1)}%</div>
                      <div className="text-gray-600">Weight: {packedBox.total_weight.toFixed(1)} lbs</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {packedBox.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.item_name} (×{item.quantity})</span>
                        <span>{item.dimensions} • {item.weight.toFixed(1)} lbs</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {calculation.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">Recommendations</h4>
              <div className="space-y-3">
                {calculation.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800">{rec.message}</div>
                    {rec.suggested_products && rec.suggested_products.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm text-yellow-700 mb-2">Suggested products:</div>
                        <div className="space-y-1">
                          {rec.suggested_products.map((product, prodIndex) => (
                            <div key={prodIndex} className="text-sm text-yellow-600">
                              • {product.name} ({product.sku}) - {product.dimensions}, {product.weight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;
