/**
 * Customers Management component for admins
 */

import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import apiService from '../../services/api';

const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers(false); // Get all customers, not just active
      setCustomers(response);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCustomerStatus = async (customer: Customer) => {
    try {
      await apiService.updateCustomer(customer.id, { active: !customer.active });
      setCustomers(customers.map(c => 
        c.id === customer.id ? { ...c, active: !c.active } : c
      ));
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await apiService.deleteCustomer(customerId);
        setCustomers(customers.filter(c => c.id !== customerId));
      } catch (error) {
        console.error('Failed to delete customer:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Customers Management</h1>
            <p className="text-gray-600">
              Manage customer accounts and their configurations.
            </p>
          </div>
          <button
            onClick={() => {/* TODO: Implement add customer form */}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredCustomers.length} of {customers.length} customers
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            !customer.active ? 'opacity-60' : ''
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {customer.logoUrl ? (
                  <img 
                    src={customer.logoUrl} 
                    alt={customer.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.displayName}</h3>
                  <p className="text-sm text-gray-500">ID: {customer.id}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                customer.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {customer.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {customer.name}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Created:</span> {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {/* TODO: Implement edit customer */}}
                className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleCustomerStatus(customer)}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  customer.active 
                    ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {customer.active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => deleteCustomer(customer.id)}
                className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p>Try adjusting your search terms or add a new customer.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagement;
