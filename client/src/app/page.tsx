import Navbar from '@/components/Navbar';
import { getThreads, getCategories, Category } from '@/lib/api';
import ThreadCard from '@/components/ThreadCard';
import Link from 'next/link';
import { ArrowRightIcon, FireIcon, SparklesIcon, TrophyIcon, BoltIcon } from '@heroicons/react/24/outline';

async function getHomeData() {
  try {
    const [threads, categories] = await Promise.all([
      getThreads({ limit: 10 }),
      getCategories()
    ]);
    return { threads, categories };
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    return { threads: [], categories: [] };
  }
}

function CategoryPill({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category._id}`}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:bg-slate-800/50"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
        style={{ backgroundColor: `${category.color}20` }}
      >
        📁
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{category.name}</p>
        <p className="text-xs text-slate-500">{category.threadCount} konu</p>
      </div>
      <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
    </Link>
  );
}

export default async function HomePage() {
  const { threads, categories } = await getHomeData();

  const pinnedThreads = threads.filter(t => t.isPinned);
  const regularThreads = threads.filter(t => !t.isPinned);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl mb-10">
          <div className="absolute inset-0 gradient-primary opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4">
              <SparklesIcon className="w-4 h-4" />
              <span>Forum Topluluğu</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hoş Geldiniz! 👋
            </h1>
            <p className="text-lg text-indigo-100 max-w-xl mb-6">
              En son tartışmaları keşfedin, sorularınızı sorun ve topluluğa katılın.
              Her gün yeni konular ve ilginç sohbetler sizi bekliyor.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg shadow-black/20"
              >
                <BoltIcon className="w-5 h-5" />
                Yeni Konu Oluştur
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20"
              >
                Kategorileri Keşfet
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pinned Threads */}
            {pinnedThreads.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrophyIcon className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold">Sabitlenmiş Konular</h2>
                </div>
                <div className="space-y-4">
                  {pinnedThreads.map((thread) => (
                    <ThreadCard key={thread._id} thread={thread} />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Threads */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FireIcon className="w-5 h-5 text-orange-400" />
                  <h2 className="text-lg font-semibold">Son Konular</h2>
                </div>
              </div>

              <div className="space-y-4">
                {regularThreads.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-lg mb-2">Henüz konu yok</p>
                    <p className="text-sm">İlk konuyu sen oluştur!</p>
                  </div>
                ) : (
                  regularThreads.map((thread) => (
                    <ThreadCard key={thread._id} thread={thread} />
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <section className="bg-slate-900/30 rounded-2xl border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Kategoriler</h3>
                <Link href="/categories" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Tümü
                </Link>
              </div>
              <div className="space-y-3">
                {categories.slice(0, 5).map((category) => (
                  <CategoryPill key={category._id} category={category} />
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className="bg-slate-900/30 rounded-2xl border border-slate-800 p-5">
              <h3 className="font-semibold mb-4">İstatistikler</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold gradient-text">{threads.length}</p>
                  <p className="text-xs text-slate-500">Konu</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-2xl font-bold gradient-text">{categories.length}</p>
                  <p className="text-xs text-slate-500">Kategori</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
