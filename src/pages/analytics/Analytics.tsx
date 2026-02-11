import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    Filter,
    DollarSign,
    IndianRupee,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '../../services/api';
import StatsCard from '../../components/dashboard/StatsCard';

const Analytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await adminApi.getAnalytics();
                setAnalytics(res.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    // Process growth data for the chart
    const growthData = analytics?.growth?.map((item: any) => ({
        name: item.date.split('-').slice(1).join('/'), // short date
        users: item.count,
        revenue: analytics.revenue.find((r: any) => r.date === item.date)?.amount || 0
    })) || [];

    const totalMonthlyRevenue = analytics?.revenue?.reduce((acc: number, cur: any) => acc + cur.amount, 0) || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive financial and growth metrics.</p>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Revenue" value={`₹${totalMonthlyRevenue.toLocaleString()}`} icon={IndianRupee} trend={{ value: 24, isUp: true }} color="success" />
                <StatsCard title="Avg. Ticket Size" value="₹450" icon={TrendingUp} trend={{ value: 5, isUp: true }} color="primary" />
                <StatsCard title="User Acquisition" value={growthData.reduce((acc: any, cur: any) => acc + cur.users, 0)} icon={TrendingUp} trend={{ value: 12, isUp: true }} color="secondary" />
                <StatsCard title="Churn Rate" value="1.8%" icon={TrendingDown} trend={{ value: 0.2, isUp: false }} color="error" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Growth Chart with Liquid Glass Effect */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
                    className="xl:col-span-2 relative overflow-hidden glass p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(249,187,6,0.1)] border border-white/30 dark:border-slate-800/50"
                >
                    {/* Animated Liquid Blobs in Background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                        <motion.div
                            animate={{
                                x: [0, 50, -30, 0],
                                y: [0, -40, 60, 0],
                                scale: [1, 1.2, 0.9, 1],
                                rotate: [0, 90, 180, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-20 -left-20 w-80 h-80 bg-primary-400/20 blur-[80px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                x: [0, -60, 40, 0],
                                y: [0, 50, -30, 0],
                                scale: [1, 0.8, 1.1, 1],
                                rotate: [0, -120, -240, 0]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-secondary-500/10 blur-[100px] rounded-full"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(249,187,6,0.5)]" />
                                    Growth Trends
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Real-time performance distribution</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-500/90 border border-secondary-500" /> Revenue
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Users
                                </span>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="40%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f9bb06" stopOpacity={0.4} />
                                            <stop offset="50%" stopColor="#f9bb06" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#f9bb06" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="8 8"
                                        vertical={false}
                                        stroke="rgba(148, 163, 184, 0.1)"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        dy={15}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                                        dx={-10}
                                    />

                                    <Tooltip
                                        cursor={{ stroke: 'rgba(99, 102, 241, 0.1)', strokeWidth: 20 }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            backdropFilter: 'blur(16px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '24px',
                                            padding: '20px',
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                        }}
                                        itemStyle={{ fontSize: '14px', fontWeight: '800', padding: '2px 0' }}
                                    />

                                    {/* Liquid Area Gradients */}
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#6366f1"
                                        strokeWidth={1}
                                        strokeDasharray="5 5"
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        animationDuration={2500}
                                        animationEasing="ease-in-out"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#f9bb06"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        animationDuration={2000}
                                        animationEasing="ease-in-out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </motion.div>

                {/* Breakdown Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white mb-8">Performance Summary</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Platform Usage', value: 'High', percent: 85, color: 'bg-secondary-500' },
                            { label: 'Driver Activity', value: 'Moderate', percent: 62, color: 'bg-emerald-500' },
                            { label: 'Cancellation Rate', value: '4.2%', percent: 12, color: 'bg-rose-500' },
                            { label: 'App Uptime', value: '99.9%', percent: 99, color: 'bg-secondary-500' },
                        ].map((source, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{source.label}</span>
                                    <span className="text-sm font-extrabold dark:text-white">{source.value}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${source.color} transition-all duration-1000`} style={{ width: `${source.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold dark:text-white">Active Insights</h4>
                                <p className="text-xs text-slate-500">Weekly report available</p>
                            </div>
                        </div>
                        <button className="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-600 transition-all text-sm">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
