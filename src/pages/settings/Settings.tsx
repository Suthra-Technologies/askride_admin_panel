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
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in p-2 md:p-6 mb-20">
            {/* Header with Glass Effect */}
            <header className="relative p-8 rounded-[3rem] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary-500/20">
                                Management Portal
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Control <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-amber-600">Center</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium max-w-lg leading-relaxed">
                            Fine-tune the heartbeat of AskRide. Adjust pricing, monitor health, and manage core configurations.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 bg-white/50 dark:bg-slate-800/50 p-4 rounded-[2rem] border border-white dark:border-slate-700 backdrop-blur-md">
                        <div className="flex -space-x-3">
                            {[1, 5, 8, 12].map(i => (
                                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Admin" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-sm font-black text-slate-900 dark:text-white block">Active Team</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">4 Admins Online</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <aside className="lg:col-span-3 space-y-4">
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-4 border border-white dark:border-slate-800/50 sticky top-24 shadow-xl shadow-slate-200/20 dark:shadow-none">
                        <div className="px-4 py-2 mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu Selection</span>
                        </div>
                        {tabs.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all group relative overflow-hidden ${activeTab === item.id
                                    ? 'text-slate-950 translate-x-2'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                                    }`}
                            >
                                {activeTab === item.id && (
                                    <div className="absolute inset-0 bg-primary-500 shadow-xl shadow-primary-500/40 rounded-2xl -z-10 animate-slide-in" />
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800/50 group-hover:scale-110'}`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    {item.label}
                                </div>
                                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-950 text-white shadow-2xl overflow-hidden relative group border border-slate-800">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        
                        {/* Fluctuating Yellow ECG Graph - Slowed Down */}
                        <div className="mb-4 relative h-10 w-full overflow-hidden">
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
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent w-20 h-full animate-[scan_5s_linear_infinite] opacity-50" />
                            <Activity className="absolute top-0 left-0 w-8 h-8 text-primary-500 animate-[heartbeat-pulse_4s_infinite] opacity-30" />
                        </div>

                        <h4 className="font-black text-xl mb-2 flex items-center gap-2">
                            System Health
                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        </h4>
                        <p className="text-white/70 text-sm font-medium mb-4">All systems are currently performing within optimal parameters.</p>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                            <div className="h-full bg-primary-500 w-4/5 rounded-full shadow-[0_0_10px_rgba(249,187,6,0.5)]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20 h-full animate-[scan_6s_linear_infinite]" />
                        </div>
                        <span className="text-[10px] font-black mt-2 block text-primary-500 uppercase tracking-widest animate-pulse">Efficiency: 98.4%</span>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="lg:col-span-9 space-y-10">
                    {activeTab === 'general' || activeTab === 'pricing' ? (
                        <>
                            {/* Pricing Config Card */}
                            <section className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden group">
                                <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-primary-500 rounded-[1.5rem] shadow-xl shadow-primary-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                                            <IndianRupee className="w-8 h-8 text-slate-950" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black dark:text-white leading-none">Pricing Engine</h3>
                                            <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Global Fare Matrix</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                            Reset Defaults
                                        </button>
                                        <button
                                            onClick={handleSavePricing}
                                            className="px-8 py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all"
                                        >
                                            Publish Changes
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-12 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Base Fare</label>
                                                <span className="text-[10px] font-black text-primary-600 uppercase">Per KM Rate</span>
                                            </div>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                                                    <IndianRupee className="w-6 h-6" />
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="2.50" 
                                                    className="block w-full pl-16 pr-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-2xl font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Platform Cut</label>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase">Current Rev Share</span>
                                            </div>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none text-slate-300 font-black text-2xl group-focus-within/input:text-primary-500 transition-colors">
                                                    %
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="15" 
                                                    className="block w-full pl-8 pr-16 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-2xl font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Demand Surge</label>
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> Auto-Scaling</span>
                                            </div>
                                            <div className="group/input relative">
                                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors font-black text-xl">
                                                    ×
                                                </div>
                                                <input 
                                                    type="number" 
                                                    defaultValue="1.5" 
                                                    className="block w-full pl-14 pr-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-2xl font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Min Distance</label>
                                                <span className="text-[10px] font-black text-slate-300 uppercase">Kilometers</span>
                                            </div>
                                            <div className="group/input relative">
                                                <input 
                                                    type="number" 
                                                    defaultValue="2" 
                                                    className="block w-full px-8 py-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-2xl font-black dark:text-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 bg-slate-950 dark:bg-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-primary-500" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs">
                                            Changes require biometric confirmation or master key authorization.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSavePricing}
                                        className="w-full md:w-auto px-12 py-5 bg-primary-500 hover:bg-primary-600 text-slate-950 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(249,187,6,0.3)] hover:shadow-[0_25px_60px_rgba(249,187,6,0.4)] hover:-translate-y-1 active:scale-95 group"
                                    >
                                        <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Commit Changes
                                    </button>
                                </div>
                            </section>

                            {/* Stylish Table: Recent Configuration Activity */}
                            <section className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="p-10 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black dark:text-white">Recent Activity</h3>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Audit Log</p>
                                    </div>
                                    <button className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-50 dark:border-slate-800">
                                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Administrator</th>
                                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action Performed</th>
                                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-10 py-5"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {recentActivities.map((log) => (
                                                <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                                    <td className="px-10 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                                <img src={log.avatar} alt="" />
                                                            </div>
                                                            <span className="font-black dark:text-white text-sm">{log.admin}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{log.action}</span>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className="text-xs font-black text-slate-400 uppercase">{log.date}</span>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            log.status === 'Completed' 
                                                            ? 'bg-emerald-500/10 text-emerald-500' 
                                                            : 'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all translate-x-4 group-hover:translate-x-0">
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/20 text-center">
                                    <button className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary-500 transition-colors">
                                        View Full Audit History
                                    </button>
                                </div>
                            </section>

                            {/* Service Grid: Trendy Health Monitor */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between px-6">
                                    <h3 className="text-2xl font-black dark:text-white tracking-tight">System Core Nodes</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real-time monitoring active</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { name: 'Ride API', status: 'Online', load: '12%', color: 'emerald', icon: Smartphone },
                                        { name: 'Gateway', status: 'Online', load: '45%', color: 'emerald', icon: Globe },
                                        { name: 'Auth Node', status: 'Online', load: '28%', color: 'emerald', icon: Shield },
                                        { name: 'Payments', status: 'Online', load: '8%', color: 'emerald', icon: CreditCard },
                                    ].map((service, idx) => (
                                        <div key={idx} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <service.icon className="w-16 h-16" />
                                            </div>
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-2xl bg-${service.color}-500/10 flex items-center justify-center mb-6`}>
                                                    <service.icon className={`w-6 h-6 text-${service.color}-500`} />
                                                </div>
                                                <h4 className="font-black dark:text-white mb-1">{service.name}</h4>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-${service.color}-500`} />
                                                    <span className={`text-[10px] font-black uppercase tracking-wider text-${service.color}-500`}>{service.status}</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <span>Load</span>
                                                        <span>{service.load}</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                        <div className="space-y-10 animate-slide-in">
                            {/* Subscription Overview Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: 'Total Revenue', value: '₹4,82,950', change: '+12.5%', icon: DollarSign, color: 'primary' },
                                    { label: 'Active Plans', value: '1,284', change: '+8.2%', icon: User, color: 'emerald' },
                                    { label: 'Churn Rate', value: '1.2%', change: '-0.4%', icon: Activity, color: 'amber' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="relative group overflow-hidden p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-2">
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color === 'primary' ? 'primary-500' : stat.color + '-500'}/5 rounded-full blur-3xl -mr-16 -mt-16`} />
                                        <div className="relative flex items-center justify-between mb-6">
                                            <div className={`p-4 rounded-2xl bg-${stat.color === 'primary' ? 'primary-500' : stat.color + '-500'}/10`}>
                                                <stat.icon className={`w-6 h-6 text-${stat.color === 'primary' ? 'primary-500' : stat.color + '-500'}`} />
                                            </div>
                                            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                                        <div className="text-4xl font-black dark:text-white tracking-tighter">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Plan Management Section */}
                            <section className="bg-slate-950 rounded-[4rem] p-12 border-4 border-primary-500/20 relative overflow-hidden">
                                {/* Subtle Anime Background Effects */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#f9bb06 1px, transparent 1px), linear-gradient(90deg, #f9bb06 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                                <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent animate-pulse" />
                                
                                <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                                    <div className="lg:w-1/3 space-y-6">
                                        <div className="inline-block px-4 py-1 bg-primary-500/10 rounded-full border border-primary-500/20 text-[10px] font-black text-primary-500 uppercase tracking-widest">
                                            Tier Management
                                        </div>
                                        <h3 className="text-5xl font-black text-white leading-tight">Subscription <br/><span className="text-primary-500">Architecture</span></h3>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            Configure the financial tiers of the platform. Adjust pricing models, service limits, and premium features per category.
                                        </p>
                                        <button className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-black uppercase text-sm tracking-widest hover:bg-primary-500 transition-colors shadow-2xl">
                                            Create New Plan
                                        </button>
                                    </div>

                                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { title: 'Standard Rider', price: '₹199', features: ['Priority Booking', 'Zero Cancellation Fee'], color: 'slate-800' },
                                            { title: 'Elite Commuter', price: '₹499', features: ['Personal Assistant', 'Luxury Vehicle Lock', 'Premium Support'], color: 'primary-500' },
                                        ].map((plan, idx) => (
                                            <div key={idx} className={`p-8 rounded-[3rem] ${plan.color === 'primary-500' ? 'bg-primary-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-white'} relative group transition-all hover:scale-[1.02]`}>
                                                {plan.color === 'primary-500' && (
                                                    <div className="absolute top-6 right-6 px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase rounded-full">Most Popular</div>
                                                )}
                                                <h5 className="text-xl font-black mb-1">{plan.title}</h5>
                                                <div className="text-4xl font-black mb-8 flex items-baseline gap-1">
                                                    {plan.price} <span className="text-xs font-bold opacity-60">/mo</span>
                                                </div>
                                                <ul className="space-y-4 mb-8">
                                                    {plan.features.map((feat, fIdx) => (
                                                        <li key={fIdx} className="flex items-center gap-3 text-sm font-bold">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.color === 'primary-500' ? 'bg-slate-950/10' : 'bg-primary-500/10'}`}>
                                                                <ChevronRight className="w-3 h-3" />
                                                            </div>
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                                    plan.color === 'primary-500' 
                                                    ? 'bg-slate-950 text-white hover:bg-slate-800' 
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                }`}>
                                                    Configure Tier
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Revenue Analytics Visual: High-End Area Chart */}
                            <section className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-black dark:text-white tracking-tight">Revenue Velocity</h3>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Real-time Performance Metrics</p>
                                    </div>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl gap-1">
                                        {['24H', '7D', '30D', '1Y'].map(t => (
                                            <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${t === '30D' ? 'bg-primary-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                                    <div className="lg:col-span-3 h-80 relative group/chart">
                                        {/* SVG Area Chart */}
                                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f9bb06" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#f9bb06" stopOpacity="0" />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>
                                            
                                            {/* Grid Lines */}
                                            {[0, 100, 200, 300].map(y => (
                                                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="5,5" />
                                            ))}

                                            {/* Area Fill */}
                                            <path 
                                                d="M0,250 C100,220 200,280 300,180 C400,80 500,200 600,120 C700,40 800,150 900,80 C950,45 1000,60 1000,60 L1000,300 L0,300 Z" 
                                                fill="url(#chartGradient)" 
                                                className="animate-[fade-in_2s_ease-out]"
                                            />
                                            
                                            {/* Main Line with Glow */}
                                            <path 
                                                d="M0,250 C100,220 200,280 300,180 C400,80 500,200 600,120 C700,40 800,150 900,80 C950,45 1000,60 1000,60" 
                                                fill="none" 
                                                stroke="#f9bb06" 
                                                strokeWidth="4" 
                                                strokeLinecap="round" 
                                                filter="url(#glow)"
                                                className="animate-[draw_3s_ease-out]"
                                                style={{ strokeDasharray: 2000, strokeDashoffset: 0 }}
                                            />

                                            {/* Interactive Dots */}
                                            {[
                                                { x: 300, y: 180, val: '₹42k' },
                                                { x: 600, y: 120, val: '₹68k' },
                                                { x: 900, y: 80, val: '₹94k' }
                                            ].map((dot, i) => (
                                                <g key={i} className="group/dot cursor-pointer">
                                                    <circle cx={dot.x} cy={dot.y} r="8" fill="#f9bb06" className="group-hover/dot:scale-150 transition-transform shadow-xl" />
                                                    <circle cx={dot.x} cy={dot.y} r="15" fill="#f9bb06" className="opacity-0 group-hover/dot:opacity-20 transition-opacity animate-ping" />
                                                    <text x={dot.x} y={dot.y - 20} textAnchor="middle" className="opacity-0 group-hover/dot:opacity-100 text-[10px] font-black dark:text-white transition-opacity uppercase tracking-widest fill-current">
                                                        {dot.val}
                                                    </text>
                                                </g>
                                            ))}
                                        </svg>

                                        {/* Chart Labels */}
                                        <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pt-4">
                                            {['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4'].map(w => (
                                                <span key={w} className="text-[10px] font-black text-slate-400 tracking-widest">{w}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sub-analytics Distribution */}
                                    <div className="space-y-6">
                                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <h4 className="text-xs font-black dark:text-white uppercase tracking-widest mb-4">Subscription Mix</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Elite Commuter', val: 65, color: 'primary-500' },
                                                    { label: 'Standard Rider', val: 35, color: 'slate-400' }
                                                ].map((mix, i) => (
                                                    <div key={i} className="space-y-1.5">
                                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                            <span className="text-slate-400">{mix.label}</span>
                                                            <span className="dark:text-white">{mix.val}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className={`h-full bg-${mix.color} rounded-full`} style={{ width: `${mix.val}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-6 bg-primary-500 rounded-3xl text-slate-950">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Activity className="w-5 h-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Growth Forecast</span>
                                            </div>
                                            <div className="text-2xl font-black tracking-tighter">+24.8%</div>
                                            <p className="text-[10px] font-bold leading-tight mt-1 opacity-70">Projected revenue increase by next quarterly cycle.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800/50 relative overflow-hidden group cursor-pointer transition-all duration-700 hover:border-primary-500/30">
                            {/* Waving Circles Ripple Effect */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                {[1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className="absolute w-64 h-64 rounded-full bg-white dark:bg-primary-500/20 opacity-0 group-hover:animate-[ripple-wave_2s_infinite]" 
                                        style={{ animationDelay: `${(i - 1) * 0.6}s` }}
                                    />
                                ))}
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10">
                                <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl border-4 border-transparent group-hover:border-primary-500/50">
                                    <Lock className="w-16 h-16 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <h3 className="text-4xl font-black dark:text-white tracking-tighter uppercase group-hover:text-primary-500 transition-colors">High Level Access Required</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-4 text-lg font-medium leading-relaxed">
                                    This module contains sensitive infrastructure parameters. Access is limited to authorized system architects.
                                </p>
                            </div>
                            <button className="relative z-10 px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,187,6,0.3)] active:scale-95 group/btn overflow-hidden">
                                <div className="absolute inset-0 bg-primary-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
                                <span className="relative z-10 group-hover/btn:text-slate-950 transition-colors">Authenticate Profile</span>
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Settings;
