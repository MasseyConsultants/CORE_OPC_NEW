/**
 * Enhanced Calculator with Step-by-Step Interface
 */

import React, { useState, useEffect } from 'react';
// import { useCalculatorStore } from '../../store/useCalculatorStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Product, EnhancedShippingCalculation, SystemSettings } from '../../types';
import apiService from '../../services/api';
import DebugWindow from './DebugWindow';

interface CartItem {
  product: Product;
  quantity: number;
  totalWeight: number;
  totalVolume: number;
}

const EnhancedCalculator: React.FC = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [destinationZip, setDestinationZip] = useState('');
  const [serviceLevel, setServiceLevel] = useState<'overnight' | 'second_day'>('overnight');
  const [zone, setZone] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [calculation, setCalculation] = useState<EnhancedShippingCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [showDebugWindow, setShowDebugWindow] = useState(false);
  const [debugModeOverride, setDebugModeOverride] = useState<boolean | null>(null);

  // Dry ice specifications
  const dryIceSpecs = {
    overnight: { count: 1, dimensions: { length: 5.75, width: 5.5, height: 1 }, weight: 0.5 },
    second_day: { count: 2, dimensions: { length: 5.75, width: 5.5, height: 1 }, weight: 0.5 }
  };

  useEffect(() => {
    loadProducts();
    // Temporarily disable system settings loading to avoid CORS issues
    // loadSystemSettings();
  }, [user]);

  const loadSystemSettings = async () => {
    try {
      // Only load system settings if user is authenticated
      if (!user) {
        setDebugMode(false);
        return;
      }
      
      const settings = await apiService.getSystemSettings();
      setDebugMode(settings.debugMode);
    } catch (error) {
      console.warn('System settings not available, using default debug mode:', error);
      // Set default debug mode to false if loading fails
      setDebugMode(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      if (!user) return;
      
      console.log('Loading products for user:', user);
      console.log('User customer ID:', user.customerId);
      
      // First try without customer filter to see all products
      const response = await apiService.getProducts({ 
        customer_id: undefined, // Try without customer filter first
        active_only: true,
        size: 100 
      });
      console.log('Products response:', response);
      console.log('Response data:', response.data);
      
      // The backend returns ProductListResponse with structure: { products: [...], total: number, page: number, size: number }
      let productsArray: Product[] = [];
      
      if (response.data && typeof response.data === 'object') {
        // Check for the 'products' property which contains the array
        if ('products' in response.data && Array.isArray((response.data as any).products)) {
          productsArray = (response.data as any).products;
          console.log('Found products array with', productsArray.length, 'items');
        }
        // Fallback: check if response.data is directly an array
        else if (Array.isArray(response.data)) {
          productsArray = response.data;
          console.log('Response data is directly an array with', productsArray.length, 'items');
        }
        // Fallback: look for any array property
        else {
          const dataObj = response.data as any;
          for (const key in dataObj) {
            if (Array.isArray(dataObj[key])) {
              console.log(`Found array in property '${key}' with`, dataObj[key].length, 'items');
              productsArray = dataObj[key];
              break;
            }
          }
        }
      }
      
      if (productsArray.length > 0) {
        setProducts(productsArray);
        console.log('Successfully loaded products:', productsArray.length);
      } else {
        console.log('No products found in database for customer:', user?.customerId);
        setProducts([]);
        setError('No products available for your customer account. Please contact your administrator.');
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products');
      setProducts([]); // Ensure it's always an array
    } finally {
      setProductsLoading(false);
    }
  };

  const handleZipCodeChange = async (zip: string) => {
    setDestinationZip(zip);
    if (zip.length === 5) {
      try {
        const zoneData = await apiService.lookupZone(zip);
        setZone(zoneData.zone);
      } catch (error) {
        console.error('Failed to lookup zone:', error);
        // Fallback to estimation
        const lastThreeDigits = zip.slice(-3);
        const estimatedZone = Math.ceil(parseInt(lastThreeDigits) / 100);
        setZone(estimatedZone);
      }
    }
  };


  const updateQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product.id);
      return;
    }
    
    const existingItem = cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        quantity,
        totalWeight: product.weight * quantity,
        totalVolume: (product.length * product.width * product.height) * quantity
      };
      setCartItems(cartItems.map(item => 
        item.product.id === product.id ? updatedItem : item
      ));
    } else {
      const newItem: CartItem = {
        product,
        quantity,
        totalWeight: product.weight * quantity,
        totalVolume: (product.length * product.width * product.height) * quantity
      };
      setCartItems([...cartItems, newItem]);
    }
  };


  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const calculateShipping = async () => {
    console.log('=== CALCULATION DEBUG START ===');
    console.log('User:', user);
    console.log('Cart items:', cartItems);
    console.log('Destination ZIP:', destinationZip);
    console.log('Service level:', serviceLevel);
    console.log('Zone:', zone);

    if (!user || cartItems.length === 0) {
      console.log('ERROR: No user or cart items');
      setError('Please select at least one product');
      return;
    }

    if (!destinationZip || destinationZip.length !== 5) {
      console.log('ERROR: Invalid ZIP code');
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert cart items to individual items for packing
      const items = [];
      
      console.log('Processing cart items...');
      // Add regular products
      cartItems.forEach((cartItem, cartIndex) => {
        console.log(`Processing cart item ${cartIndex}:`, cartItem);
        for (let i = 0; i < cartItem.quantity; i++) {
          const item = {
            id: `${cartItem.product.id}-${i}`,
            name: cartItem.product.name,
            length: cartItem.product.length,
            width: cartItem.product.width,
            height: cartItem.product.height,
            weight: cartItem.product.weight,
            quantity: 1
          };
          console.log(`Adding product item ${i}:`, item);
          items.push(item);
        }
      });

      // Add dry ice packs
      const dryIce = dryIceSpecs[serviceLevel];
      console.log('Adding dry ice packs:', dryIce);
      for (let i = 0; i < dryIce.count; i++) {
        const dryIceItem = {
          id: `dry-ice-${i}`,
          name: `Dry Ice Pack ${i + 1}`,
          length: dryIce.dimensions.length,
          width: dryIce.dimensions.width,
          height: dryIce.dimensions.height,
          weight: dryIce.weight,
          quantity: 1
        };
        console.log(`Adding dry ice item ${i}:`, dryIceItem);
        items.push(dryIceItem);
      }

      console.log('Final items array:', items);
      console.log('Total items count:', items.length);

      // Prepare the request payload
      const requestPayload = {
        items,
        destination_zip: destinationZip,
        service_level: serviceLevel,
        origin_zip: '60540', // Default Tyson origin
        customer_id: user.customerId
      };

      console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

      // Call the enhanced calculation API
      console.log('Calling apiService.calculateShipping...');
      // Use debug mode override if available, otherwise use system settings
      const debugModeForCalculation = debugModeOverride !== null ? debugModeOverride : debugMode;
      console.log('Debug mode for calculation:', debugModeForCalculation);
      const result = await apiService.calculateShipping(requestPayload);
      console.log('API response received:', result);

      setCalculation(result);
      setCurrentStep(5); // Go to results step
      console.log('=== CALCULATION DEBUG END - SUCCESS ===');
    } catch (error: any) {
      console.log('=== CALCULATION DEBUG END - ERROR ===');
      console.error('Calculation error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to calculate shipping';
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = cartItems.reduce((sum, item) => sum + item.totalWeight, 0);
  // const totalVolume = cartItems.reduce((sum, item) => sum + item.totalVolume, 0);
  const dryIceWeight = dryIceSpecs[serviceLevel].count * dryIceSpecs[serviceLevel].weight;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 5 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Destination</span>
          <span>Products</span>
          <span>Review</span>
          <span>Calculate</span>
          <span>Results</span>
        </div>
      </div>

      {/* Step 1: Destination & Service */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 1: Destination & Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination ZIP Code
              </label>
              <input
                type="text"
                value={destinationZip}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                placeholder="Enter 5-digit ZIP code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={5}
              />
              {zone && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Zone {zone} detected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Level
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="overnight"
                    checked={serviceLevel === 'overnight'}
                    onChange={(e) => setServiceLevel(e.target.value as 'overnight')}
                    className="mr-2"
                  />
                  <span>Overnight (1 dry ice pack)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="second_day"
                    checked={serviceLevel === 'second_day'}
                    onChange={(e) => setServiceLevel(e.target.value as 'second_day')}
                    className="mr-2"
                  />
                  <span>2nd Day (2 dry ice packs)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!destinationZip || destinationZip.length !== 5}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next: Select Products
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Product Selection */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 2: Select Products</h2>
            
            {/* Loading State */}
            {productsLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={loadProducts}
                  className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!productsLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {Array.isArray(products) && products.length > 0 ? products.map((product) => {
                  const cartItem = cartItems.find(item => item.product.id === product.id);
                  const quantity = cartItem?.quantity || 0;
                  
                  return (
                    <div key={product.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 font-mono">SKU: {product.sku}</p>
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 font-medium mb-1">Dimensions</p>
                          <p className="text-sm text-gray-600">
                            {product.length}" × {product.width}" × {product.height}"
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Weight: {product.weight} lbs
                          </p>
                        </div>
                      </div>
                      
                      {/* Quantity Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(product, Math.max(0, quantity - 1))}
                            disabled={quantity === 0}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-medium"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product, quantity + 1)}
                            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      {quantity > 0 ? (
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                        >
                          Remove from Selection
                        </button>
                      ) : (
                        <button
                          onClick={() => updateQuantity(product, 1)}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                        >
                          Add to Selection
                        </button>
                      )}
                    </div>
                  );
                }) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>No products available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.product.name}</h4>
                        <p className="text-sm text-gray-500 font-mono mb-2">SKU: {item.product.sku}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dimensions:</span><br />
                            {item.product.length}" × {item.product.width}" × {item.product.height}"
                          </div>
                          <div>
                            <span className="font-medium">Weight:</span><br />
                            {item.product.weight} lbs each
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 text-sm"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white text-sm"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Totals */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Weight:</span>
                        <span className="font-semibold text-gray-900">{item.totalWeight.toFixed(1)} lbs</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Volume:</span>
                        <span className="font-semibold text-gray-900">{item.totalVolume.toFixed(1)} cu in</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Weight:</span>
                  <span>{totalWeight.toFixed(1)} lbs</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Dry Ice Weight:</span>
                  <span>{dryIceWeight} lbs</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-indigo-600 mt-2 pt-2 border-t border-gray-300">
                  <span>Grand Total Weight:</span>
                  <span>{(totalWeight + dryIceWeight).toFixed(1)} lbs</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={cartItems.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 3: Review Order</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Shipping Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span>{destinationZip} (Zone {zone})</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="capitalize">{serviceLevel.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dry Ice Packs:</span>
                  <span>{dryIceSpecs[serviceLevel].count}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Products:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Product Weight:</span>
                  <span>{totalWeight.toFixed(1)} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span>Dry Ice Weight:</span>
                  <span>{dryIceWeight} lbs</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Weight:</span>
                  <span>{(totalWeight + dryIceWeight).toFixed(1)} lbs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Next: Calculate
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Calculate */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 4: Calculate Optimal Packing</h2>
          
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Running 3D Bin Packing Algorithm</h3>
            <p className="text-gray-600 mb-6">
              Finding the most optimal way to pack your items...
            </p>
            
            <button
              onClick={calculateShipping}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Calculate Shipping'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Results */}
      {currentStep === 5 && calculation && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Results</h2>
            
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
              <h4 className="font-medium text-gray-900 mb-4">Optimization Recommendations</h4>
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

          <div className="flex justify-between">
            <button
              onClick={() => {
                setCurrentStep(1);
                setCalculation(null);
                setCartItems([]);
                setDestinationZip('');
                setError(null);
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Start Over
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Modify Order
            </button>
            {(debugMode || debugModeOverride) && calculation?.debug_info && (
              <button
                onClick={() => setShowDebugWindow(true)}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                View Debug Info
              </button>
            )}
            {!debugMode && !debugModeOverride && (
              <button
                onClick={() => setDebugModeOverride(true)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Enable Debug Mode (Test)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Debug Window */}
      {calculation?.debug_info && (
        <DebugWindow
          debugInfo={calculation.debug_info}
          isOpen={showDebugWindow}
          onClose={() => setShowDebugWindow(false)}
        />
      )}
    </div>
  );
};

export default EnhancedCalculator;
