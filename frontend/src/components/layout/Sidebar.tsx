/**
 * Sidebar navigation component
 */

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { user } = useAuthStore();

  const toolsMenuItems = [
    { name: 'Calculator', icon: '📦', path: 'calculator', active: currentPage === 'calculator', adminOnly: false },
    { name: 'Reports', icon: '📊', path: 'reports', active: currentPage === 'reports', adminOnly: false },
  ];

  const adminMenuItems = [
    { name: 'Admin Dashboard', icon: '👑', path: 'admin', active: currentPage === 'admin', adminOnly: true },
    { name: 'Products', icon: '📋', path: 'admin/products', active: currentPage === 'admin/products', adminOnly: true },
    { name: 'Customers', icon: '🏢', path: 'admin/customers', active: currentPage === 'admin/customers', adminOnly: true },
    { name: 'User Management', icon: '👥', path: 'admin/users', active: currentPage === 'admin/users', adminOnly: true },
    { name: 'Tyson Tariffs', icon: '💰', path: 'admin/tariffs', active: currentPage === 'admin/tariffs', adminOnly: true },
    { name: 'Calculator Config', icon: '🔧', path: 'admin/calculator', active: currentPage === 'admin/calculator', adminOnly: true },
    { name: 'System Settings', icon: '⚙️', path: 'admin/settings', active: currentPage === 'admin/settings', adminOnly: true },
    { name: 'Audit Logs', icon: '📝', path: 'admin/audit', active: currentPage === 'admin/audit', adminOnly: true },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      {/* AIT Logo and Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AIT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CORE OPC</h1>
            <p className="text-sm text-gray-400">Calculator</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="mt-6">
        {/* Tools Section */}
        <div>
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tools
            </h3>
          </div>
          <ul className="space-y-1 px-3">
            {toolsMenuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => onPageChange(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Section */}
        {user && user.role === 'ADMIN' && (
          <div className="mt-8">
            <div className="px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </h3>
            </div>
            <ul className="space-y-1 px-3">
              {adminMenuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => onPageChange(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          <p>AIT World Wide Logistics</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
