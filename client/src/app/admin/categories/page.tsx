'use client';

import { useState, useEffect, Fragment } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', description: '', icon: 'folder', color: '#6366f1' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setForm({ name: category.name, description: category.description, icon: category.icon, color: category.color });
        } else {
            setEditingCategory(null);
            setForm({ name: '', description: '', icon: 'folder', color: '#6366f1' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, form);
            } else {
                await createCategory(form);
            }
            loadCategories();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try {
                await deleteCategory(id);
                loadCategories();
            } catch (error) {
                console.error('Failed to delete category:', error);
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Kategoriler</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Yeni Kategori
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">İsim</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Açıklama</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Renk</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Konular</th>
                            <th className="text-right px-5 py-3 text-sm font-medium text-gray-400">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${category.color}20` }}
                                        >
                                            <span style={{ color: category.color }}>📁</span>
                                        </div>
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-400 text-sm">{category.description}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                                        <span className="text-sm text-gray-400">{category.color}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm">{category.threadCount}</td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => openModal(category)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 border border-gray-800 shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold flex items-center justify-between">
                                        {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                                        <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">İsim</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Açıklama</label>
                                            <textarea
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Renk</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={form.color}
                                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                                                    className="w-10 h-10 rounded-lg cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={form.color}
                                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
                                        >
                                            Kaydet
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
