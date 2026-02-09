import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    triggerRect?: DOMRect | null;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout, triggerRect }) => {
    // Calculate properties for the extreme genie warp
    const getWarpEffect = () => {
        if (!triggerRect) return {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
        };

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const triggerX = triggerRect.left + triggerRect.width / 2;
        const triggerY = triggerRect.top + triggerRect.height / 2;

        const deltaX = triggerX - centerX;
        const deltaY = triggerY - centerY;

        // The "Genie" starts or ends as a tiny point at the button
        // We use non-uniform scaling and clip-paths to create the extreme warp from the image
        return {
            initial: {
                x: deltaX,
                y: deltaY,
                scaleX: 0,
                scaleY: 0.1,
                rotate: deltaX < 0 ? -45 : 45,
                opacity: 0,
                clipPath: "polygon(48% 0%, 52% 0%, 52% 100%, 48% 100%)",
            },
            animate: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotate: 0,
                opacity: 1,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                transition: {
                    type: "spring",
                    damping: 18,
                    stiffness: 150,
                    mass: 0.5,
                    clipPath: { duration: 0.4, ease: "circOut" }
                } as any
            },
            exit: {
                x: deltaX * 1.2, // Shoot past slightly for more "stretch"
                y: deltaY * 1.2,
                scaleX: 0,
                scaleY: 3, // EXTREME stretch like the Slime image
                rotate: deltaX < 0 ? 60 : -60, // Strong tilt
                opacity: 0,
                clipPath: deltaY > 0
                    ? "polygon(30% 0%, 70% 0%, 50% 100%, 50% 100%)" // Pinched at bottom
                    : "polygon(50% 0%, 50% 0%, 70% 100%, 30% 100%)", // Pinched at top
                transition: {
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    mass: 1,
                    clipPath: { duration: 0.3, ease: "circIn" }
                } as any
            }
        };
    };

    const warp = getWarpEffect();

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                        initial={warp.initial as any}
                        animate={warp.animate as any}
                        exit={warp.exit as any}
                        style={{ transformOrigin: "center center" }}
                        className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F9BB06]/10 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

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
                                transition={{ delay: 0.15, type: "spring", bounce: 0.5 }}
                                className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[35%] flex items-center justify-center mb-6"
                            >
                                <LogOut className="w-12 h-12 text-red-600" />
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-black text-slate-900 dark:text-white mb-3"
                            >
                                <span className="relative">
                                    LOGOUT
                                    <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#F9BB06] rounded-full opacity-50" />
                                </span>
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-500 dark:text-slate-400 font-medium px-4 text-lg"
                            >
                                Ready to take a break? We'll save your spot for next time.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 gap-4 mt-12"
                        >
                            <button
                                onClick={onClose}
                                className="py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                            >
                                Not yet
                            </button>
                            <button
                                onClick={() => {
                                    onLogout();
                                    onClose();
                                }}
                                className="py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-[0.95]"
                            >
                                Sign out
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;
