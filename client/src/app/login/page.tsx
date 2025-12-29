'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                            <SparklesIcon className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                    Tekrar Hoşgeldiniz
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Hesabınız yok mu?{' '}
                    <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Hemen kayıt olun
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl border border-slate-800/50 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-sm text-rose-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                                Email adresi
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border-0 bg-slate-950/50 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Şifre
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border-0 bg-slate-950/50 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
