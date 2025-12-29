'use client';

import { useState, useEffect } from 'react';
import { getLabels, updateLabels, Labels } from '@/lib/api';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function LabelsPage() {
    const [labels, setLabels] = useState<Labels | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadLabels();
    }, []);

    const loadLabels = async () => {
        try {
            const data = await getLabels();
            setLabels(data);
        } catch (error) {
            console.error('Failed to load labels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!labels) return;
        setSaving(true);
        try {
            await updateLabels(labels);
            setMessage({ type: 'success', text: 'Etiketler başarıyla güncellendi!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Etiketler güncellenirken hata oluştu.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const updateField = (section: string, field: string, value: string) => {
        if (labels) {
            setLabels({
                ...labels,
                [section]: { ...(labels as any)[section], [field]: value }
            });
        }
    };

    const categories = [
        { key: 'home', title: 'Ana Sayfa', fields: ['title', 'trending', 'recent', 'pinnedThreads'] },
        { key: 'categories', title: 'Kategoriler', fields: ['title', 'threads'] },
        { key: 'thread', title: 'Konu', fields: ['replies', 'writeReply', 'views', 'likes'] },
        { key: 'profile', title: 'Profil', fields: ['title', 'threads', 'replies', 'reputation', 'editProfile'] },
        { key: 'settings', title: 'Ayarlar', fields: ['title', 'darkMode', 'notifications', 'language', 'logout'] },
        { key: 'search', title: 'Arama', fields: ['placeholder', 'noResults'] },
        { key: 'createThread', title: 'Konu Oluştur', fields: ['title', 'titlePlaceholder', 'contentPlaceholder', 'selectCategory'] },
        { key: 'buttons', title: 'Butonlar', fields: ['submit', 'cancel', 'save', 'delete', 'edit', 'reply', 'like', 'share'] },
        { key: 'navigation', title: 'Navigasyon', fields: ['home', 'categories', 'notifications', 'profile'] },
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Etiketler / Labels</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1 mb-6">
                    {categories.map((cat) => (
                        <Tab
                            key={cat.key}
                            className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                    'ring-white/60 ring-offset-2 ring-offset-gray-950 focus:outline-none',
                                    selected
                                        ? 'bg-indigo-600 text-white shadow'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                )
                            }
                        >
                            {cat.title}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {categories.map((cat) => (
                        <Tab.Panel key={cat.key} className="rounded-xl bg-gray-900 border border-gray-800 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cat.fields.map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm text-gray-400 mb-2 capitalize">{field}</label>
                                        <input
                                            type="text"
                                            value={(labels as any)?.[cat.key]?.[field] || ''}
                                            onChange={(e) => updateField(cat.key, field, e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
