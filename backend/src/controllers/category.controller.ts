import { Elysia } from 'elysia';
import { Category } from '../models/Category';

export const categoryController = (app: Elysia) =>
    app.group('/api/categories', (app) =>
        app
            // Get all categories
            .get('/', async ({ set }) => {
                try {
                    const categories = await Category.find().sort({ createdAt: -1 });
                    return { success: true, count: categories.length, data: categories };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Get single category
            .get('/:id', async ({ params: { id }, set }) => {
                try {
                    const category = await Category.findById(id);
                    if (!category) {
                        set.status = 404;
                        return { success: false, message: 'Category not found' };
                    }
                    return { success: true, data: category };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Create category
            .post('/', async ({ body, set }) => {
                try {
                    const category = await Category.create(body);
                    set.status = 201;
                    return { success: true, data: category };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update category
            .put('/:id', async ({ params: { id }, body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.updatedAt = new Date();

                    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
                    if (!category) {
                        set.status = 404;
                        return { success: false, message: 'Category not found' };
                    }
                    return { success: true, data: category };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Delete category
            .delete('/:id', async ({ params: { id }, set }) => {
                try {
                    const category = await Category.findByIdAndDelete(id);
                    if (!category) {
                        set.status = 404;
                        return { success: false, message: 'Category not found' };
                    }
                    return { success: true, message: 'Category deleted' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
