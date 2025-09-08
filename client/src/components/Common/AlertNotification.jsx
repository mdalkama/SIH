import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// single reusable alert component
const AlertNotification = ({ 
    type = 'info', 
    message = '', 
    duration = 4000, 
    onClose,
    show = false,
    position = 'top-right',
    size = 'medium',
    closable = true,
    autoClose = true
}) => {
    // auto close
    useEffect(() => {
        if (show && autoClose && duration > 0) {
            const timer = setTimeout(() => { onClose?.(); }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoClose, duration, onClose]);

    if (!show) return null;

    const alertConfig = {
        success: { icon: CheckCircle, bg: 'bg-green-50', br: 'border-green-200', tx: 'text-green-800', ic: 'text-green-600', ib: 'bg-green-100' },
        error:   { icon: XCircle,     bg: 'bg-red-50',   br: 'border-red-200',   tx: 'text-red-800',   ic: 'text-red-600',   ib: 'bg-red-100' },
        warning: { icon: AlertCircle, bg: 'bg-yellow-50',br: 'border-yellow-200',tx: 'text-yellow-800',ic: 'text-yellow-600',ib: 'bg-yellow-100' },
        info:    { icon: Info,        bg: 'bg-blue-50',  br: 'border-blue-200',  tx: 'text-blue-800',  ic: 'text-blue-600',  ib: 'bg-blue-100' }
    };

    const cfg = alertConfig[type] || alertConfig.info;
    const Icon = cfg.icon;

    const positionClasses = {
        'top-right': 'fixed top-4 right-4',
        'top-left': 'fixed top-4 left-4',
        'bottom-right': 'fixed bottom-4 right-4',
        'bottom-left': 'fixed bottom-4 left-4',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2'
    };
    const sizeClasses = {
        small: 'max-w-xs sm:max-w-sm',
        medium: 'max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl',
        large: 'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl'
    };

    return (
        <div className={`${positionClasses[position] || positionClasses['top-right']} z-50 w-full ${sizeClasses[size] || sizeClasses.medium} px-4 sm:px-6 md:px-8 lg:px-0`}>
            <div className={`${cfg.bg} ${cfg.br} ${cfg.tx} border rounded-lg shadow-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 w-full`}>
                <div className={`${cfg.ib} rounded-full p-1 flex-shrink-0 mt-0.5`}>
                    <Icon size={16} className={`${cfg.ic} sm:w-5 sm:h-5`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium leading-4 sm:leading-5 break-words">{message}</p>
                </div>
                {closable && (
                    <button onClick={onClose} className={`${cfg.tx} hover:opacity-70 flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10`} aria-label="Close notification">
                        <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlertNotification;