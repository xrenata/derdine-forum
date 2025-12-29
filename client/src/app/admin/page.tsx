import { getCategories, getUsers, getThreads } from '@/lib/api';
import Link from 'next/link';
import {
    RectangleStackIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    ArrowTrendingUpIcon,
    EyeIcon,
    HeartIcon,
    ArrowRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import SeedButton from '@/components/SeedButton';

async function getDashboardData() {
    try {
        const [categories, users, threads] = await Promise.all([
            getCategories(),
            getUsers(),
            getThreads({ limit: 5 })
        ]);
        return { categories, users, threads };
    } catch (error) {
        console.error('Dashboard error:', error);
        return { categories: [], users: [], threads: [] };
    }
}

export default async function AdminDashboard() {
    const { categories, users, threads } = await getDashboardData();

    const totalViews = threads.reduce((acc, t) => acc + t.viewCount, 0);
    const totalLikes = threads.reduce((acc, t) => acc + t.likeCount, 0);

    const stats = [
        { name: 'Kategoriler', value: categories.length, icon: RectangleStackIcon, color: 'from-blue-500 to-cyan-500', href: '/admin/categories' },
        { name: 'Kullanıcılar', value: users.length, icon: UsersIcon, color: 'from-green-500 to-emerald-500', href: '/admin/users' },
        { name: 'Konular', value: threads.length, icon: ChatBubbleLeftRightIcon, color: 'from-purple-500 to-pink-500', href: '/admin/threads' },
        { name: 'Görüntülenme', value: totalViews, icon: EyeIcon, color: 'from-orange-500 to-amber-500', href: '/admin/threads' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-indigo-400 text-sm mb-2">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Genel Bakış</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>

            {/* Seed Button (Client Side Component needed) */}
            <SeedButton />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat) => (
                    <Link key={stat.name} href={stat.href}>
                        <div className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">{stat.name}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <ArrowRightIcon className="absolute bottom-4 right-4 w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent threads */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="font-semibold text-white">Son Konular</h2>
                    <Link href="/admin/threads" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        Tümünü Gör <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {threads.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <ChatBubbleLeftRightIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>Henüz konu yok</p>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <div key={thread._id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                                        {thread.author.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white text-sm line-clamp-1">{thread.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{thread.author.username}</span>
                                            <span className="text-slate-600">•</span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded"
                                                style={{ backgroundColor: `${thread.category.color}15`, color: thread.category.color }}
                                            >
                                                {thread.category.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" />
                                        {thread.replyCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <EyeIcon className="w-3.5 h-3.5" />
                                        {thread.viewCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <HeartIcon className="w-3.5 h-3.5" />
                                        {thread.likeCount}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
