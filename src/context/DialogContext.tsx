import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmationDialog, { DialogType } from '../components/common/ConfirmationDialog';

interface DialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: DialogType;
    onConfirm?: () => void;
}

interface DialogContextType {
    confirm: (options: DialogOptions) => void;
    showAlert: (title: string, message: string, type?: 'success' | 'alert') => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type: DialogType;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'confirm'
    });

    const confirm = useCallback((options: DialogOptions) => {
        setDialogState({
            isOpen: true,
            title: options.title,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            type: options.type || 'confirm',
            onConfirm: options.onConfirm
        });
    }, []);

    const showAlert = useCallback((title: string, message: string, type: 'success' | 'alert' = 'alert') => {
        setDialogState({
            isOpen: true,
            title,
            message,
            confirmText: "Understood",
            type: type as DialogType,
            onConfirm: () => { }
        });
    }, []);

    const closeDialog = useCallback(() => {
        setDialogState(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <DialogContext.Provider value={{ confirm, showAlert }}>
            {children}
            <ConfirmationDialog
                isOpen={dialogState.isOpen}
                onClose={closeDialog}
                onConfirm={dialogState.onConfirm}
                title={dialogState.title}
                message={dialogState.message}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                type={dialogState.type}
            />
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};
