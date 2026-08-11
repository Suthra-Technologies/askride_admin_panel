import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ImageOff, Loader2 } from 'lucide-react';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    url?: string;
    title: string;
    subtitle?: string;
}

const isPdf = (url: string) => url.split('?')[0].toLowerCase().endsWith('.pdf');

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
    isOpen,
    onClose,
    url,
    title,
    subtitle
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // A different document in the same modal has to show its own spinner again.
    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
    }, [url]);

    // Escape to close, and stop the page behind the modal from scrolling.
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && url && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="min-w-0">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{title}</h3>
                                {subtitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate">{subtitle}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open original in a new tab"
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={onClose}
                                    title="Close"
                                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Document */}
                        <div className="flex-1 min-h-0 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center p-6 overflow-auto">
                            {isPdf(url) ? (
                                <iframe
                                    src={url}
                                    title={title}
                                    className="w-full h-[70vh] rounded-2xl bg-white border border-slate-200 dark:border-slate-800"
                                />
                            ) : hasError ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ImageOff className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Couldn't load this document</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                        The file may have been removed, or the link may have expired.
                                    </p>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-primary-600 hover:underline"
                                    >
                                        Try opening it directly <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                        </div>
                                    )}
                                    <img
                                        src={url}
                                        alt={title}
                                        onLoad={() => setIsLoading(false)}
                                        onError={() => { setIsLoading(false); setHasError(true); }}
                                        className={`max-w-full max-h-[70vh] object-contain rounded-2xl transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DocumentPreviewModal;
