'use client';

import { useState, useEffect } from 'react';
import { getThreads, deleteThread, Thread } from '@/lib/api';
import { TrashIcon, EyeIcon, ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ThreadsPage() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThreads();
    }, []);

    const loadThreads = async () => {
        try {
            const data = await getThreads({ limit: 50 });
            setThreads(data);
        } catch (error) {
            console.error('Failed to load threads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu konuyu silmek istediğinize emin misiniz?')) {
            try {
                await deleteThread(id);
                loadThreads();
            } catch (error) {
                console.error('Failed to delete thread:', error);
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Konular</h1>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-800">
                    {threads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Henüz konu yok</div>
                    ) : (
                        threads.map((thread) => (
                            <div key={thread._id} className="p-4 hover:bg-gray-800/30 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {thread.isPinned && (
                                                <span className="text-xs text-indigo-400">📌</span>
                                            )}
                                            {thread.isLocked && (
                                                <span className="text-xs text-yellow-400">🔒</span>
                                            )}
                                            <Link href={`/thread/${thread._id}`} className="font-medium hover:text-indigo-400 transition-colors">
                                                {thread.title}
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{thread.author.username}</span>
                                            <span
                                                className="px-2 py-0.5 rounded"
                                                style={{ backgroundColor: `${thread.category.color}20`, color: thread.category.color }}
                                            >
                                                {thread.category.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <EyeIcon className="w-3 h-3" /> {thread.viewCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ChatBubbleLeftIcon className="w-3 h-3" /> {thread.replyCount}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <HeartIcon className="w-3 h-3" /> {thread.likeCount}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(thread._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
