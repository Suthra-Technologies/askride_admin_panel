import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';

export type DialogType = 'confirm' | 'alert' | 'danger' | 'success';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: DialogType;
    icon?: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = 'confirm',
    icon
}) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    text: 'text-red-600',
                    button: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
                    icon: icon || <AlertTriangle className="w-12 h-12 text-red-600" />,
                    accent: 'bg-red-500/10'
                };
            case 'success':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    text: 'text-emerald-600',
                    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
                    icon: icon || <CheckCircle className="w-12 h-12 text-emerald-600" />,
                    accent: 'bg-emerald-500/10'
                };
            case 'confirm':
                return {
                    bg: 'bg-primary-50 dark:bg-primary-900/20',
                    text: 'text-primary-600',
                    button: 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20',
                    icon: icon || <HelpCircle className="w-12 h-12 text-primary-600" />,
                    accent: 'bg-primary-500/10'
                };
            default:
                return {
                    bg: 'bg-slate-50 dark:bg-slate-900/40',
                    text: 'text-slate-600',
                    button: 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-slate-900/20',
                    icon: icon || <Info className="w-12 h-12 text-slate-600" />,
                    accent: 'bg-slate-500/10'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Dialog Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${styles.accent} rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none`} />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <motion.div
                                initial={{ scale: 0.5, rotate: -30, y: 20 }}
                                animate={{ scale: 1, rotate: 0, y: 0 }}
                                transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                                className={`w-24 h-24 ${styles.bg} rounded-[35%] flex items-center justify-center mb-6`}
                            >
                                {styles.icon}
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-3xl font-black text-slate-900 dark:text-white mb-3"
                            >
                                <span className="relative">
                                    {title.toUpperCase()}
                                    <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-primary-500 rounded-full opacity-20" />
                                </span>
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-500 dark:text-slate-400 font-medium px-4 text-lg leading-relaxed"
                            >
                                {message}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className={`mt-10 ${type === 'alert' || type === 'success' ? 'flex justify-center' : 'grid grid-cols-2 gap-4'}`}
                        >
                            {(type !== 'alert' && type !== 'success') && (
                                <button
                                    onClick={onClose}
                                    className="py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className={`py-4 ${styles.button} text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.05] active:scale-[0.95] ${type === 'alert' || type === 'success' ? 'px-12' : ''}`}
                            >
                                {confirmText}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationDialog;
