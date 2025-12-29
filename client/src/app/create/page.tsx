'use client';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { getCategories, createThread, Category } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PaperAirplaneIcon, SparklesIcon, CheckIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateThreadPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login?redirect=/create');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!title.trim() || !content.trim() || !selectedCategoryId) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const thread = await createThread({
                title: title.trim(),
                content: content.trim(),
                category: selectedCategoryId,
                author: user._id
            });
            router.push(`/thread/${thread._id}`);
        } catch (error) {
            console.error('Failed to create thread:', error);
            setError('Konu oluşturulurken bir hata oluştu');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading || !user) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Yükleniyor...</div>;
    }

    const isValid = title.trim() && content.trim() && selectedCategoryId;

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Ana Sayfa</span>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-indigo-400 text-sm mb-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Yeni Tartışma</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Konu Oluştur</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Category selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Kategori Seçin</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(cat._id)}
                                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategoryId === cat._id
                                        ? 'text-white shadow-lg'
                                        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    style={{
                                        backgroundColor: selectedCategoryId === cat._id ? cat.color : undefined
                                    }}
                                >
                                    {selectedCategoryId === cat._id && (
                                        <CheckIcon className="w-4 h-4 absolute -top-1 -right-1 bg-white text-slate-900 rounded-full p-0.5" />
                                    )}
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">Başlık</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Dikkat çekici bir başlık yazın..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                            maxLength={200}
                        />
                        <p className="text-xs text-slate-500 mt-2">{title.length}/200</p>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-3">İçerik</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Düşüncelerinizi detaylı bir şekilde paylaşın..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[200px] resize-y"
                        />
                    </div>

                    {/* Tips */}
                    <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <LightBulbIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-200/80">
                                <p className="font-medium text-amber-200 mb-1">İpuçları</p>
                                <ul className="space-y-1">
                                    <li>• Açıklayıcı ve anlaşılır bir başlık kullanın</li>
                                    <li>• Konunuzu detaylı açıklayın</li>
                                    <li>• Saygılı ve yapıcı bir dil kullanın</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={!isValid || submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {submitting ? 'Paylaşılıyor...' : 'Konuyu Paylaş'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
