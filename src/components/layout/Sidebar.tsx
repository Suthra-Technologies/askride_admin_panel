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

import LogoutModal from '../common/LogoutModal';

const Sidebar: React.FC<{ isCollapsed: boolean; toggleCollapse: () => void }> = ({ isCollapsed, toggleCollapse }) => {
    const { logout } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
    const [logoutButtonRect, setLogoutButtonRect] = React.useState<DOMRect | null>(null);
    const logoutButtonRef = React.useRef<HTMLButtonElement>(null);

    const handleLogoutClick = () => {
        if (logoutButtonRef.current) {
            setLogoutButtonRect(logoutButtonRef.current.getBoundingClientRect());
        }
        setShowLogoutDialog(true);
    };

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
                        ref={logoutButtonRef}
                        onClick={handleLogoutClick}
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

            <LogoutModal
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onLogout={logout}
                triggerRect={logoutButtonRect}
            />
        </>
    );
};

export default Sidebar;
