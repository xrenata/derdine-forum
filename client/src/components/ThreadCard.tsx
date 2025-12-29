'use client';

import Link from 'next/link';
import { Thread } from '@/lib/api';
import { ChatBubbleLeftIcon, EyeIcon, HeartIcon, ShareIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ThreadCardProps {
    thread: Thread;
    onLike?: () => void;
}

export default function ThreadCard({ thread, onLike }: ThreadCardProps) {
    const [isLiked, setIsLiked] = useState(thread.isLiked ?? false);
    const [likeCount, setLikeCount] = useState(thread.likeCount);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        onLike?.();
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now.getTime() - date.getTime();

            if (diff < 60000) return 'Az önce';
            if (diff < 3600000) return `${Math.floor(diff / 60000)} dk`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)} gün`;

            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        } catch {
            return dateString;
        }
    };

    return (
        <Link href={`/thread/${thread._id}`} className="block">
            <article className="group relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                {/* Pinned indicator */}
                {thread.isPinned && (
                    <div className="absolute -top-px right-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-b-lg">
                        📌 Sabitlenmiş
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {thread.author.username[0].toUpperCase()}
                        </div>
                        {thread.author.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Author & Category */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold text-white">{thread.author.username}</span>
                            {thread.author.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded-md">
                                    {thread.author.badge}
                                </span>
                            )}
                            <span className="text-slate-600">•</span>
                            <span
                                className="px-2.5 py-0.5 text-xs font-medium rounded-lg"
                                style={{
                                    backgroundColor: `${thread.category.color}15`,
                                    color: thread.category.color
                                }}
                            >
                                {thread.category.name}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                                <ClockIcon className="w-3.5 h-3.5" />
                                {formatTime(thread.createdAt)}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                            {thread.title}
                        </h3>

                        {/* Content preview */}
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {thread.content}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-5">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 text-sm transition-all ${isLiked
                                    ? 'text-rose-500'
                                    : 'text-slate-500 hover:text-rose-400'
                                    }`}
                            >
                                {isLiked ? (
                                    <HeartSolidIcon className="w-4.5 h-4.5" />
                                ) : (
                                    <HeartIcon className="w-4.5 h-4.5" />
                                )}
                                <span className="font-medium">{likeCount}</span>
                            </button>

                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <ChatBubbleLeftIcon className="w-4.5 h-4.5" />
                                <span>{thread.replyCount}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <EyeIcon className="w-4.5 h-4.5" />
                                <span>{thread.viewCount}</span>
                            </div>

                            <button
                                onClick={(e) => e.preventDefault()}
                                className="ml-auto p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                            >
                                <ShareIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
