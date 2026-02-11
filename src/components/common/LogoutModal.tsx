import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import GenieCanvas from './GenieCanvas';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
    triggerRect?: DOMRect | null;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout, triggerRect }) => {
    // idle -> opening (canvas) -> visible (dom fade in) -> open (interactive) -> closing (canvas)
    const [animationState, setAnimationState] = useState<'idle' | 'opening' | 'visible' | 'open' | 'closing'>('idle');
    const modalRef = useRef<HTMLDivElement>(null);

    // Sync state with isOpen prop
    useEffect(() => {
        if (isOpen && animationState === 'idle') {
            setAnimationState('opening');
        } else if (!isOpen && animationState === 'open') {
            setAnimationState('idle');
        }
    }, [isOpen, animationState]);

    const handleAnimationComplete = () => {
        if (animationState === 'opening') {
            setAnimationState('visible');
            // Small timeout to transition from 'visible' (fade in) to 'open' (fully active)
            setTimeout(() => setAnimationState('open'), 400);
        } else if (animationState === 'closing') {
            setAnimationState('idle');
            onClose();
        }
    };

    const handleClose = () => {
        if (animationState === 'open' || animationState === 'visible') {
            setAnimationState('closing');
        } else {
            onClose();
        }
    };

    if (!isOpen && animationState === 'idle') return null;

    const isDomVisible = animationState === 'visible' || animationState === 'open';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Canvas Layer for Genie Effect */}
            {(animationState === 'opening' || animationState === 'closing') && (
                <GenieCanvas
                    sourceRef={modalRef}
                    triggerRect={triggerRect || null}
                    isOpening={animationState === 'opening'}
                    isClosing={animationState === 'closing'}
                    onAnimationComplete={handleAnimationComplete}
                />
            )}

            {/* Actual Dialog Content - Production Grade Fade-In Transition */}
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: isDomVisible ? 1 : 0,
                    pointerEvents: animationState === 'open' ? 'auto' : 'none'
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeOut"
                }}
                style={{
                    visibility: isDomVisible || animationState === 'closing' ? 'visible' : 'hidden',
                }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F9BB06]/10 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[35%] flex items-center justify-center mb-6">
                        <LogOut className="w-12 h-12 text-red-600" />
                    </div>

                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                        <span className="relative">
                            LOGOUT
                            <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-[#F9BB06] rounded-full opacity-50" />
                        </span>
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 font-medium px-4 text-lg">
                        Ready to take a break? We'll save your spot for next time.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-12">
                    <button
                        onClick={handleClose}
                        className="py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]"
                    >
                        Not yet
                    </button>
                    <button
                        onClick={() => {
                            onLogout();
                            handleClose();
                        }}
                        className="py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition-all hover:scale-[1.05] active:scale-[0.95]"
                    >
                        Sign out
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LogoutModal;



