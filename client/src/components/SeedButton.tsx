'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';

export default function SeedButton() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleSeed = async () => {
        setIsConfirmOpen(false);
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/admin/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?._id })
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Veriler başarıyla eklendi!');
                window.location.reload();
            } else {
                setMessage(data.message || 'Bir hata oluştu');
            }
        } catch (error) {
            setMessage('Bağlantı hatası');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (user?.badge !== 'Admin') return null;

    return (
        <div className="mb-8">
            <button
                onClick={() => setIsConfirmOpen(true)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm"
            >
                <SquaresPlusIcon className="w-5 h-5" />
                {loading ? 'Ekleniyor...' : 'Örnek Veri Ekle (Seed)'}
            </button>
            {message && <p className="mt-2 text-sm text-green-400">{message}</p>}

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Onaylıyor musunuz?"
            >
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Veritabanına örnek veriler eklenecek. Bu işlem mevcut verileri silmez ancak mükerrer kayıtlar oluşturabilir.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsConfirmOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSeed}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
                        >
                            Evet, Ekle
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
