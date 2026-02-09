import React, { useState, useEffect } from 'react';
import {
    Users,
    Car,
    DollarSign,
    Star,
    UserPlus,
    Clock,
    TrendingUp,
    MapPin,
    ArrowRight
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
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import StatsCard from '../../components/dashboard/StatsCard';
import { adminApi } from '../../services/api';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentRides, setRecentRides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const COLORS = ['#f9bb06', '#0ea5e9', '#10b981', '#f59e0b'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, ridesRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getRides({ limit: 5 })
                ]);
                setStats(statsRes.data);
                setRecentRides(ridesRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    const pieData = [
        { name: 'Active', value: stats?.activeRides || 0 },
        { name: 'Pending', value: stats?.pendingVerifications || 0 },
        { name: 'Drivers', value: stats?.activeDrivers || 0 },
        { name: 'Total Users', value: stats?.totalUsers || 0 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of TravelMate operations.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <StatsCard
                    title="Active Rides"
                    value={stats?.activeRides || 0}
                    icon={Car}
                    trend={{ value: 12, isUp: true }}
                    color="primary"
                />
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    trend={{ value: 8, isUp: true }}
                    color="secondary"
                />
                <StatsCard
                    title="Revenue"
                    value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    trend={{ value: 15, isUp: true }}
                    color="success"
                />
                <StatsCard
                    title="Average Rating"
                    value={4.7}
                    icon={Star}
                    color="warning"
                />
                <StatsCard
                    title="Active Drivers"
                    value={stats?.activeDrivers || 0}
                    icon={UserPlus}
                    color="primary"
                />
                <StatsCard
                    title="Pending Verification"
                    value={stats?.pendingVerifications || 0}
                    icon={Clock}
                    color="error"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualizations could go here, for now using stats */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> Platform Growth
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pieData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f9bb06" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f9bb06" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#f9bb06" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Distribution</h3>
                    <div className="h-80 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#98b3deff', border: 'none', borderRadius: '12px', color: '#6d6464ff' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry: any) => {
                                        const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
                                        const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(0) : 0;
                                        return (
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {value}: <span className="text-slate-900 dark:text-white">{entry.payload.value} ({percent}%)</span>
                                            </span>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Rides Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Rides</h3>
                    <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fare</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentRides.length > 0 ? recentRides.map((ride) => (
                                <tr key={ride._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                                                {ride.driverId?.firstName?.charAt(0) || 'D'}
                                            </div>
                                            <span className="font-medium dark:text-white">
                                                {ride.driverId?.firstName} {ride.driverId?.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-primary-500" /> {ride.startLocationName || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-secondary-500" /> {ride.endLocationName || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">₹{ride.pricePerSeat}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ride.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                            ride.status === 'Ongoing' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                                ride.status === 'Published' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                                                    'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400'
                                            }`}>
                                            {ride.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 italic">
                                        No recent rides found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
