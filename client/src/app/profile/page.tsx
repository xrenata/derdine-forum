'use client';

import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserCircleIcon, KeyIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import ProfileForm from '@/components/ProfileForm';
import PasswordChangeForm from '@/components/PasswordChangeForm';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-6">
                        {/* User Card */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    user.username[0].toUpperCase()
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
                            <p className="text-slate-500 text-sm mb-4">{user.badge || 'Üye'}</p>

                            <div className="flex items-center justify-center gap-4 text-sm text-slate-400 border-t border-slate-800 pt-4">
                                <div>
                                    <span className="block text-white font-bold text-lg">{user.threadCount}</span>
                                    <span>Konu</span>
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-lg">{user.replyCount}</span>
                                    <span>Yanıt</span>
                                </div>
                                <div>
                                    <span className="block text-white font-bold text-lg">{user.reputation}</span>
                                    <span>Puan</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'profile'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <UserCircleIcon className="w-5 h-5" />
                                Profil Bilgileri
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'security'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <KeyIcon className="w-5 h-5" />
                                Güvenlik
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-rose-500 hover:text-rose-400 hover:bg-slate-800 transition-colors border-t border-slate-800"
                            >
                                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                Çıkış Yap
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
                            {activeTab === 'profile' ? (
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-6">Profil Bilgileri</h1>
                                    <ProfileForm user={user} />
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-6">Güvenlik Ayarları</h1>
                                    <p className="text-slate-400 mb-6">Şifrenizi ve hesap güvenliğinizi buradan yönetebilirsiniz.</p>
                                    <PasswordChangeForm user={user} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
