import { Elysia } from 'elysia';
import { UIConfig } from '../models/UIConfig';

export const configController = (app: Elysia) =>
    app.group('/config', (app) =>
        app
            .get('/:screen', async ({ params: { screen }, set }) => {
                try {
                    const config = await UIConfig.findOne({ screen });
                    if (!config) {
                        set.status = 404;
                        return { success: false, message: 'Config not found for this screen' };
                    }
                    return { success: true, data: config };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            .get('/', async () => {
                try {
                    const configs = await UIConfig.find();
                    return { success: true, count: configs.length, data: configs };
                } catch (error) {
                    return { success: false, message: 'Server Error', error };
                }
            })
            .post('/', async ({ body, set }) => {
                const { screen, config } = body as any;

                if (!screen || !config) {
                    set.status = 400;
                    return { success: false, message: 'Please provide screen and config' };
                }

                try {
                    const uiConfig = await UIConfig.findOneAndUpdate(
                        { screen },
                        { screen, config, updatedAt: new Date() },
                        { new: true, upsert: true }
                    );

                    return { success: true, data: uiConfig };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
