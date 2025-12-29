import { Elysia } from 'elysia';
import { Labels } from '../models/Labels';

export const labelsController = (app: Elysia) =>
    app.group('/api/labels', (app) =>
        app
            // Get all labels
            .get('/', async ({ set }) => {
                try {
                    let labels = await Labels.findOne();
                    if (!labels) {
                        // Create default labels if not exists
                        labels = await Labels.create({});
                    }
                    return { success: true, data: labels };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update labels
            .put('/', async ({ body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.updatedAt = new Date();

                    let labels = await Labels.findOneAndUpdate(
                        {},
                        updateData,
                        { new: true, upsert: true }
                    );

                    return { success: true, data: labels };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Get specific screen labels
            .get('/:screen', async ({ params: { screen }, set }) => {
                try {
                    const labels = await Labels.findOne();
                    if (!labels) {
                        set.status = 404;
                        return { success: false, message: 'Labels not found' };
                    }

                    const screenLabels = (labels as any)[screen];
                    if (!screenLabels) {
                        set.status = 404;
                        return { success: false, message: `Labels for screen '${screen}' not found` };
                    }

                    return { success: true, data: { [screen]: screenLabels } };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update specific screen labels
            .put('/:screen', async ({ params: { screen }, body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.updatedAt = new Date();

                    let labels = await Labels.findOneAndUpdate(
                        {},
                        { [screen]: updateData },
                        { new: true, upsert: true }
                    );

                    return { success: true, data: labels };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
