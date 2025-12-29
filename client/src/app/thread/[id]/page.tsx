import Navbar from '@/components/Navbar';
import { getThread, getReplies, Thread, Reply } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import ReplySection from './ReplySection';
import ThreadActions from '@/components/ThreadActions';

async function getThreadData(id: string) {
    try {
        const [thread, replies] = await Promise.all([
            getThread(id),
            getReplies(id)
        ]);
        return { thread, replies };
    } catch (error) {
        console.error('Failed to fetch thread:', error);
        return { thread: null, replies: [] };
    }
}

function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
}

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { thread, replies } = await getThreadData(id);

    if (!thread) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Konu bulunamadı</h1>
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300">Ana sayfaya dön</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Geri Dön</span>
                </Link>

                {/* Thread */}
                <article className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    {/* Category header */}
                    <div
                        className="px-6 py-3 border-b border-slate-800"
                        style={{ backgroundColor: `${thread.category.color}10` }}
                    >
                        <Link
                            href={`/categories/${thread.category._id}`}
                            className="text-sm font-medium hover:underline"
                            style={{ color: thread.category.color }}
                        >
                            {thread.category.name}
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            {thread.isPinned && <span className="text-amber-400 mr-2">📌</span>}
                            {thread.title}
                        </h1>

                        {/* Author info */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {thread.author.username[0].toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white text-lg">{thread.author.username}</span>
                                    {thread.author.badge && (
                                        <span className="px-2.5 py-1 text-xs font-medium bg-indigo-600 text-white rounded-lg">
                                            {thread.author.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                    <ClockIcon className="w-4 h-4" />
                                    {formatDate(thread.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert prose-slate max-w-none mb-6">
                            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {thread.content}
                            </p>
                        </div>

                        {/* Stats and actions */}
                        <ThreadActions thread={thread} />
                    </div>
                </article>

                {/* Replies */}
                <ReplySection replies={replies} threadId={thread._id} />
            </main>
        </div>
    );
}
