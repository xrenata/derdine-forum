'use client';

import { useState } from 'react';
import { changePassword, User } from '@/lib/api';

export default function PasswordChangeForm({ user }: { user: User }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor.');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalıdır.');
            setLoading(false);
            return;
        }

        try {
            await changePassword(user._id, { currentPassword, newPassword });
            setSuccess('Şifreniz başarıyla değiştirildi.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Şifre değiştirilemedi. Mevcut şifrenizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Mevcut Şifre
                </label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                    placeholder="••••••••"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Yeni Şifre
                </label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Yeni Şifre (Tekrar)
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                    placeholder="••••••••"
                    required
                    minLength={6}
                />
            </div>

            {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                    {success}
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                    {error}
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                    {loading ? 'Güncelleniyor...' : 'Şifreyi Değiştir'}
                </button>
            </div>
        </form>
    );
}
