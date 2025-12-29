'use client';

import { useState } from 'react';
import { User, updateUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfileForm({ user }: { user: User }) {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const updatedUser = await updateUser(user._id, { avatarUrl });
            setSuccess('Profil güncellendi!');
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Güncelleme başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Profil Fotoğrafı (URL)
                </label>
                <div className="flex gap-4">
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-600"
                    />
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-500 text-xs">Yok</span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Not: Şu an sadece resim URL'i desteklenmektedir. Imgur vb. kullanabilirsiniz.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Kullanıcı Adı
                </label>
                <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-2">
                    Kullanıcı adı değiştirilemez.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    E-posta
                </label>
                <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
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
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>
        </form>
    );
}
