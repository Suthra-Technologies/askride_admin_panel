import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserX,
    CheckCircle,
    Edit,
    Trash2,
    Mail,
    Calendar,
    Star as StarIcon,
    Shield
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useDialog } from '../../context/DialogContext';

const Users: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { confirm, showAlert } = useDialog();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getUsers({
                search: searchTerm,
                status: statusFilter !== 'all' ? statusFilter : undefined
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, statusFilter]);

    const handleBlockUser = async (id: string, currentlyBlocked: boolean) => {
        confirm({
            title: currentlyBlocked ? 'Unblock User' : 'Block User',
            message: `Are you sure you want to ${currentlyBlocked ? 'unblock' : 'block'} this user? This will ${currentlyBlocked ? 'restore' : 'restrict'} their access to the platform.`,
            type: currentlyBlocked ? 'success' : 'danger',
            confirmText: currentlyBlocked ? 'Unblock' : 'Block User',
            onConfirm: async () => {
                try {
                    await adminApi.blockUser(id, !currentlyBlocked);
                    fetchUsers();
                    showAlert("Success", `User has been ${currentlyBlocked ? 'unblocked' : 'blocked'} successfully.`, 'success');
                } catch (error) {
                    showAlert("Action Failed", "We couldn't process this request. Please try again.", 'alert');
                }
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and monitor all platform users.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 appearance-none w-full"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Active</option>
                            <option value="basic">Pending</option>
                            <option value="incomplete">Incomplete</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <div className="w-8 h-8 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length > 0 ? users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                                                {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white capitalize leading-tight mb-0.5">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email || 'No email'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-sm font-medium dark:text-slate-300">
                                        <span className={`px-2 py-0.5 rounded-lg border ${user.role === 'DRIVER' ? 'border-primary-200 text-primary-600 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-800' : 'border-slate-200 text-slate-600 bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${!user.isBlocked ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${!user.isBlocked ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                                        {user.phone}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleBlockUser(user._id, !!user.isBlocked)}
                                                className={`p-2 rounded-lg transition-colors ${user.isBlocked ? 'hover:bg-emerald-50 text-emerald-600 shadow-emerald-100' : 'hover:bg-rose-50 text-rose-600 shadow-rose-100'}`}
                                                title={user.isBlocked ? 'Unblock' : 'Block'}
                                            >
                                                {user.isBlocked ? <Shield className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 italic">
                                        No users found.
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

export default Users;
