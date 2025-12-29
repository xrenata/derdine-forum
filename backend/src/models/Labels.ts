import mongoose from 'mongoose';

const LabelsSchema = new mongoose.Schema({
    // Home Screen
    home: {
        title: { type: String, default: 'Ana Sayfa' },
        trending: { type: String, default: 'Trend Konular' },
        recent: { type: String, default: 'Son Konular' },
        pinnedThreads: { type: String, default: 'Sabitlenmiş' }
    },

    // Categories Screen
    categories: {
        title: { type: String, default: 'Kategoriler' },
        threads: { type: String, default: 'konu' }
    },

    // Thread Detail
    thread: {
        replies: { type: String, default: 'Yanıtlar' },
        writeReply: { type: String, default: 'Yanıt yaz...' },
        views: { type: String, default: 'görüntülenme' },
        likes: { type: String, default: 'beğeni' }
    },

    // Profile Screen
    profile: {
        title: { type: String, default: 'Profil' },
        threads: { type: String, default: 'Konular' },
        replies: { type: String, default: 'Cevaplar' },
        reputation: { type: String, default: 'İtibar' },
        editProfile: { type: String, default: 'Profili Düzenle' }
    },

    // Settings Screen
    settings: {
        title: { type: String, default: 'Ayarlar' },
        darkMode: { type: String, default: 'Karanlık Mod' },
        notifications: { type: String, default: 'Bildirimler' },
        language: { type: String, default: 'Dil' },
        logout: { type: String, default: 'Çıkış Yap' }
    },

    // Search Screen
    search: {
        placeholder: { type: String, default: 'Konu ara...' },
        noResults: { type: String, default: 'Sonuç bulunamadı' }
    },

    // Create Thread Screen
    createThread: {
        title: { type: String, default: 'Yeni Konu' },
        titlePlaceholder: { type: String, default: 'Konu başlığı' },
        contentPlaceholder: { type: String, default: 'Konu içeriği...' },
        selectCategory: { type: String, default: 'Kategori seç' }
    },

    // Common Buttons
    buttons: {
        submit: { type: String, default: 'Paylaş' },
        cancel: { type: String, default: 'İptal' },
        save: { type: String, default: 'Kaydet' },
        delete: { type: String, default: 'Sil' },
        edit: { type: String, default: 'Düzenle' },
        reply: { type: String, default: 'Yanıtla' },
        like: { type: String, default: 'Beğen' },
        share: { type: String, default: 'Paylaş' }
    },

    // Bottom Navigation
    navigation: {
        home: { type: String, default: 'Ana Sayfa' },
        categories: { type: String, default: 'Kategoriler' },
        notifications: { type: String, default: 'Bildirimler' },
        profile: { type: String, default: 'Profil' }
    },

    updatedAt: { type: Date, default: Date.now }
});

export const Labels = mongoose.model('Labels', LabelsSchema);
