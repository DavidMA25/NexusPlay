import React from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    variant = 'danger', 
    isLoading = false
}) {
    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`bg-[#121212] border ${isDanger ? 'border-red-500/50' : 'border-gray-800'} rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-800">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDanger ? 'text-red-500' : 'text-white'}`}>
                        {isDanger ? <AlertTriangle size={20} /> : <Info size={20} />}
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5">
                    <p className="text-gray-300 text-sm mb-4">
                        {message}
                    </p>
                    
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm} 
                            disabled={isLoading} 
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                                isDanger 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-brand-red hover:bg-[#FF4D4D] text-white'
                            }`}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
