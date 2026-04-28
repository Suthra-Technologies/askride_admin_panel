import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    CreditCard,
    Globe,
    Bell,
    Shield,
    User,
    Save,
    DollarSign,
    IndianRupee,
    Percent,
    Clock,
    Activity,
    ChevronRight,
    Lock,
    Mail,
    Smartphone
} from 'lucide-react';
import { useDialog } from '../../context/DialogContext';

const Settings: React.FC = () => {
    const { confirm, showAlert } = useDialog();
    const [activeTab, setActiveTab] = useState('general');

    const handleSavePricing = () => {
        confirm({
            title: 'Save Changes',
            message: 'Are you sure you want to update the platform pricing? This will affect all new ride bookings immediately.',
            type: 'confirm',
            confirmText: 'Update Pricing',
            onConfirm: () => {
                showAlert("Settings Updated", "The pricing and revenue configuration has been saved successfully.", 'success');
            }
        });
    };

    const tabs = [
        { id: 'general', label: 'General Settings', icon: Globe },
        { id: 'pricing', label: 'Pricing & Commission', icon: IndianRupee },
        { id: 'profile', label: 'Admin Profile', icon: User },
        { id: 'security', label: 'Security & Auth', icon: Shield },
        { id: 'notifications', label: 'Notification Rules', icon: Bell },
        { id: 'billing', label: 'Subscriptions', icon: CreditCard },
    ];

    const recentActivities = [
        { id: 1, admin: 'Ramu Kodali', action: 'Updated Base Fare', date: '2 mins ago', status: 'Completed', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, admin: 'Sarah Chen', action: 'Enabled Surge Pricing', date: '1 hour ago', status: 'Completed', avatar: 'https://i.pravatar.cc/150?u=5' },
        { id: 3, admin: 'John Doe', action: 'Modified Subscriptions', date: '5 hours ago', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=8' },
        { id: 4, admin: 'Ramu Kodali', action: 'Updated Security Auth', date: 'Yesterday', status: 'Completed', avatar: 'https://i.pravatar.cc/150?u=1' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in p-2 md:p-6 mb-20">
            {/* Header with Glass Effect */}
            <header className="relative p-6 rounded-[2rem] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-white dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-primary-500/20">
                                Management Portal
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Control <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-amber-600">Center</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium max-w-md leading-relaxed">
                            Fine-tune the heartbeat of AskRide. Adjust pricing and configurations.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 p-3 rounded-[1.5rem] border border-white dark:border-slate-700 backdrop-blur-md">
                        <div className="flex -space-x-2">
                            {[1, 5, 8, 12].map(i => (
                                <div key={i} className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-md transform hover:-translate-y-1 transition-transform">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Admin" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">Active Team</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4 Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[1.5rem] p-3 border border-white dark:border-slate-800/50 sticky top-24 shadow-lg shadow-slate-200/20 dark:shadow-none">
                        <div className="px-3 py-1 mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu</span>
                        </div>
                        {tabs.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all group relative overflow-hidden ${activeTab === item.id
                                    ? 'text-slate-950 translate-x-1'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                                    }`}
                            >
                                {activeTab === item.id && (
                                    <div className="absolute inset-0 bg-primary-500 shadow-lg shadow-primary-500/40 rounded-xl -z-10 animate-slide-in" />
                                )}
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800/50 group-hover:scale-110'}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    {item.label}
                                </div>
                                {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-xl overflow-hidden relative group border border-slate-800">
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        
                        {/* Fluctuating Yellow ECG Graph - Slowed Down */}
                        <div className="mb-3 relative h-8 w-full overflow-hidden">
                            <svg className="w-full h-full animate-[fluctuate_6s_infinite_linear]" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <path 
                                    d="M0 20 L20 20 L25 10 L30 30 L35 5 L40 35 L45 20 L65 20 L70 15 L75 25 L80 20 L100 20" 
                                    fill="none" 
                                    stroke="#f9bb06" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="animate-[draw_10s_linear_infinite] shadow-[0_0_10px_#f9bb06]"
                                    style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
                                />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent w-16 h-full animate-[scan_5s_linear_infinite] opacity-50" />
                        </div>
                        <h4 className="font-black text-lg mb-1 flex items-center gap-2">
                            System Health
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                        </h4>
                        <p className="text-white/70 text-xs font-medium mb-3">All systems performing optimally.</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden relative">
                            <div className="h-full bg-primary-500 w-4/5 rounded-full" />
                        </div>
                        <span className="text-[9px] font-black mt-2 block text-primary-500 uppercase tracking-widest animate-pulse">Efficiency: 98.4%</span>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="lg:col-span-9 space-y-6 relative">
                    {/* Coming Soon Overlay */}
                    <div className="absolute inset-0 z-50 backdrop-blur-[6px] bg-white/5 dark:bg-slate-950/5 rounded-[1.5rem] flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                        <div className="relative p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[2rem] shadow-xl text-center transform hover:scale-105 transition-transform duration-500 pointer-events-auto">
                            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20 animate-bounce">
                                <Clock className="w-8 h-8 text-slate-950" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">
                                Module <span className="text-primary-500">Under Construction</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-bold text-xs leading-relaxed mb-6">
                                We're fine-tuning the administrative controls for maximum efficiency.
                            </p>
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                Est. Q3 2026
                            </div>
                        </div>
                    </div>

                    <div className="opacity-40 grayscale-[0.5] pointer-events-none select-none space-y-6">
                        {activeTab === 'general' || activeTab === 'pricing' ? (
                            <>
                            {/* Pricing Config Card */}
                            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden group">
                                <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/10 transform -rotate-2 group-hover:rotate-0 transition-transform">
                                            <IndianRupee className="w-6 h-6 text-slate-950" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black dark:text-white leading-none">Pricing Engine</h3>
                                            <p className="text-slate-400 mt-1 font-bold text-[10px] uppercase tracking-widest">Global Fare Matrix</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                            Defaults
                                        </button>
                                        <button
                                            onClick={handleSavePricing}
                                            className="px-5 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all"
                                        >
                                            Publish
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Base Fare</label>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                                                    <IndianRupee className="w-5 h-5" />
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="2.50" 
                                                    className="block w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-lg font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Platform Cut</label>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-300 font-black text-lg group-focus-within/input:text-primary-500 transition-colors">
                                                    %
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="15" 
                                                    className="block w-full pl-6 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-lg font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Demand Surge</label>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors font-black text-lg">
                                                    ×
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="1.5" 
                                                    className="block w-full pl-11 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-lg font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Min Distance</label>
                                            <div className="group/input relative">
                                                <input 
                                                    type="number" 
                                                    defaultValue="2" 
                                                    className="block w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-lg font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-slate-950 dark:bg-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[200px]">
                                            Authorized access only.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSavePricing}
                                        className="w-full md:w-auto px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-4 h-4" /> Save Pricing
                                    </button>
                                </div>
                            </section>

                            {/* Stylish Table: Recent Configuration Activity */}
                            <section className="bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-black dark:text-white leading-none">Activity Log</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Audit Trail</p>
                                    </div>
                                    <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400">
                                        <Activity className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-50 dark:border-slate-800">
                                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin</th>
                                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                                                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {recentActivities.map((log) => (
                                                <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                                <img src={log.avatar} alt="" />
                                                            </div>
                                                            <span className="font-black dark:text-white text-xs">{log.admin}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{log.action}</td>
                                                    <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{log.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                            log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all inline-block" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/20 text-center">
                                    <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary-500 transition-colors">
                                        View Full History
                                    </button>
                                </div>
                            </section>

                            {/* Service Grid: Trendy Health Monitor */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between px-4">
                                    <h3 className="text-lg font-black dark:text-white tracking-tight">System Nodes</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest uppercase tracking-widest">Active Monitoring</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { name: 'Ride API', status: 'Online', load: '12%', color: 'emerald', icon: Smartphone },
                                        { name: 'Gateway', status: 'Online', load: '45%', color: 'emerald', icon: Globe },
                                        { name: 'Auth Node', status: 'Online', load: '28%', color: 'emerald', icon: Shield },
                                        { name: 'Payments', status: 'Online', load: '8%', color: 'emerald', icon: CreditCard },
                                    ].map((service, idx) => (
                                        <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <service.icon className="w-12 h-12" />
                                            </div>
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-xl bg-${service.color}-500/10 flex items-center justify-center mb-4 text-${service.color}-500`}>
                                                    <service.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black dark:text-white text-sm mb-1">{service.name}</h4>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-1 h-1 rounded-full bg-${service.color}-500`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-wider text-${service.color}-500`}>{service.status}</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                        <span>Load</span>
                                                        <span>{service.load}</span>
                                                    </div>
                                                    <div className="h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className={`h-full bg-${service.color}-500 rounded-full`} style={{ width: service.load }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : activeTab === 'billing' ? (
                        <div className="space-y-8 animate-slide-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Revenue', value: '₹4,82,950', change: '+12.5%', icon: DollarSign, color: 'primary' },
                                    { label: 'Plans', value: '1,284', change: '+8.2%', icon: User, color: 'emerald' },
                                    { label: 'Churn', value: '1.2%', change: '-0.4%', icon: Activity, color: 'amber' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="relative group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg hover:-translate-y-1 transition-all">
                                        <div className="relative flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-${stat.color === 'primary' ? 'primary-500' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary-500' : stat.color + '-500'}`}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                                        <div className="text-2xl font-black dark:text-white tracking-tighter">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <section className="bg-slate-950 rounded-[2rem] p-8 border-2 border-primary-500/10 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col lg:flex-row gap-8">
                                    <div className="lg:w-1/3 space-y-4">
                                        <h3 className="text-2xl font-black text-white leading-tight">Tier <span className="text-primary-500">Models</span></h3>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">
                                            Configure platform financial categories and limits.
                                        </p>
                                        <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-500 transition-colors">
                                            New Plan
                                        </button>
                                    </div>

                                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { title: 'Standard', price: '₹199', features: ['Priority', 'No Cancel Fee'], color: 'slate-800' },
                                            { title: 'Elite', price: '₹499', features: ['Luxury', 'Premium Support'], color: 'primary-500' },
                                        ].map((plan, idx) => (
                                            <div key={idx} className={`p-6 rounded-2xl ${plan.color === 'primary-500' ? 'bg-primary-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-white'} relative group`}>
                                                <h5 className="text-lg font-black mb-1">{plan.title}</h5>
                                                <div className="text-2xl font-black mb-4 flex items-baseline gap-1">
                                                    {plan.price} <span className="text-[10px] font-bold opacity-60">/mo</span>
                                                </div>
                                                <ul className="space-y-2 mb-6">
                                                    {plan.features.map((feat, fIdx) => (
                                                        <li key={fIdx} className="flex items-center gap-2 text-[11px] font-bold">
                                                            <ChevronRight className="w-3 h-3 opacity-50" />
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button className={`w-full py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${
                                                    plan.color === 'primary-500' ? 'bg-slate-950 text-white' : 'bg-white/5 hover:bg-white/10'
                                                }`}>
                                                    Configure
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800/50 relative overflow-hidden group transition-all">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-transparent group-hover:border-primary-500/50">
                                <Lock className="w-10 h-10 text-slate-300 dark:text-slate-600 group-hover:text-primary-500" />
                            </div>
                            <h3 className="text-xl font-black dark:text-white uppercase">Access Restricted</h3>
                            <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">
                                Requires authorized architect level profile.
                            </p>
                            <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all">
                                Authenticate
                            </button>
                        </div>
                    )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
