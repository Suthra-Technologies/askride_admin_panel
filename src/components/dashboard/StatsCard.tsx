import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const colorVariants = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    secondary: 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    error: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md hover:translate-y-[-2px]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>

                    {trend && (
                        <div className="mt-2 flex items-center gap-1">
                            <span className={cn(
                                "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                                trend.isUp
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                                    : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                            )}>
                                {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={cn("p-3 rounded-xl", colorVariants[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
