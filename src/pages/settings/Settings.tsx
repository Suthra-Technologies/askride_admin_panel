import React, { useState, useEffect } from 'react';
import {
    User,
    Palette,
    Save,
    Loader2,
    Moon,
    Sun,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    LogOut,
    RotateCcw,
    Users as UsersIcon,
    Bell,
    Activity,
    UserPlus,
    UserMinus,
    Search,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useDialog } from '../../context/DialogContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

type ProfileForm = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};

const EMPTY_FORM: ProfileForm = { firstName: '', lastName: '', email: '', phone: '' };

const Settings: React.FC = () => {
    const { confirm, showAlert } = useDialog();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { logout } = useAuth();

    const [profile, setProfile] = useState<any>(null);
    const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [team, setTeam] = useState<any[]>([]);
    const [status, setStatus] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [savingFlag, setSavingFlag] = useState<string | null>(null);

    // Promote-a-user search
    const [userQuery, setUserQuery] = useState('');
    const [userResults, setUserResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const toForm = (data: any): ProfileForm => ({
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        email: data?.email || '',
        phone: data?.phone || ''
    });

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await adminApi.getProfile();
            setProfile(res.data);
            setForm(toForm(res.data));
        } catch (error) {
            console.error('Failed to fetch admin profile', error);
            showAlert('Load Failed', "We couldn't load your profile. Please refresh the page.", 'alert');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeam = async () => {
        try {
            const res = await adminApi.getTeam();
            setTeam(res.data || []);
        } catch (error) {
            console.error('Failed to fetch admin team', error);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchTeam();
        adminApi.getPlatformStatus()
            .then(res => setStatus(res.data))
            .catch(err => console.error('Failed to fetch platform status', err));
        adminApi.getSettings()
            .then(res => setSettings(res.data))
            .catch(err => console.error('Failed to fetch settings', err));
    }, []);

    // Debounced search for a user to promote.
    useEffect(() => {
        if (!userQuery.trim()) {
            setUserResults([]);
            return;
        }
        setIsSearching(true);
        const timeoutId = setTimeout(async () => {
            try {
                const res = await adminApi.getUsers({ search: userQuery, page: 1, limit: 5 });
                setUserResults((res.data.data || []).filter((u: any) => u.role !== 'ADMIN'));
            } catch (error) {
                console.error('Failed to search users', error);
            } finally {
                setIsSearching(false);
            }
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [userQuery]);

    const handlePromote = (user: any) => {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.phone;
        confirm({
            title: 'Grant Admin Access',
            message: `${name} will get full access to this dashboard — every user, ride, verification and broadcast. They sign in with ${user.email || 'their email'}. Continue?`,
            type: 'confirm',
            confirmText: 'Grant Access',
            onConfirm: async () => {
                try {
                    await adminApi.promoteToAdmin(user._id);
                    setUserQuery('');
                    setUserResults([]);
                    fetchTeam();
                    showAlert('Admin Added', `${name} now has admin access.`, 'success');
                } catch (error: any) {
                    showAlert('Failed', error?.response?.data?.message || "We couldn't grant admin access.", 'alert');
                }
            }
        });
    };

    const handleDemote = (member: any) => {
        const name = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email;
        confirm({
            title: 'Remove Admin Access',
            message: `${name} will lose access to this dashboard and return to a normal passenger account. Continue?`,
            type: 'danger',
            confirmText: 'Remove Access',
            onConfirm: async () => {
                try {
                    await adminApi.demoteAdmin(member._id);
                    fetchTeam();
                    showAlert('Admin Removed', `${name} no longer has admin access.`, 'success');
                } catch (error: any) {
                    showAlert('Failed', error?.response?.data?.message || "We couldn't remove admin access.", 'alert');
                }
            }
        });
    };

    const handleToggleSetting = async (flag: string) => {
        const next = !settings?.[flag];
        setSavingFlag(flag);
        setSettings((prev: any) => ({ ...prev, [flag]: next }));
        try {
            const res = await adminApi.updateSettings({ [flag]: next });
            setSettings(res.data);
        } catch (error) {
            setSettings((prev: any) => ({ ...prev, [flag]: !next }));
            showAlert('Failed', "We couldn't save that preference.", 'alert');
        } finally {
            setSavingFlag(null);
        }
    };

    // Only enable Save when something actually changed.
    const isDirty = profile
        ? (Object.keys(form) as (keyof ProfileForm)[]).some(key => form[key] !== toForm(profile)[key])
        : false;

    const handleSave = () => {
        const emailChanged = profile && form.email !== profile.email;

        const commit = async () => {
            setIsSaving(true);
            try {
                const res = await adminApi.updateProfile(form);
                setProfile(res.data);
                setForm(toForm(res.data));
                showAlert('Profile Updated', 'Your account details have been saved.', 'success');
            } catch (error: any) {
                showAlert(
                    'Save Failed',
                    error?.response?.data?.message || "We couldn't save your changes. Please try again.",
                    'alert'
                );
            } finally {
                setIsSaving(false);
            }
        };

        // Changing the email changes the address you sign in with - worth confirming.
        if (emailChanged) {
            confirm({
                title: 'Change Sign-in Email',
                message: `You sign in with your email address. After this change you'll need to use ${form.email} to log in and receive your OTP. Continue?`,
                type: 'confirm',
                confirmText: 'Change Email',
                onConfirm: commit
            });
            return;
        }

        commit();
    };

    const handleLogout = () => {
        confirm({
            title: 'Logout',
            message: "Ready to take a break? We'll save your spot for next time.",
            type: 'danger',
            confirmText: 'Sign Out',
            cancelText: 'Not yet',
            onConfirm: () => logout()
        });
    };

    const toggle = (checked: boolean, onChange: () => void, label: string, busy = false) => (
        <button
            onClick={onChange}
            disabled={busy}
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`relative w-14 h-8 rounded-full transition-colors shrink-0 disabled:opacity-50 ${checked ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );

    const sectionHeader = (Icon: any, title: string, subtitle: string, tone = 'primary') => (
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${tone === 'primary'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            </div>
        </div>
    );

    const field = (key: keyof ProfileForm, label: string, type = 'text', placeholder = '') => (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all"
            />
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
            </div>
        );
    }

    const initial = form.firstName?.charAt(0) || form.email?.charAt(0) || 'A';
    const displayName = `${form.firstName} ${form.lastName}`.trim() || 'Admin';

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your admin account and dashboard preferences.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Account summary */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 h-fit">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-2xl mb-4 capitalize">
                            {initial}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{displayName}</h3>
                        <span className="mt-2 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {profile?.role || 'Admin'}
                        </span>
                    </div>

                    <div className="mt-8 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300 truncate">{profile?.email || 'No email'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300 font-mono truncate">{profile?.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300 capitalize">
                                {profile?.profileStatus?.toLowerCase() || 'Unknown'} profile
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300">
                                Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 rounded-xl text-sm font-bold transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Editable sections */}
                <div className="xl:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Admin Profile</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your personal account details.</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {field('firstName', 'First Name', 'text', 'Ramu')}
                                {field('lastName', 'Last Name', 'text', 'Kodali')}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {field('email', 'Email Address', 'email', 'you@example.com')}
                                {field('phone', 'Phone Number', 'tel', '+91...')}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Your email is the address you sign in with and where your login OTP is sent.
                                Your role can't be changed from here.
                            </p>
                        </div>

                        <div className="px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setForm(toForm(profile))}
                                disabled={!isDirty || isSaving}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isDirty || isSaving}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </section>

                    {/* Admin Team */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {sectionHeader(UsersIcon, 'Admin Team', `${team.length} account${team.length === 1 ? '' : 's'} with dashboard access.`)}

                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {team.map((member) => {
                                const isSelf = member._id === profile?._id;
                                return (
                                    <div key={member._id} className="px-8 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600 capitalize shrink-0">
                                            {member.firstName?.charAt(0) || member.email?.charAt(0) || 'A'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                                                    {`${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unnamed admin'}
                                                </p>
                                                {isSelf && (
                                                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold rounded uppercase tracking-wider">You</span>
                                                )}
                                                {member.isBlocked && (
                                                    <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold rounded uppercase tracking-wider">Blocked</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">{member.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDemote(member)}
                                            disabled={isSelf || team.length <= 1}
                                            title={isSelf ? "You can't remove your own access" : team.length <= 1 ? 'The last admin cannot be removed' : 'Remove admin access'}
                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                                        >
                                            <UserMinus className="w-3.5 h-3.5" /> Remove
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <UserPlus className="w-3.5 h-3.5" /> Grant admin access to an existing user
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                    placeholder="Search by name, email or phone..."
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 animate-spin" />
                                )}
                            </div>
                            {userResults.length > 0 && (
                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                                    {userResults.map((u) => (
                                        <div key={u._id} className="flex items-center gap-3 px-4 py-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                                                    {`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unnamed user'}
                                                </p>
                                                <p className="text-[11px] text-slate-500 font-mono truncate">
                                                    {u.email || 'No email'} • {u.phone}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handlePromote(u)}
                                                disabled={!u.email}
                                                title={u.email ? 'Grant admin access' : 'Needs an email address to sign in as admin'}
                                                className="shrink-0 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Make Admin
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Notification Rules */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {sectionHeader(Bell, 'Notification Rules', 'Which events reach your dashboard inbox.')}

                        <div className="p-8 space-y-6">
                            {[
                                {
                                    flag: 'notifyOnVerificationSubmitted',
                                    title: 'Driver documents submitted',
                                    description: 'Notify me when a driver uploads licence and ID documents for review.'
                                },
                                {
                                    flag: 'notifyOnRideCancelled',
                                    title: 'Ride cancelled',
                                    description: 'Notify me when a driver cancels a ride with booked passengers.'
                                }
                            ].map(({ flag, title, description }) => (
                                <div key={flag} className="flex items-center justify-between gap-6">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
                                    </div>
                                    {toggle(
                                        !!settings?.[flag],
                                        () => handleToggleSetting(flag),
                                        title,
                                        savingFlag === flag || !settings
                                    )}
                                </div>
                            ))}
                            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                                Turning one off stops new notifications of that type. Broadcasts you send yourself are never affected.
                            </p>
                        </div>
                    </section>

                    {/* Platform Status */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {sectionHeader(Activity, 'Platform Status', 'Live configuration and totals. Read-only.', 'slate')}

                        {status ? (
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {status.integrations.map((integration: any) => (
                                        <div
                                            key={integration.key}
                                            className={`p-4 rounded-xl border ${integration.configured
                                                ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10'
                                                : 'border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10'}`}
                                        >
                                            <div className="flex items-start gap-2.5">
                                                {integration.configured
                                                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                    : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{integration.label}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                                        {integration.configured ? integration.detail : `Not configured — needs ${integration.requirement}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {[
                                        { label: 'Users', value: status.counts.users },
                                        { label: 'Rides', value: status.counts.rides },
                                        { label: 'Bookings', value: status.counts.bookings },
                                        { label: 'Admins', value: status.counts.admins },
                                        { label: 'Push reach', value: `${status.reach.pushReachable}/${status.counts.users}` },
                                    ].map((stat) => (
                                        <div key={stat.label} className="pt-4">
                                            <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex justify-center">
                                <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                            </div>
                        )}
                    </section>

                    <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {sectionHeader(Palette, 'Appearance', 'How the dashboard looks on this device.', 'slate')}

                        <div className="p-8">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
                                        {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Saved in this browser only.
                                        </p>
                                    </div>
                                </div>

                                {toggle(isDarkMode, toggleDarkMode, 'Toggle dark mode')}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
