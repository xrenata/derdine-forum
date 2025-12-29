import { Elysia } from 'elysia';
import { Theme } from '../models/Theme';
import { Category } from '../models/Category';
import { Labels } from '../models/Labels';
import { User } from '../models/User';
import { Thread } from '../models/Thread';
import { Reply } from '../models/Reply';

// Password
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + (process.env.PASSWORD_SALT || 'forum_secret_salt_2024'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const adminController = (app: Elysia) =>
    app.group('/api/admin', (app) =>
        app
            // Seed Database
            .post('/seed', async ({ body, set }) => {
                try {
                    const { userId } = body as any;

                    if (!userId) {
                        set.status = 401;
                        return { success: false, message: 'Unauthorized' };
                    }

                    const adminUser = await User.findById(userId);
                    if (!adminUser || adminUser.badge !== 'Admin') {
                        set.status = 403;
                        return { success: false, message: 'Forbidden: Admin access required' };
                    }

                    const themeExists = await Theme.findOne();
                    if (!themeExists) {
                        await Theme.create({});
                    }

                    const labelsExists = await Labels.findOne();
                    if (!labelsExists) {
                        await Labels.create({});
                    }

                    const categoryCount = await Category.countDocuments();
                    if (categoryCount === 0) {
                        await Category.insertMany([
                            { name: 'Teknoloji', description: 'Teknoloji haberleri ve tartışmaları', icon: 'computer', color: '#3B82F6' },
                            { name: 'Oyunlar', description: 'Video oyunları ve gaming', icon: 'gamepad', color: '#8B5CF6' },
                            { name: 'Müzik', description: 'Müzik ve sanatçılar', icon: 'music_note', color: '#10B981' },
                            { name: 'Spor', description: 'Spor haberleri ve tartışmaları', icon: 'sports_soccer', color: '#F59E0B' },
                            { name: 'Sanat', description: 'Sanat ve tasarım', icon: 'palette', color: '#EC4899' },
                            { name: 'Bilim', description: 'Bilim ve araştırma', icon: 'science', color: '#EF4444' }
                        ]);
                    }

                    const userCount = await User.countDocuments();
                    if (userCount === 0) {
                        const hashedAdminPass = await hashPassword('admin123');
                        const hashedDemoPass = await hashPassword('demo123');

                        await User.insertMany([
                            { username: 'Admin', email: 'admin@derdinesokayim.com', password: hashedAdminPass, badge: 'Admin', reputation: 9999 },
                            { username: 'AhmetYılmaz', email: 'ahmet@example.com', password: hashedDemoPass, badge: 'Moderatör', reputation: 1250 },
                            { username: 'MehmetKaya', email: 'mehmet@example.com', password: hashedDemoPass, badge: 'Aktif Üye', reputation: 450 },
                            { username: 'AyşeDemir', email: 'ayse@example.com', password: hashedDemoPass, reputation: 180 },
                            { username: 'FatmaÖzkan', email: 'fatma@example.com', password: hashedDemoPass, badge: 'Yeni Üye', reputation: 45 }
                        ]);
                    }

                    const threadCount = await Thread.countDocuments();
                    if (threadCount === 0) {
                        const users = await User.find();
                        const categories = await Category.find();

                        if (users.length > 0 && categories.length > 0) {
                            await Thread.insertMany([
                                {
                                    title: 'Yeni çıkan yapay zeka modelleri hakkında ne düşünüyorsunuz?',
                                    content: 'Son zamanlarda yapay zeka alanında çok hızlı gelişmeler yaşanıyor. Sizce bu gelişmeler toplumu nasıl etkileyecek?',
                                    author: users[0]._id,
                                    category: categories[0]._id,
                                    viewCount: 234,
                                    replyCount: 12,
                                    likeCount: 45,
                                    isPinned: true
                                },
                                {
                                    title: 'En sevdiğiniz indie oyun hangisi?',
                                    content: 'Indie oyunlar son yıllarda çok popüler oldu. Sizin favoriniz hangisi ve neden?',
                                    author: users[1]._id,
                                    category: categories[1]._id,
                                    viewCount: 156,
                                    replyCount: 8,
                                    likeCount: 23
                                }
                            ]);
                        }
                    }

                    return {
                        success: true,
                        message: 'Seed data created successfully',
                        data: {
                            theme: await Theme.countDocuments(),
                            labels: await Labels.countDocuments(),
                            categories: await Category.countDocuments(),
                            users: await User.countDocuments(),
                            threads: await Thread.countDocuments()
                        }
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
