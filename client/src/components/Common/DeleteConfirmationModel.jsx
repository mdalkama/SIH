import React, { useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

// reusable delete confirm modal
const DeleteConfirmationModal = ({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Are you sure you want to delete this item?',
    description = 'This action cannot be undone.',
    itemName = '',
    itemType = 'item',
    isLoading = false,
    confirmText = 'Delete',
    cancelText = 'Cancel'
}) => {
    // esc key close
    useEffect(() => {
        const handleEscape = (e) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Confirm Deletion</h2>
                        <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1 rounded-full hover:bg-gray-100" aria-label="Close modal">
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 size={20} className="text-red-600 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{description}</p>
                            {itemName && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle size={14} className="text-red-600 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm font-medium text-red-800">{itemType.charAt(0).toUpperCase() + itemType.slice(1)} to be deleted:</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-red-900 break-words">{itemName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <button onClick={onClose} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50">{cancelText}</button>
                        <button onClick={onConfirm} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {isLoading ? (<><div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span className="text-xs sm:text-sm">Deleting...</span></>) : (<><Trash2 size={14} className="sm:w-4 sm:h-4" /><span className="text-xs sm:text-sm">{confirmText}</span></>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;