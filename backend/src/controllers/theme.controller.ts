import { Elysia } from 'elysia';
import { Theme } from '../models/Theme';

export const themeController = (app: Elysia) =>
    app.group('/api/theme', (app) =>
        app
            // Get theme configuration
            .get('/', async ({ set }) => {
                try {
                    let theme = await Theme.findOne();
                    if (!theme) {
                        // Create default theme if not exists
                        theme = await Theme.create({});
                    }
                    return { success: true, data: theme };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update theme configuration
            .put('/', async ({ body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.updatedAt = new Date();

                    let theme = await Theme.findOneAndUpdate(
                        {},
                        updateData,
                        { new: true, upsert: true }
                    );

                    return { success: true, data: theme };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
