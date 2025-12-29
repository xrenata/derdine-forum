import Navbar from '@/components/Navbar';
import { getCategory, getThreads, Category, Thread } from '@/lib/api';
import Link from 'next/link';
import ThreadCard from '@/components/ThreadCard';
import { ArrowLeftIcon, FolderIcon } from '@heroicons/react/24/outline';

async function getCategoryData(id: string) {
    try {
        const [category, threads] = await Promise.all([
            getCategory(id),
            getThreads({ category: id, limit: 50 })
        ]);
        return { category, threads };
    } catch (error) {
        console.error('Failed to fetch category:', error);
        return { category: null, threads: [] };
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { category, threads } = await getCategoryData(id);

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Kategori bulunamadı</h1>
                    <Link href="/categories" className="text-indigo-400 hover:text-indigo-300">Kategorilere dön</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Back button */}
                <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Kategoriler</span>
                </Link>

                {/* Category header */}
                <div
                    className="relative overflow-hidden rounded-2xl p-8 mb-8"
                    style={{ backgroundColor: `${category.color}15` }}
                >
                    <div
                        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                        style={{ backgroundColor: category.color }}
                    ></div>

                    <div className="relative z-10 flex items-start gap-5">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                            style={{ backgroundColor: `${category.color}30` }}
                        >
                            <FolderIcon className="w-8 h-8" style={{ color: category.color }} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
                            <p className="text-slate-400 text-lg mb-4">{category.description}</p>
                            <div
                                className="inline-flex px-4 py-2 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                                {category.threadCount} konu
                            </div>
                        </div>
                    </div>
                </div>

                {/* Threads */}
                <div className="space-y-4">
                    {threads.length === 0 ? (
                        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                            <p className="text-slate-400 text-lg mb-2">Bu kategoride henüz konu yok</p>
                            <Link
                                href="/create"
                                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
                            >
                                İlk Konuyu Oluştur
                            </Link>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <ThreadCard key={thread._id} thread={thread} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
