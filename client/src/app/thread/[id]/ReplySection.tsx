'use client';

import { Reply, likeReply } from '@/lib/api';
import { HeartIcon, PaperAirplaneIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ReplySectionProps {
    replies: Reply[];
    threadId: string;
}

function formatTime(dateString: string) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'Az önce';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} dakika önce`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat önce`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} gün önce`;

        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
        return dateString;
    }
}

function ReplyCard({ reply }: { reply: Reply }) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(reply.likes?.includes(user?._id || '') ?? false);
    const [likeCount, setLikeCount] = useState(reply.likeCount);

    const handleLike = async () => {
        if (!user) return alert('Giriş yapmalısınız');

        try {
            const res = await likeReply(reply._id, user._id);
            setIsLiked(res.isLiked);
            setLikeCount(res.likeCount);
        } catch (error) {
            console.error('Failed to like reply:', error);
        }
    };

    return (
        <div className="flex gap-4 p-5 bg-slate-900/30 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {reply.author.username[0].toUpperCase()}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white">{reply.author.username}</span>
                    {reply.author.badge && (
                        <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">
                            {reply.author.badge}
                        </span>
                    )}
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                        <ClockIcon className="w-3 h-3" />
                        {formatTime(reply.createdAt)}
                    </span>
                    {reply.isEdited && (
                        <span className="text-xs text-slate-600">(düzenlendi)</span>
                    )}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {reply.content}
                </p>

                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'
                        }`}
                >
                    {isLiked ? (
                        <HeartSolidIcon className="w-4 h-4" />
                    ) : (
                        <HeartIcon className="w-4 h-4" />
                    )}
                    <span>{likeCount}</span>
                </button>
            </div>
        </div>
    );
}

import { useAuth } from '@/context/AuthContext';
import { createReply } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReplySection({ replies, threadId }: ReplySectionProps) {
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            await createReply({
                thread: threadId,
                content: replyText,
                author: user._id
            });
            setReplyText('');
            router.refresh();
        } catch (error) {
            console.error('Failed to post reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💬 Yanıtlar
                <span className="px-2 py-0.5 text-sm bg-slate-800 text-slate-400 rounded-lg">{replies.length}</span>
            </h2>

            {/* Reply form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                user.username[0].toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Yanıtınızı yazın..."
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                                rows={3}
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!replyText.trim() || isSubmitting}
                                className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 mb-6 text-center">
                    <p className="text-slate-400 mb-3">Yanıt yazmak için giriş yapmalısınız.</p>
                    <div className="flex justify-center gap-3">
                        <Link href="/login" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Giriş Yap
                        </Link>
                        <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            )}

            {/* Replies list */}
            <div className="space-y-4">
                {replies.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <p className="mb-1">Henüz yanıt yok</p>
                        <p className="text-sm">İlk yanıtı sen yaz!</p>
                    </div>
                ) : (
                    replies.map((reply) => (
                        <ReplyCard key={reply._id} reply={reply} />
                    ))
                )}
            </div>
        </section>
    );
}
