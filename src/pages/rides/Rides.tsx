import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Users,
    Clock,
    Navigation,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    AlertCircle,
    User,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { adminApi } from '../../services/api';

const Rides: React.FC = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRides = async () => {
        setIsLoading(true);
        try {
            const params = statusFilter !== 'all' ? { status: statusFilter } : {};
            const res = await adminApi.getRides(params);
            setRides(res.data);
        } catch (error) {
            console.error("Failed to fetch rides", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, [statusFilter]);

    const filteredRides = rides.filter(ride =>
        ride.startLocationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.endLocationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driver?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100';
            case 'Published':
                return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100';
            case 'Completed':
                return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100';
            case 'Cancelled':
                return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ride Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor live rides, bookings, and platform activity.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search location or driver..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none dark:text-white w-64"
                        />
                    </div>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {['all', 'Published', 'Ongoing', 'Completed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f
                                        ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Loading platform rides...</p>
                </div>
            ) : filteredRides.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredRides.map((ride) => (
                        <div key={ride._id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Route Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(ride.status)}`}>
                                                {ride.status}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(ride.startTime).toLocaleDateString()} at {new Date(ride.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="space-y-4 relative">
                                            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800 border-dashed border-l" />

                                            <div className="relative flex gap-4">
                                                <div className="mt-1.5 z-10 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border-4 border-white dark:border-slate-900">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter mb-0.5">Pickup</p>
                                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{ride.startLocationName}</h4>
                                                </div>
                                            </div>

                                            <div className="relative flex gap-4">
                                                <div className="mt-1.5 z-10 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border-4 border-white dark:border-slate-900">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mb-0.5">Dropoff</p>
                                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{ride.endLocationName}</h4>
                                                </div>
                                            </div>
                                        </div>

                                        {ride.status === 'Ongoing' && ride.currentLocation && (
                                            <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                                            <Navigation className="w-4 h-4 text-primary-600 animate-pulse" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-900 dark:text-white">Live Tracking Active</p>
                                                            <p className="text-[10px] text-slate-500 mt-0.5">Coords: {ride.currentLocation.coordinates[1].toFixed(4)}, {ride.currentLocation.coordinates[0].toFixed(4)}</p>
                                                        </div>
                                                    </div>
                                                    <button className="px-3 py-1.5 bg-primary-600 text-white text-[10px] font-bold rounded-lg hover:bg-primary-700 transition-colors">
                                                        Open Map
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats & People */}
                                    <div className="lg:w-80 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <Users className="w-4 h-4 text-slate-400 mb-2" />
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{ride.joinedCount}/{ride.totalSeats}</p>
                                                <p className="text-[10px] font-medium text-slate-500">Joined Seats</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <AlertCircle className={`w-4 h-4 mb-2 ${ride.pendingRequestsCount > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} />
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{ride.pendingRequestsCount}</p>
                                                <p className="text-[10px] font-medium text-slate-500">Pending Requests</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-primary-600 border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    {ride.driver?.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Driver Info</p>
                                                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{ride.driver?.firstName} {ride.driver?.lastName}</h5>
                                                    <p className="text-[10px] text-slate-500">{ride.vehicle?.model} • {ride.vehicle?.vehicleNumber}</p>
                                                </div>
                                                <button className="ml-auto p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </div>

                                            {ride.joinedCount > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">Joined Passengers</p>
                                                    <div className="flex -space-x-2 overflow-hidden px-1">
                                                        {Array.from({ length: Math.min(ride.joinedCount, 5) }).map((_, i) => (
                                                            <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-slate-500" />
                                                            </div>
                                                        ))}
                                                        {ride.joinedCount > 5 && (
                                                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-primary-100 flex items-center justify-center">
                                                                <span className="text-[10px] font-bold text-primary-600">+{ride.joinedCount - 5}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">No active rides found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">There are no rides matching your current filter in the system.</p>
                </div>
            )}
        </div>
    );
};

export default Rides;
