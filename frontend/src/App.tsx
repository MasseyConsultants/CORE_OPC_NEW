/**
 * Main App component
 */

import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import LoginForm from './components/auth/LoginForm';
import MainLayout from './components/layout/MainLayout';
import ProductSelector from './components/calculator/ProductSelector';
import ShippingCalculator from './components/calculator/ShippingCalculator';
import EnhancedCalculator from './components/calculator/EnhancedCalculator';
import AdminDashboard from './components/admin/AdminDashboard';
import CalculatorConfig from './components/admin/CalculatorConfig';
import TysonTariffs from './components/admin/TysonTariffs';
import ProductsManagement from './components/admin/ProductsManagement';
import CustomersManagement from './components/admin/CustomersManagement';
import SystemSettings from './components/admin/SystemSettings';

const App: React.FC = () => {
  const { isAuthenticated, loading, getCurrentUser } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('calculator');

  useEffect(() => {
    // Check if user is already authenticated on app load
    getCurrentUser();
  }, [getCurrentUser]);

  const renderPage = () => {
    switch (currentPage) {
      case 'calculator':
        return <EnhancedCalculator />;
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
              <p>Reports functionality coming soon...</p>
            </div>
          </div>
        );
      case 'admin':
        return <AdminDashboard />;
      case 'admin/products':
        return <ProductsManagement />;
      case 'admin/customers':
        return <CustomersManagement />;
      case 'admin/calculator':
        return <CalculatorConfig />;
      case 'admin/tariffs':
        return <TysonTariffs />;
      case 'admin/users':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p>User management functionality coming soon...</p>
            </div>
          </div>
        );
      case 'admin/settings':
        return <SystemSettings />;
      case 'admin/audit':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Logs</h3>
              <p>Audit logs functionality coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductSelector />
            <ShippingCalculator />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
};

export default App;
