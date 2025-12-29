'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    SwatchIcon,
    RectangleStackIcon,
    TagIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Tema', href: '/admin/theme', icon: SwatchIcon },
    { name: 'Kategoriler', href: '/admin/categories', icon: RectangleStackIcon },
    { name: 'Etiketler', href: '/admin/labels', icon: TagIcon },
    { name: 'Kullanıcılar', href: '/admin/users', icon: UsersIcon },
    { name: 'Konular', href: '/admin/threads', icon: ChatBubbleLeftRightIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col">
                {/* Logo */}
                <div className="p-5 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Cog6ToothIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white">Admin Panel</span>
                            <p className="text-xs text-slate-500">Yönetim Merkezi</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                                {isActive && (
                                    <SparklesIcon className="w-3 h-3 ml-auto text-indigo-400" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to forum */}
                <div className="p-4 border-t border-slate-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl text-sm transition-all"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Foruma Dön
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
