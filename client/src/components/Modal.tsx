'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all scale-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
