'use client';

import Navbar from '@/components/Navbar';
import { getThreads, getCategories, Thread, Category } from '@/lib/api';
import ThreadCard from '@/components/ThreadCard';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [threads, setThreads] = useState<Thread[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [threadsData, categoriesData] = await Promise.all([
                getThreads({ limit: 100 }),
                getCategories()
            ]);
            setThreads(threadsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const filteredThreads = threads.filter(thread => {
        const matchesQuery = query === '' ||
            thread.title.toLowerCase().includes(query.toLowerCase()) ||
            thread.content.toLowerCase().includes(query.toLowerCase()) ||
            thread.author.username.toLowerCase().includes(query.toLowerCase());

        const matchesCategory = !selectedCategory || thread.category._id === selectedCategory;

        return matchesQuery && matchesCategory;
    });

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Search header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6">Arama</h1>

                    {/* Search input */}
                    <div className="relative mb-4">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Konu, içerik veya kullanıcı ara..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-lg"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Category filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <FunnelIcon className="w-4 h-4 text-slate-500" />
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!selectedCategory
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            Tümü
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(selectedCategory === cat._id ? null : cat._id)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat._id
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                style={{
                                    backgroundColor: selectedCategory === cat._id ? cat.color : 'rgb(30 41 59 / 0.5)'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-slate-400">
                        {filteredThreads.length} sonuç
                        {query && <span className="text-white"> "{query}"</span>}
                    </p>
                </div>

                <div className="space-y-4">
                    {filteredThreads.length === 0 ? (
                        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                            <MagnifyingGlassIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 text-lg mb-2">Sonuç bulunamadı</p>
                            <p className="text-slate-500 text-sm">Farklı anahtar kelimeler deneyin</p>
                        </div>
                    ) : (
                        filteredThreads.map((thread) => (
                            <ThreadCard key={thread._id} thread={thread} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
