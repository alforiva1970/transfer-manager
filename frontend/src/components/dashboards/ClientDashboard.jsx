import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ClientDashboard = ({ stats, onRefresh }) => {
    const [requests, setRequests] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState({ total: 5000, spent: 0, approved: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsRes, transfersRes] = await Promise.all([
                api.get('/requests/'),
                api.get('/transfers/')
            ]);
            setRequests(requestsRes.data);
            setPendingApprovals(requestsRes.data.filter(r => r.status === 'In Attesa'));

            // Calculate budget
            const transfers = transfersRes.data;
            const spent = transfers.filter(t => t.status === 'Completato').reduce((acc, t) => acc + parseFloat(t.service_value || 0), 0);
            const approved = transfers.filter(t => ['Confermato', 'In Corso'].includes(t.status)).reduce((acc, t) => acc + parseFloat(t.service_value || 0), 0);
            setBudget({ total: 5000, spent, approved });
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await api.post(`/requests/${requestId}/approve/`);
            fetchData();
        } catch (err) {
            console.error('Failed to approve', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const remaining = budget.total - budget.spent - budget.approved;
    const spentPercentage = (budget.spent / budget.total) * 100;
    const approvedPercentage = (budget.approved / budget.total) * 100;

    return (
        <div className="space-y-6 animate-in">
            {/* Budget Overview Card */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Budget Evento</h2>
                        <p className="text-sm text-surface-200">Controllo costi in tempo reale</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">€{budget.total.toFixed(0)}</p>
                        <p className="text-sm text-surface-200">Budget Totale</p>
                    </div>
                </div>

                {/* Budget Bar */}
                <div className="relative h-4 bg-surface-800 rounded-full overflow-hidden mb-4">
                    <div
                        className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${spentPercentage}%` }}
                    />
                    <div
                        className="absolute top-0 h-full bg-yellow-500/50 transition-all duration-500"
                        style={{ left: `${spentPercentage}%`, width: `${approvedPercentage}%` }}
                    />
                </div>

                {/* Budget Legend */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm text-surface-200">Speso</span>
                        </div>
                        <p className="text-xl font-semibold text-green-400">€{budget.spent.toFixed(0)}</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <span className="text-sm text-surface-200">Approvato</span>
                        </div>
                        <p className="text-xl font-semibold text-yellow-400">€{budget.approved.toFixed(0)}</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 bg-surface-600 rounded-full" />
                            <span className="text-sm text-surface-200">Rimanente</span>
                        </div>
                        <p className="text-xl font-semibold text-white">€{remaining.toFixed(0)}</p>
                    </div>
                </div>
            </div>

            {/* Pending Approvals */}
            {pendingApprovals.length > 0 && (
                <div className="card border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Richieste in Attesa</h2>
                            <p className="text-sm text-yellow-400">{pendingApprovals.length} richieste da approvare</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {pendingApprovals.map((request) => (
                            <div
                                key={request.id}
                                className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-white">
                                        {request.start_location} → {request.end_location}
                                    </p>
                                    <p className="text-sm text-surface-200">
                                        {new Date(request.requested_datetime).toLocaleDateString('it-IT', {
                                            weekday: 'short',
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {' • Richiesto da '}{request.requester}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleApprove(request.id)}
                                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="card hover:border-primary-500/50 flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-white">Nuova Richiesta</p>
                        <p className="text-sm text-surface-200">Prenota un transfer per il tuo team</p>
                    </div>
                </button>

                <button className="card hover:border-primary-500/50 flex items-center gap-4 text-left">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-white">Report Spese</p>
                        <p className="text-sm text-surface-200">Visualizza il dettaglio dei costi</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ClientDashboard;
