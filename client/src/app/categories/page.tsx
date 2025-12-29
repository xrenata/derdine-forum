import Navbar from '@/components/Navbar';
import { getCategories, Category } from '@/lib/api';
import Link from 'next/link';
import { FolderIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

async function getData() {
    try {
        const categories = await getCategories();
        return { categories };
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return { categories: [] };
    }
}

function CategoryCard({ category, index }: { category: Category; index: number }) {
    return (
        <Link href={`/categories/${category._id}`}>
            <div
                className="group relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                {/* Background gradient */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${category.color}10 0%, transparent 50%)` }}
                ></div>

                {/* Glow effect */}
                <div
                    className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: category.color }}
                ></div>

                <div className="relative p-6">
                    {/* Icon */}
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${category.color}20` }}
                    >
                        <FolderIcon className="w-7 h-7" style={{ color: category.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {category.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <span
                            className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: `${category.color}15`, color: category.color }}
                        >
                            {category.threadCount} konu
                        </span>
                        <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default async function CategoriesPage() {
    const { categories } = await getData();

    const totalThreads = categories.reduce((acc, cat) => acc + cat.threadCount, 0);

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-indigo-400 text-sm mb-3">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Keşfet</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Kategoriler</h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mb-6">
                        İlgilendiğiniz konuları keşfedin ve tartışmalara katılın
                    </p>

                    {/* Stats */}
                    <div className="inline-flex items-center gap-6 px-6 py-3 bg-slate-900/50 rounded-full border border-slate-800">
                        <div className="text-center">
                            <p className="text-2xl font-bold gradient-text">{categories.length}</p>
                            <p className="text-xs text-slate-500">Kategori</p>
                        </div>
                        <div className="w-px h-8 bg-slate-700"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold gradient-text">{totalThreads}</p>
                            <p className="text-xs text-slate-500">Toplam Konu</p>
                        </div>
                    </div>
                </div>

                {/* Categories grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {categories.map((category, index) => (
                        <CategoryCard key={category._id} category={category} index={index} />
                    ))}
                </div>

                {/* Empty state */}
                {categories.length === 0 && (
                    <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                        <FolderIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Henüz kategori oluşturulmamış</p>
                    </div>
                )}
            </main>
        </div>
    );
}
