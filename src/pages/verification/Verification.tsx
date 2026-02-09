import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    ExternalLink,
    Check,
    X,
    Clock,
    Eye,
    FileText,
    User
} from 'lucide-react';
import { adminApi } from '../../services/api';

const Verification: React.FC = () => {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');

    const fetchVerifications = async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getVerifications();
            setVerifications(res.data);
        } catch (error) {
            console.error("Failed to fetch verifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, []);

    const filteredVerifications = verifications.filter(driver => {
        if (filter === 'all') return true;
        if (filter === 'pending') {
            // Pending if driver is unverified OR any vehicle is unverified
            return !driver.isDriverVerified || driver.vehicleIds?.some((v: any) => !v.isVerified);
        }
        if (filter === 'verified') {
            // Verified if driver license is verified AND ID is verified AND all vehicles are verified
            return driver.isDriverVerified && driver.isIdVerified && driver.vehicleIds?.every((v: any) => v.isVerified);
        }
        return true;
    });

    const isFullyVerified = (driver: any) => {
        return driver.isDriverVerified && driver.isIdVerified && driver.vehicleIds?.every((v: any) => v.isVerified);
    };

    const handleVerifyId = async (id: string, approved: boolean) => {
        if (!window.confirm(`Are you sure you want to ${approved ? 'approve' : 'reject'} this ID proof?`)) return;
        try {
            await adminApi.verifyIdProof(id, approved);
            fetchVerifications();
        } catch (error) {
            alert("Action failed");
        }
    };

    const handleVerifyLicense = async (id: string, approved: boolean) => {
        if (!window.confirm(`Are you sure you want to ${approved ? 'approve' : 'reject'} this license?`)) return;
        try {
            await adminApi.verifyLicense(id, approved);
            fetchVerifications();
        } catch (error) {
            alert("Action failed");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    const handleViewDocument = (url?: string) => {
        if (!url) {
            alert("Document image not available");
            return;
        }
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Driver Verification</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve driver registration documents.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    {(['all', 'pending', 'verified'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize ${filter === f
                                ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredVerifications.length > 0 ? filteredVerifications.map((driver) => (
                    <div key={driver._id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xl relative">
                                    {driver.firstName?.charAt(0) || <User />}
                                    {isFullyVerified(driver) && (
                                        <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold dark:text-white">{driver.firstName} {driver.lastName}</h3>
                                        {isFullyVerified(driver) && (
                                            <span className="px-2 py-0.5 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 font-mono">
                                        {driver.phone} • {driver.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* License Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <FileText className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${driver.isDriverVerified ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {driver.isDriverVerified ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Driver License</h4>
                                <p className="text-xs text-slate-500 mb-4 font-mono">No: {driver.driverLicenseNumber || 'Not Provided'}</p>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            disabled={!driver.driverLicenseDocument?.front}
                                            onClick={() => handleViewDocument(driver.driverLicenseDocument?.front)}
                                            className="py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold rounded-lg border border-slate-200 transition-all"
                                        >
                                            Front View
                                        </button>
                                        <button
                                            disabled={!driver.driverLicenseDocument?.back}
                                            onClick={() => handleViewDocument(driver.driverLicenseDocument?.back)}
                                            className="py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold rounded-lg border border-slate-200 transition-all"
                                        >
                                            Back View
                                        </button>
                                    </div>
                                    {!driver.isDriverVerified ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerifyLicense(driver._id, false)}
                                                className="flex-1 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleVerifyLicense(driver._id, true)}
                                                className="flex-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all px-4"
                                            >
                                                Verify License
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleVerifyLicense(driver._id, false)}
                                            className="w-full py-2 bg-slate-50 text-slate-500 hover:bg-slate-100 text-[10px] font-bold rounded-lg border border-slate-200 transition-all uppercase tracking-wider"
                                        >
                                            Reset to Pending
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ID Proof Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${driver.isIdVerified ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {driver.isIdVerified ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{driver.idProofType?.replace(/_/g, ' ') || 'Identity Proof'}</h4>
                                <p className="text-xs text-slate-500 mb-4 font-mono">No: {driver.idProofNumber || 'Not Provided'}</p>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            disabled={!driver.idProofDocument?.front}
                                            onClick={() => handleViewDocument(driver.idProofDocument?.front)}
                                            className="py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold rounded-lg border border-slate-200 transition-all"
                                        >
                                            Front View
                                        </button>
                                        <button
                                            disabled={!driver.idProofDocument?.back}
                                            onClick={() => handleViewDocument(driver.idProofDocument?.back)}
                                            className="py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold rounded-lg border border-slate-200 transition-all"
                                        >
                                            Back View
                                        </button>
                                    </div>
                                    {!driver.isIdVerified ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerifyId(driver._id, false)}
                                                className="flex-1 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg transition-all"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleVerifyId(driver._id, true)}
                                                className="flex-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all px-4"
                                            >
                                                Verify ID Proof
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleVerifyId(driver._id, false)}
                                            className="w-full py-2 bg-slate-50 text-slate-500 hover:bg-slate-100 text-[10px] font-bold rounded-lg border border-slate-200 transition-all uppercase tracking-wider"
                                        >
                                            Reset to Pending
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Info */}
                            {driver.vehicleIds?.map((vehicle: any) => (
                                <div key={vehicle._id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                            <ShieldCheck className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${vehicle.isVerified ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {vehicle.isVerified ? 'VERIFIED' : 'PENDING'}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{vehicle.model} ({vehicle.vehicleType})</h4>
                                    <p className="text-xs text-slate-500 mb-4 font-mono">No: {vehicle.vehicleNumber}</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs font-bold dark:text-white">
                                            <span>RC Document:</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleViewDocument(vehicle.rcDocument?.front)} className="text-primary-600 hover:underline">Front</button>
                                                <span>•</span>
                                                <button onClick={() => handleViewDocument(vehicle.rcDocument?.back)} className="text-primary-600 hover:underline">Back</button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold dark:text-white">
                                            <span>Insurance:</span>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleViewDocument(vehicle.insuranceDocument?.front)} className="text-primary-600 hover:underline">Front</button>
                                                <span>•</span>
                                                <button onClick={() => handleViewDocument(vehicle.insuranceDocument?.back)} className="text-primary-600 hover:underline">Back</button>
                                            </div>
                                        </div>

                                        {!vehicle.isVerified ? (
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Reject this vehicle?")) {
                                                            try {
                                                                await adminApi.verifyVehicle(vehicle._id, false);
                                                                fetchVerifications();
                                                            } catch (error) {
                                                                alert("Failed to reject vehicle");
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Verify this vehicle?")) {
                                                            try {
                                                                await adminApi.verifyVehicle(vehicle._id, true);
                                                                fetchVerifications();
                                                            } catch (error) {
                                                                alert("Failed to verify vehicle");
                                                            }
                                                        }
                                                    }}
                                                    className="flex-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all px-4"
                                                >
                                                    Verify Vehicle
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Move this vehicle back to pending?")) {
                                                        try {
                                                            await adminApi.verifyVehicle(vehicle._id, false);
                                                            fetchVerifications();
                                                        } catch (error) {
                                                            alert("Failed to update vehicle");
                                                        }
                                                    }
                                                }}
                                                className="w-full py-2 mt-2 bg-slate-50 text-slate-500 hover:bg-slate-100 text-[10px] font-bold rounded-lg border border-slate-200 transition-all uppercase tracking-wider"
                                            >
                                                Reset to Pending
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">All Caught Up!</h3>
                        <p className="text-slate-500 dark:text-slate-400">There are no pending driver verification requests at the moment.</p>
                    </div>
                )}
            </div>

            {/* Verification Policy Card */}
            <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-200 dark:shadow-none">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-5 bg-white/20 backdrop-blur-md rounded-2xl">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Verification Guidelines Updated</h3>
                        <p className="text-white/80 max-w-xl">
                            Please ensure all documents are valid, legible, and not expired before approving.
                            Double check the license number against national databases for high-risk profiles.
                        </p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
        </div>
    );
};

export default Verification;
