'use client';

import { useState } from 'react';
import { Thread, likeThread } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { HeartIcon, ChatBubbleLeftIcon, EyeIcon, ShareIcon, FlagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import ReportModal from './ReportModal';

interface ThreadActionsProps {
    thread: Thread;
}

export default function ThreadActions({ thread }: ThreadActionsProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(thread.isLiked ?? false);
    const [likeCount, setLikeCount] = useState(thread.likeCount);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleLike = async () => {
        if (!user) return alert('Giriş yapmalısınız');

        try {
            const res = await likeThread(thread._id, user._id);
            setIsLiked(res.isLiked);
            setLikeCount(res.likeCount);
        } catch (error) {
            console.error('Failed to like thread:', error);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link kopyalandı!');
    };

    return (
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <div className="flex items-center gap-6">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}`}
                >
                    {isLiked ? <HeartSolidIcon className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                    <span className="font-medium">{likeCount} Beğeni</span>
                </button>
                <div className="flex items-center gap-2 text-slate-400">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>{thread.replyCount} Yanıt</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <EyeIcon className="w-5 h-5" />
                    <span>{thread.viewCount} Görüntülenme</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleShare}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <FlagIcon className="w-5 h-5" />
                </button>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                contentId={thread._id}
                contentType="thread"
            />
        </div>
    );
}
