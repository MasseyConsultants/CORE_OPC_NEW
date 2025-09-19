/**
 * Tyson Tariffs Management component
 */

import React, { useState } from 'react';

const TysonTariffs: React.FC = () => {
  const [tariffs, setTariffs] = useState([
    { id: 1, serviceLevel: 'Ground', zone: '1', weightBand: 1, rate: 8.50, active: true },
    { id: 2, serviceLevel: 'Ground', zone: '1', weightBand: 2, rate: 9.25, active: true },
    { id: 3, serviceLevel: 'Ground', zone: '2', weightBand: 1, rate: 9.75, active: true },
    { id: 4, serviceLevel: 'TwoDay', zone: '1', weightBand: 1, rate: 15.50, active: true },
    { id: 5, serviceLevel: 'TwoDay', zone: '2', weightBand: 1, rate: 16.25, active: true },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTariff, setNewTariff] = useState({
    serviceLevel: 'Ground',
    zone: '1',
    weightBand: 1,
    rate: 0,
    active: true
  });

  const handleAddTariff = () => {
    const tariff = {
      id: tariffs.length + 1,
      ...newTariff
    };
    setTariffs([...tariffs, tariff]);
    setNewTariff({
      serviceLevel: 'Ground',
      zone: '1',
      weightBand: 1,
      rate: 0,
      active: true
    });
    setShowAddForm(false);
  };

  const toggleTariffStatus = (id: number) => {
    setTariffs(tariffs.map(tariff => 
      tariff.id === id ? { ...tariff, active: !tariff.active } : tariff
    ));
  };

  const deleteTariff = (id: number) => {
    setTariffs(tariffs.filter(tariff => tariff.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tyson Tariffs Management</h1>
            <p className="text-gray-600">
              Manage shipping rates and tariffs for Tyson Foods customers.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add Tariff</span>
          </button>
        </div>
      </div>

      {/* Add Tariff Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tariff</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Level</label>
              <select
                value={newTariff.serviceLevel}
                onChange={(e) => setNewTariff({...newTariff, serviceLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Ground">Ground</option>
                <option value="TwoDay">2-Day</option>
                <option value="StandardOvernight">Standard Overnight</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <select
                value={newTariff.zone}
                onChange={(e) => setNewTariff({...newTariff, zone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[1,2,3,4,5,6,7,8].map(zone => (
                  <option key={zone} value={zone.toString()}>Zone {zone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight Band</label>
              <input
                type="number"
                value={newTariff.weightBand}
                onChange={(e) => setNewTariff({...newTariff, weightBand: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($)</label>
              <input
                type="number"
                step="0.01"
                value={newTariff.rate}
                onChange={(e) => setNewTariff({...newTariff, rate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTariff}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Tariff
            </button>
          </div>
        </div>
      )}

      {/* Tariffs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Tariffs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight Band
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tariffs.map((tariff) => (
                <tr key={tariff.id} className={tariff.active ? '' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tariff.serviceLevel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Zone {tariff.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tariff.weightBand} lbs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${tariff.rate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tariff.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tariff.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleTariffStatus(tariff.id)}
                      className={`${
                        tariff.active 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {tariff.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteTariff(tariff.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TysonTariffs;
