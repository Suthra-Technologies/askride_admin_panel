import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Car,
    ShieldCheck,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    Navigation
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC<{ isCollapsed: boolean; toggleCollapse: () => void }> = ({ isCollapsed, toggleCollapse }) => {
    const { logout } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { title: 'Analytics', icon: BarChart3, path: '/analytics' },
        { title: 'User Management', icon: Users, path: '/users' },
        { title: 'Ride Management', icon: Car, path: '/rides' },
        { title: 'Driver Verification', icon: ShieldCheck, path: '/verification' },
        { title: 'Notifications', icon: Bell, path: '/notifications' },
        { title: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <>
            <aside
                className={cn(
                    "fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50 flex flex-col",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#F9BB06] rounded-lg flex items-center justify-center">
                                <Navigation className="text-white w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight dark:text-white">AskRide</span>
                        </div>
                    )}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mx-auto"
                    >
                        {isCollapsed ? <Menu className="w-5 h-5 dark:text-slate-400" /> : <ChevronLeft className="w-5 h-5 dark:text-slate-400" />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isCollapsed && "mx-auto"
                            )} />
                            {!isCollapsed && <span className="font-medium">{item.title}</span>}
                            {!isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400 scale-0 group-[.active]:scale-100 transition-transform" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setShowLogoutDialog(true)}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

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

export default Sidebar;
