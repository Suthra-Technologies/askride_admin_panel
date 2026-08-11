import React, { useState, useEffect, useCallback } from 'react';
import {
    Bell,
    Moon,
    Sun,
    User as UserIcon,
    Search as SearchIcon,
    ChevronDown,
    LogOut,
    ShieldCheck,
    XCircle,
    CheckCheck,
    Inbox
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDialog } from '../../context/DialogContext';
import { adminApi } from '../../services/api';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// import LogoutModal from '../common/LogoutModal';

const Navbar: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const { confirm } = useDialog();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    // The badge polls on its own so a new event shows up without a page refresh.
    // Cheap query (a countDocuments), unlike fetching the whole list.
    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await adminApi.getUnreadNotificationCount();
            setUnreadCount(res.data.unreadCount || 0);
        } catch (error) {
            // A failing badge must never break the navbar - leave the last known count.
            console.error('Failed to fetch unread notification count', error);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const intervalId = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(intervalId);
    }, [fetchUnreadCount]);

    // The full list is only fetched when the panel is actually opened.
    const fetchNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            const res = await adminApi.getNotifications({ page: 1, limit: 10 });
            setNotifications(res.data.data || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    const handleToggleNotifications = () => {
        const opening = !showNotifications;
        setShowNotifications(opening);
        if (opening) fetchNotifications();
    };

    const handleNotificationClick = async (notification: any) => {
        setShowNotifications(false);

        if (!notification.isRead) {
            // Update locally first so the panel reacts immediately, then persist.
            setNotifications(prev =>
                prev.map(n => (n._id === notification._id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(prev - 1, 0));
            try {
                await adminApi.markNotificationRead(notification._id);
            } catch (error) {
                console.error('Failed to mark notification as read', error);
                fetchUnreadCount();
            }
        }

        if (notification.link) navigate(notification.link);
    };

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        try {
            await adminApi.markAllNotificationsRead();
        } catch (error) {
            console.error('Failed to mark all notifications as read', error);
            fetchUnreadCount();
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ADMIN_VERIFICATION_SUBMITTED':
                return { Icon: ShieldCheck, className: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' };
            case 'ADMIN_RIDE_CANCELLED':
                return { Icon: XCircle, className: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' };
            default:
                return { Icon: Bell, className: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };
        }
    };

    const formatTimestamp = (value?: string) => {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        return formatDistanceToNow(date, { addSuffix: true });
    };

    const handleLogoutClick = () => {
        setShowProfileMenu(false);
        confirm({
            title: 'Logout',
            message: 'Ready to take a break? We\'ll save your spot for next time.',
            type: 'danger',
            confirmText: 'Sign Out',
            cancelText: 'Not yet',
            onConfirm: () => logout()
        });
    };

    return (
        <>
            <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-96 hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for rides, users, or reports..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                    />
                </div>

                <div className="flex items-center gap-6">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={handleToggleNotifications}
                            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                            className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                <div className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-fade-in overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="ml-2 text-xs font-medium text-slate-400">{unreadCount} unread</span>
                                            )}
                                        </h4>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline"
                                            >
                                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[400px] overflow-y-auto">
                                        {isLoadingNotifications ? (
                                            <div className="py-10 flex justify-center">
                                                <div className="w-6 h-6 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
                                            </div>
                                        ) : notifications.length > 0 ? (
                                            notifications.map((notification) => {
                                                const { Icon, className } = getNotificationIcon(notification.type);
                                                return (
                                                    <button
                                                        key={notification._id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={cn(
                                                            "w-full text-left flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                                                            !notification.isRead && "bg-primary-50/40 dark:bg-primary-900/10"
                                                        )}
                                                    >
                                                        <div className={cn("shrink-0 w-9 h-9 rounded-xl flex items-center justify-center", className)}>
                                                            <Icon className="w-4.5 h-4.5" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start gap-2">
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                                                    {notification.title}
                                                                </p>
                                                                {!notification.isRead && (
                                                                    <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-primary-500" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                                {formatTimestamp(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <div className="py-12 text-center px-6">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Inbox className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">You're all caught up</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    New verifications and ride cancellations will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border-2 border-white dark:border-slate-800 shadow-sm">
                                {user?.fullName.charAt(0) || 'A'}
                            </div>
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">{user?.fullName || 'Admin'}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Super Admin'}</p>
                            </div>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showProfileMenu && "rotate-180")} />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-fade-in">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.email}</p>
                                </div>
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <UserIcon className="w-4 h-4" /> Account Settings
                                </button>
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
