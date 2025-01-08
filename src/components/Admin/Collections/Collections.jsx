
import React, { useState } from 'react';
import { Search, SortAsc, SortDesc, DollarSign } from 'lucide-react';

const Collections = () => {
        const [sortDirection, setSortDirection] = useState('asc');
        const [searchTerm, setSearchTerm] = useState('');

        const collections = [
            { id: 1, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 2, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 3, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 4, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 5, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 6, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
            { id: 7, date: '3/1/2025', name: 'XYZ name', status: '', amount: '***' },
        ];

        const toggleSort = () => {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        };

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-white">Fund collections</h1>
                                <div className="bg-blue-500 px-4 py-2 rounded-lg">
                                    <p className="text-white font-semibold flex items-center gap-2">
                                        <DollarSign className="w-5 h-5" />
                                        Total Fund: ****
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={toggleSort}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
                                >
                                    {sortDirection === 'asc' ? (
                                        <SortAsc className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <SortDesc className="w-5 h-5 text-gray-600" />
                                    )}
                                    <span className="text-gray-600">Sort</span>
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {collections.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="text"
                                                    placeholder="update status"
                                                    className="px-3 py-1 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default Collections;