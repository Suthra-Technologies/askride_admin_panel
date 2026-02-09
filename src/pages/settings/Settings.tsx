import React from 'react';
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
    Clock
} from 'lucide-react';
import { useDialog } from '../../context/DialogContext';

const Settings: React.FC = () => {
    const { confirm, showAlert } = useDialog();

    const handleSavePricing = () => {
        confirm({
            title: 'Save Changes',
            message: 'Are you sure you want to update the platform pricing? This will affect all new ride bookings immediately.',
            type: 'confirm',
            confirmText: 'Update Pricing',
            onConfirm: () => {
                // In a real app, call API here
                showAlert("Settings Updated", "The pricing and revenue configuration has been saved successfully.", 'success');
            }
        });
    };
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Configure global parameters and business rules.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: 'general', label: 'General Settings', icon: Globe, active: true },
                        { id: 'pricing', label: 'Pricing & Commission', icon: IndianRupee },
                        { id: 'profile', label: 'Admin Profile', icon: User },
                        { id: 'security', label: 'Security & Auth', icon: Shield },
                        { id: 'notifications', label: 'Notification Rules', icon: Bell },
                        { id: 'billing', label: 'Subscriptions', icon: CreditCard },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${item.active
                                ? 'bg-[#F9BB06] text-[#1A1A1A] shadow-lg shadow-primary-100 dark:shadow-none'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Pricing Config Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <IndianRupee className="w-6 h-6 text-primary-600" /> Pricing & Revenue Configuration
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Manage fare calculations and platform fees.</p>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Base Fare (Per KM)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                            <IndianRupee className="w-4 h-4" />
                                        </div>
                                        <input type="number" defaultValue="2.50" className="block w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Platform Commission</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold">
                                            %
                                        </div>
                                        <input type="number" defaultValue="15" className="block w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 text-amber-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Peak Hour Surge Multiplier
                                    </label>
                                    <input type="number" defaultValue="1.5" className="block w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Minimum Ride Distance (KM)</label>
                                    <input type="number" defaultValue="2" className="block w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 font-bold dark:text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                            <button
                                onClick={handleSavePricing}
                                className="px-8 py-3 bg-[#F9BB06] hover:bg-primary-700 text-[#1A1A1A] rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary-100 dark:shadow-none"
                            >
                                <Save className="w-4 h-4" /> Save Pricing Changes
                            </button>
                        </div>
                    </div>

                    {/* System Status Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
                        <h3 className="text-xl font-bold dark:text-white mb-6">Service Availability</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Ride Request API', status: 'Online', color: 'bg-emerald-500' },
                                { name: 'Payment Processing Service', status: 'Online', color: 'bg-emerald-500' },
                                { name: 'Push Notification Gateway', status: 'Degraded', color: 'bg-amber-500' },
                                { name: 'Driver Tracking System', status: 'Online', color: 'bg-emerald-500' },
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${service.color} animate-pulse`} />
                                        <span className="font-bold dark:text-white">{service.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500">{service.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
