import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Download,
    Calendar,
    Filter,
    DollarSign,
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
                <StatsCard title="Total Revenue" value={`₹${totalMonthlyRevenue.toLocaleString()}`} icon={DollarSign} trend={{ value: 24, isUp: true }} color="success" />
                <StatsCard title="Avg. Ticket Size" value="₹450" icon={TrendingUp} trend={{ value: 5, isUp: true }} color="primary" />
                <StatsCard title="User Acquisition" value={growthData.reduce((acc: any, cur: any) => acc + cur.users, 0)} icon={TrendingUp} trend={{ value: 12, isUp: true }} color="secondary" />
                <StatsCard title="Churn Rate" value="1.8%" icon={TrendingDown} trend={{ value: 0.2, isUp: false }} color="error" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Growth Chart */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold dark:text-white">Growth Trends (Last 7 Days)</h3>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-primary-500" /> Revenue (₹)</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-secondary-500" /> Users</span>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f9bb06" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f9bb06" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', padding: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#f9bb06" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white mb-8">Performance Summary</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Platform Usage', value: 'High', percent: 85, color: 'bg-primary-500' },
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
