import React, { useState } from 'react';
import {
    Search,
    Bell,
    Moon,
    Sun,
    User as UserIcon,
    Search as SearchIcon,
    ChevronDown,
    LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Navbar: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
                    <button className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </button>

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
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        setShowLogoutDialog(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowLogoutDialog(false)}
                    />

                    {/* Dialog Content */}
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-in">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6">
                                <LogOut className="w-10 h-10 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 underline decoration-[#F9BB06] decoration-4 underline-offset-4">LOGOUT</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
                                Are you sure you want to exit the session?
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutDialog(false);
                                    logout();
                                }}
                                className="py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-none transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
