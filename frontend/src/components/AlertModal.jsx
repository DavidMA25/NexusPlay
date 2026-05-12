import React from 'react';
import { X, XCircle } from 'lucide-react';

export default function AlertModal({ 
    isOpen, 
    onClose, 
    title = 'Notice', 
    message 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#121212] border border-gray-800 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-800">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                        <XCircle size={20} className="text-red-500" />
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
                    
                    <div className="flex justify-end mt-6">
                        <button 
                            onClick={onClose} 
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
