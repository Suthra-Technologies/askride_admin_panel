import React, { useState, useEffect } from 'react';
import {
    Send,
    Users as UsersIcon,
    Car,
    User as UserIcon,
    Search,
    Bell,
    Smartphone,
    Inbox,
    Loader2,
    History,
    X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { adminApi } from '../../services/api';
import { useDialog } from '../../context/DialogContext';

type Audience = 'all' | 'drivers' | 'passengers' | 'user';

const TITLE_LIMIT = 65;
const MESSAGE_LIMIT = 240;

const Notifications: React.FC = () => {
    const { confirm, showAlert } = useDialog();

    const [audience, setAudience] = useState<Audience>('all');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const [counts, setCounts] = useState<Record<string, { total: number; reachable: number }>>({});
    const [broadcasts, setBroadcasts] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Specific-user targeting
    const [userQuery, setUserQuery] = useState('');
    const [userResults, setUserResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);

    const fetchCounts = async () => {
        try {
            const res = await adminApi.getAudienceCounts();
            setCounts(res.data);
        } catch (error) {
            console.error('Failed to fetch audience counts', error);
        }
    };

    const fetchBroadcasts = async () => {
        setIsLoadingHistory(true);
        try {
            const res = await adminApi.getBroadcasts({ page: 1, limit: 10 });
            setBroadcasts(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch broadcast history', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchCounts();
        fetchBroadcasts();
    }, []);

    // Debounced user search, only while the "specific user" audience is active.
    useEffect(() => {
        if (audience !== 'user' || !userQuery.trim()) {
            setUserResults([]);
            return;
        }
        setIsSearching(true);
        const timeoutId = setTimeout(async () => {
            try {
                const res = await adminApi.getUsers({ search: userQuery, page: 1, limit: 5 });
                setUserResults(res.data.data || []);
            } catch (error) {
                console.error('Failed to search users', error);
            } finally {
                setIsSearching(false);
            }
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [userQuery, audience]);

    const audienceOptions = [
        { key: 'all' as Audience, label: 'All users', description: 'Everyone except admins', icon: UsersIcon },
        { key: 'drivers' as Audience, label: 'Drivers', description: 'Drivers and dual-role users', icon: Car },
        { key: 'passengers' as Audience, label: 'Passengers', description: 'Passengers and dual-role users', icon: UserIcon },
        { key: 'user' as Audience, label: 'Specific user', description: 'Search and pick one person', icon: Search },
    ];

    const selectedCount =
        audience === 'user'
            ? selectedUser
                ? { total: 1, reachable: selectedUser.fcmToken ? 1 : 0 }
                : { total: 0, reachable: 0 }
            : counts[audience] || { total: 0, reachable: 0 };

    const canSend =
        !!title.trim() &&
        !!message.trim() &&
        selectedCount.total > 0 &&
        !isSending &&
        (audience !== 'user' || !!selectedUser);

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setSelectedUser(null);
        setUserQuery('');
    };

    const handleSend = () => {
        const who =
            audience === 'user' && selectedUser
                ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.phone
                : `${selectedCount.total} ${audience === 'all' ? 'user' : audience.replace(/s$/, '')}${selectedCount.total === 1 ? '' : 's'}`;

        confirm({
            title: 'Send Notification',
            message: `This will send "${title.trim()}" to ${who}. ${selectedCount.reachable} will get a device push; the rest will see it in the app. This cannot be undone.`,
            type: 'confirm',
            confirmText: 'Send Now',
            onConfirm: async () => {
                setIsSending(true);
                try {
                    const res = await adminApi.sendBroadcast({
                        audience,
                        userId: audience === 'user' ? selectedUser?._id : undefined,
                        title: title.trim(),
                        message: message.trim(),
                    });
                    const { recipients, pushQueued, inAppOnly, pushFailed } = res.data;
                    showAlert(
                        'Notification Sent',
                        `Delivered to ${recipients} recipient(s): ${pushQueued} push notification(s) queued, ${inAppOnly} in-app only.${pushFailed ? ` ${pushFailed} push(es) failed.` : ''}`,
                        'success'
                    );
                    resetForm();
                    fetchBroadcasts();
                } catch (error: any) {
                    showAlert(
                        'Send Failed',
                        error?.response?.data?.message || "We couldn't send this notification. Please try again.",
                        'alert'
                    );
                } finally {
                    setIsSending(false);
                }
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Notifications</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Send push notifications to your users and review what you've sent.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Compose */}
                <div className="xl:col-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Compose</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Recipients get a device push if they have the app installed, and always an in-app notification.</p>
                    </div>

                    {/* Audience */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Audience</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {audienceOptions.map(({ key, label, description, icon: Icon }) => {
                                const isActive = audience === key;
                                const optionCount = key === 'user' ? null : counts[key]?.total;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setAudience(key)}
                                        aria-pressed={isActive}
                                        className={`text-left p-4 rounded-2xl border transition-all ${isActive
                                            ? 'border-transparent ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{label}</span>
                                            </div>
                                            {optionCount !== undefined && optionCount !== null && (
                                                <span className="text-xs font-bold text-slate-400">{optionCount}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 ml-6.5">{description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* User picker */}
                    {audience === 'user' && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Recipient</label>
                            {selectedUser ? (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-600">
                                        {selectedUser.firstName?.charAt(0) || selectedUser.phone?.charAt(0) || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm text-slate-900 dark:text-white capitalize truncate">
                                            {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'Unnamed user'}
                                        </p>
                                        <p className="text-xs text-slate-500 font-mono truncate">{selectedUser.phone} • {selectedUser.role || 'No role'}</p>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedUser(null); setUserQuery(''); }}
                                        className="ml-auto p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 transition-colors"
                                        title="Choose someone else"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={userQuery}
                                        onChange={(e) => setUserQuery(e.target.value)}
                                        placeholder="Search by name, email or phone..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                                    />
                                    {isSearching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500 animate-spin" />
                                    )}
                                    {userResults.length > 0 && (
                                        <div className="mt-2 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
                                            {userResults.map((u) => (
                                                <button
                                                    key={u._id}
                                                    onClick={() => { setSelectedUser(u); setUserResults([]); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                                                        {u.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                                                            {`${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unnamed user'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 font-mono truncate">{u.phone} • {u.role || 'No role'}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Title</label>
                            <span className={`text-[10px] font-bold ${title.length > TITLE_LIMIT ? 'text-rose-500' : 'text-slate-400'}`}>
                                {title.length}/{TITLE_LIMIT}
                            </span>
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={TITLE_LIMIT}
                            placeholder="e.g. Scheduled maintenance tonight"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Message</label>
                            <span className={`text-[10px] font-bold ${message.length > MESSAGE_LIMIT ? 'text-rose-500' : 'text-slate-400'}`}>
                                {message.length}/{MESSAGE_LIMIT}
                            </span>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={MESSAGE_LIMIT}
                            rows={4}
                            placeholder="Keep it short — long messages get truncated on the lock screen."
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none dark:text-white"
                        />
                    </div>

                    {/* Reach summary + send */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-primary-500" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{selectedCount.reachable}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">device push</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Inbox className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{selectedCount.total}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">in-app total</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={!canSend}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-200 dark:shadow-none"
                        >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            {isSending ? 'Sending...' : `Send to ${selectedCount.total}`}
                        </button>
                    </div>
                </div>

                {/* History */}
                <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 md:p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" /> Recent Broadcasts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">The last 10 notifications you sent.</p>

                    {isLoadingHistory ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        </div>
                    ) : broadcasts.length > 0 ? (
                        <div className="space-y-4">
                            {broadcasts.map((b) => (
                                <div key={b.broadcastId} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-start justify-between gap-3 mb-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{b.title}</h4>
                                        <span className="shrink-0 text-[10px] text-slate-400 font-medium">
                                            {b.createdAt ? formatDistanceToNow(new Date(b.createdAt), { addSuffix: true }) : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{b.message}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <UsersIcon className="w-3 h-3" /> {b.recipients} sent
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Bell className="w-3 h-3" /> {b.readCount} read
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-6 h-6 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">No broadcasts yet</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Anything you send will be listed here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
