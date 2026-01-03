import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = ({ stats, onRefresh }) => {
    const [recentTransfers, setRecentTransfers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transfersRes, vehiclesRes] = await Promise.all([
                api.get('/transfers/'),
                api.get('/vehicles/')
            ]);
            setRecentTransfers(transfersRes.data.slice(0, 5));
            setVehicles(vehiclesRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'Richiesto': 'badge-requested',
            'Confermato': 'badge-confirmed',
            'In Corso': 'badge-active',
            'Completato': 'badge-completed',
            'Annullato': 'badge-cancelled',
        };
        return badges[status] || 'badge';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="stat-value text-yellow-400">{stats.pending}</span>
                    </div>
                    <span className="stat-label">In Attesa di Approvazione</span>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="stat-value text-green-400">{stats.active}</span>
                    </div>
                    <span className="stat-label">Transfer Attivi</span>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="stat-value text-blue-400">{stats.completed}</span>
                    </div>
                    <span className="stat-label">Completati</span>
                </div>

                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="stat-value text-primary-400">€{stats.budget.toFixed(0)}</span>
                    </div>
                    <span className="stat-label">Valore Totale</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transfers */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Transfer Recenti</h2>
                        <button onClick={onRefresh} className="text-sm text-primary-400 hover:text-primary-300">
                            Aggiorna
                        </button>
                    </div>

                    {recentTransfers.length === 0 ? (
                        <p className="text-surface-200 text-center py-8">Nessun transfer trovato</p>
                    ) : (
                        <div className="space-y-3">
                            {recentTransfers.map((transfer) => (
                                <div
                                    key={transfer.id}
                                    className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl hover:bg-surface-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-surface-700 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-surface-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{transfer.start_location} → {transfer.end_location}</p>
                                            <p className="text-sm text-surface-200">
                                                {new Date(transfer.scheduled_start_time).toLocaleDateString('it-IT', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-white">€{transfer.service_value || '0'}</span>
                                        <span className={`badge ${getStatusBadge(transfer.status)}`}>
                                            {transfer.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fleet Overview */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-white mb-4">Flotta Veicoli</h2>

                    {vehicles.length === 0 ? (
                        <p className="text-surface-200 text-center py-8">Nessun veicolo</p>
                    ) : (
                        <div className="space-y-3">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="flex items-center justify-between p-3 bg-surface-800/50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{vehicle.service_class}</p>
                                            <p className="text-xs text-surface-200">{vehicle.license_plate}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-surface-200">{vehicle.capacity} pax</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="w-full mt-4 btn-secondary text-sm py-2">
                        + Aggiungi Veicolo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
