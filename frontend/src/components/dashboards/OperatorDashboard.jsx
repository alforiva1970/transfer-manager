import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OperatorDashboard = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTransfer, setActiveTransfer] = useState(null);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const response = await api.get('/transfers/');
            setTransfers(response.data);
            setActiveTransfer(response.data.find(t => t.status === 'In Corso'));
        } catch (err) {
            console.error('Failed to fetch transfers', err);
        } finally {
            setLoading(false);
        }
    };

    const upcomingTransfers = transfers.filter(t =>
        t.status === 'Confermato' && new Date(t.scheduled_start_time) > new Date()
    ).sort((a, b) => new Date(a.scheduled_start_time) - new Date(b.scheduled_start_time));

    const handleStartTransfer = async (transferId) => {
        // In a real app, this would update the transfer status
        console.log('Starting transfer', transferId);
    };

    const handleEndTransfer = async (transferId) => {
        console.log('Ending transfer', transferId);
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
            {/* Active Transfer Card */}
            {activeTransfer ? (
                <div className="glass-card p-6 border-green-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Transfer Attivo</h2>
                            <p className="text-sm text-green-400">In corso ora</p>
                        </div>
                    </div>

                    <div className="bg-surface-800/50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-surface-200">Partenza</p>
                                <p className="font-medium text-white">{activeTransfer.start_location}</p>
                            </div>
                            <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <div className="flex-1 text-right">
                                <p className="text-sm text-surface-200">Arrivo</p>
                                <p className="font-medium text-white">{activeTransfer.end_location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-surface-200">Cliente</p>
                            <p className="font-medium text-white">{activeTransfer.client}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-surface-200">Veicolo</p>
                            <p className="font-medium text-white">{activeTransfer.vehicle || 'Non assegnato'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleEndTransfer(activeTransfer.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completa Transfer
                    </button>
                </div>
            ) : (
                <div className="glass-card p-6 text-center">
                    <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-surface-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nessun transfer attivo</h3>
                    <p className="text-surface-200">I tuoi prossimi transfer sono elencati qui sotto</p>
                </div>
            )}

            {/* Upcoming Transfers */}
            <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">Prossimi Transfer</h2>

                {upcomingTransfers.length === 0 ? (
                    <p className="text-surface-200 text-center py-8">Nessun transfer programmato</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingTransfers.map((transfer) => {
                            const date = new Date(transfer.scheduled_start_time);
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                                <div
                                    key={transfer.id}
                                    className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl hover:bg-surface-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${isToday ? 'bg-primary-500/10 text-primary-400' : 'bg-surface-700 text-surface-200'}`}>
                                            <span className="text-xs font-medium uppercase">
                                                {date.toLocaleDateString('it-IT', { weekday: 'short' })}
                                            </span>
                                            <span className="text-lg font-bold">
                                                {date.getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {transfer.start_location} → {transfer.end_location}
                                            </p>
                                            <p className="text-sm text-surface-200">
                                                {date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                                {' • '}{transfer.client}
                                            </p>
                                        </div>
                                    </div>

                                    {!activeTransfer && isToday && (
                                        <button
                                            onClick={() => handleStartTransfer(transfer.id)}
                                            className="btn-primary py-2 px-4 text-sm"
                                        >
                                            Inizia
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="stat-card">
                    <span className="stat-value text-white">{transfers.filter(t => t.status === 'Completato').length}</span>
                    <span className="stat-label">Transfer Completati</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value text-primary-400">
                        €{transfers.filter(t => t.status === 'Completato').reduce((acc, t) => acc + parseFloat(t.service_cost || 0), 0).toFixed(0)}
                    </span>
                    <span className="stat-label">Guadagno Totale</span>
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
