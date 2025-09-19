/**
 * Product selector component for the calculator
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import apiService from '../../services/api';
import { useCalculatorStore } from '../../store/useCalculatorStore';

const ProductSelector: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedProducts, addProduct, removeProduct, updateProductQuantity } = useCalculatorStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading products...');
      const response = await apiService.getProducts({ 
        customer_id: 'tyson', 
        active_only: true,
        size: 100 
      });
      console.log('Products response:', response);
      console.log('Products data:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getProductQuantity = (productId: number) => {
    const selected = selectedProducts.find(p => p.id === productId);
    return (selected as any)?.quantity || 0;
  };

  const handleQuantityChange = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(product.id);
    } else {
      updateProductQuantity(product.id, quantity);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Products</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Select Products</h3>
        <div className="text-sm text-gray-500">
          {selectedProducts.length} selected
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Products List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredProducts.map((product) => {
          const quantity = getProductQuantity(product.id);
          return (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <p className="text-xs text-gray-500">
                  {product.length}" × {product.width}" × {product.height}" • {product.weight} lbs
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                {quantity > 0 ? (
                  <>
                    <button
                      onClick={() => handleQuantityChange(product, quantity - 1)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product, quantity + 1)}
                      className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => addProduct(product)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
