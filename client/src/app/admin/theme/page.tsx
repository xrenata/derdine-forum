'use client';

import { useState, useEffect } from 'react';
import { getTheme, updateTheme, ThemeColors } from '@/lib/api';

const colorFields: { key: keyof ThemeColors; label: string; group: string }[] = [
    { key: 'primary', label: 'Primary', group: 'Primary Colors' },
    { key: 'primaryVariant', label: 'Primary Variant', group: 'Primary Colors' },
    { key: 'onPrimary', label: 'On Primary', group: 'Primary Colors' },
    { key: 'secondary', label: 'Secondary', group: 'Secondary Colors' },
    { key: 'secondaryVariant', label: 'Secondary Variant', group: 'Secondary Colors' },
    { key: 'onSecondary', label: 'On Secondary', group: 'Secondary Colors' },
    { key: 'backgroundDark', label: 'Background Dark', group: 'Background' },
    { key: 'backgroundLight', label: 'Background Light', group: 'Background' },
    { key: 'surfaceDark', label: 'Surface Dark', group: 'Surface' },
    { key: 'surfaceLight', label: 'Surface Light', group: 'Surface' },
    { key: 'error', label: 'Error', group: 'Status' },
    { key: 'success', label: 'Success', group: 'Status' },
    { key: 'warning', label: 'Warning', group: 'Status' },
    { key: 'info', label: 'Info', group: 'Status' },
];

export default function ThemePage() {
    const [theme, setTheme] = useState<ThemeColors | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const data = await getTheme();
            setTheme(data);
        } catch (error) {
            console.error('Failed to load theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (key: keyof ThemeColors, value: string) => {
        if (theme) {
            setTheme({ ...theme, [key]: value });
        }
    };

    const handleSave = async () => {
        if (!theme) return;
        setSaving(true);
        try {
            await updateTheme(theme);
            setMessage({ type: 'success', text: 'Tema başarıyla güncellendi!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Tema güncellenirken hata oluştu.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const groups = Array.from(new Set(colorFields.map(f => f.group)));

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Theme Ayarları</h1>
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

            <div className="space-y-6">
                {groups.map(group => (
                    <div key={group} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                        <h2 className="font-semibold mb-4">{group}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {colorFields.filter(f => f.group === group).map(field => (
                                <div key={field.key}>
                                    <label className="block text-sm text-gray-400 mb-2">{field.label}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={theme?.[field.key] || '#000000'}
                                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={theme?.[field.key] || ''}
                                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
