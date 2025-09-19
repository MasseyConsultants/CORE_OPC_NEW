/**
 * Admin Dashboard component
 */

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Users', value: '24', change: '+2', changeType: 'positive' },
    { name: 'Active Customers', value: '8', change: '+1', changeType: 'positive' },
    { name: 'Products', value: '1,247', change: '+12', changeType: 'positive' },
    { name: 'Calculations Today', value: '156', change: '+23', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, action: 'User login', user: 'robert@ait.com', time: '2 minutes ago', type: 'info' },
    { id: 2, action: 'New product added', user: 'admin@ait.com', time: '15 minutes ago', type: 'success' },
    { id: 3, action: 'Tariff updated', user: 'admin@ait.com', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'System backup', user: 'System', time: '2 hours ago', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">
          Welcome back, {user?.name}. Manage your CORE OPC Calculator system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600">Add, edit, or remove user accounts</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-medium text-gray-900">Update Tariffs</h4>
            <p className="text-sm text-gray-600">Manage Tyson shipping rates</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <div className="text-2xl mb-2">🔧</div>
            <h4 className="font-medium text-gray-900">Calculator Config</h4>
            <p className="text-sm text-gray-600">Configure calculation parameters</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <h4 className="font-medium text-gray-900">System Settings</h4>
            <p className="text-sm text-gray-600">Configure system-wide settings and debug mode</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
