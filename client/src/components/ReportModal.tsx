'use client';

import { useState } from 'react';
import Modal from './Modal';
import { FlagIcon } from '@heroicons/react/24/outline';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentId: string;
    contentType: 'thread' | 'reply';
}

export default function ReportModal({ isOpen, onClose, contentId, contentType }: ReportModalProps) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setReason('');
            onClose();
        }, 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="İçeriği Bildir">
            {submitted ? (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FlagIcon className="w-6 h-6" />
                    </div>
                    <p className="text-white font-medium">Bildiriminiz alındı</p>
                    <p className="text-slate-400 text-sm mt-1">İnceleme için teşekkür ederiz.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Bildirim Nedeni
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                        >
                            <option value="">Seçiniz</option>
                            <option value="spam">Spam / Reklam</option>
                            <option value="abuse">Hakaret / Taciz</option>
                            <option value="inappropriate">Uygunsuz İçerik</option>
                            <option value="misinformation">Yanlış Bilgi</option>
                            <option value="other">Diğer</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Açıklama (İsteğe bağlı)
                        </label>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            rows={3}
                            placeholder="Eklemek istedikleriniz..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={!reason || isSubmitting}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Gönderiliyor...' : 'Bildir'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
