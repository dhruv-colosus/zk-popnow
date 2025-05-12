"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1e1e44]/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 text-white font-helvetica shadow-lg z-50 flex items-center gap-2 max-w-[90%] w-auto"
        >
            <span>{message}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white">
                <XCircle size={18} />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast(message);
    };

    const closeToast = () => {
        setToast(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <AnimatePresence>
                {toast && <Toast message={toast} onClose={closeToast} />}
            </AnimatePresence>
        </ToastContext.Provider>
    );
}; 