import { Elysia } from 'elysia';
import { Thread } from '../models/Thread';
import { Category } from '../models/Category';
import { User } from '../models/User';

export const threadController = (app: Elysia) =>
    app.group('/api/threads', (app) =>
        app
            // Get all threads
            .get('/', async ({ query, set }) => {
                try {
                    const { category, author, pinned, limit = '20', page = '1', userId } = query as any;

                    const filter: any = {};
                    if (category) filter.category = category;
                    if (author) filter.author = author;
                    if (pinned === 'true') filter.isPinned = true;

                    const pageNum = parseInt(page);
                    const limitNum = parseInt(limit);
                    const skip = (pageNum - 1) * limitNum;

                    const threads = await Thread.find(filter)
                        .populate('author', '-password')
                        .populate('category')
                        .sort({ isPinned: -1, createdAt: -1 })
                        .skip(skip)
                        .limit(limitNum);

                    const total = await Thread.countDocuments(filter);

                    // Add isLiked field for each thread based on current user
                    const threadsWithLikeStatus = threads.map(thread => {
                        const threadObj = thread.toObject();
                        return {
                            ...threadObj,
                            isLiked: userId ? thread.likes.includes(userId) : false
                        };
                    });

                    return {
                        success: true,
                        count: threads.length,
                        total,
                        page: pageNum,
                        pages: Math.ceil(total / limitNum),
                        data: threadsWithLikeStatus
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Get single thread
            .get('/:id', async ({ params: { id }, query, set }) => {
                try {
                    const { userId } = query as any;
                    const thread = await Thread.findById(id)
                        .populate('author', '-password')
                        .populate('category');

                    if (!thread) {
                        set.status = 404;
                        return { success: false, message: 'Thread not found' };
                    }

                    // Increment view count
                    thread.viewCount += 1;
                    await thread.save();

                    const threadObj = thread.toObject();
                    return {
                        success: true,
                        data: {
                            ...threadObj,
                            isLiked: userId ? thread.likes.includes(userId) : false
                        }
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Create thread
            .post('/', async ({ body, set }) => {
                try {
                    const { title, content, author, category } = body as any;

                    // Validate author and category exist
                    const authorExists = await User.findById(author);
                    if (!authorExists) {
                        set.status = 400;
                        return { success: false, message: 'Author not found' };
                    }

                    const categoryExists = await Category.findById(category);
                    if (!categoryExists) {
                        set.status = 400;
                        return { success: false, message: 'Category not found' };
                    }

                    const thread = await Thread.create({ title, content, author, category });

                    // Update user thread count
                    await User.findByIdAndUpdate(author, { $inc: { threadCount: 1 } });

                    // Update category thread count
                    await Category.findByIdAndUpdate(category, { $inc: { threadCount: 1 } });

                    const populatedThread = await Thread.findById(thread._id)
                        .populate('author', '-password')
                        .populate('category');

                    set.status = 201;
                    return { success: true, data: populatedThread };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update thread
            .put('/:id', async ({ params: { id }, body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.updatedAt = new Date();

                    const thread = await Thread.findByIdAndUpdate(id, updateData, { new: true })
                        .populate('author', '-password')
                        .populate('category');

                    if (!thread) {
                        set.status = 404;
                        return { success: false, message: 'Thread not found' };
                    }
                    return { success: true, data: thread };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Delete thread
            .delete('/:id', async ({ params: { id }, set }) => {
                try {
                    const thread = await Thread.findById(id);
                    if (!thread) {
                        set.status = 404;
                        return { success: false, message: 'Thread not found' };
                    }

                    // Update user and category counts
                    await User.findByIdAndUpdate(thread.author, { $inc: { threadCount: -1 } });
                    await Category.findByIdAndUpdate(thread.category, { $inc: { threadCount: -1 } });

                    await Thread.findByIdAndDelete(id);

                    return { success: true, message: 'Thread deleted' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Like/Unlike thread
            .post('/:id/like', async ({ params: { id }, body, set }) => {
                try {
                    const { userId } = body as any;
                    if (!userId) {
                        set.status = 401;
                        return { success: false, message: 'Unauthorized' };
                    }

                    const thread = await Thread.findById(id);
                    if (!thread) {
                        set.status = 404;
                        return { success: false, message: 'Thread not found' };
                    }

                    const isLiked = thread.likes.includes(userId);
                    let updateQuery;

                    if (isLiked) {
                        updateQuery = {
                            $pull: { likes: userId },
                            $inc: { likeCount: -1 }
                        };
                    } else {
                        updateQuery = {
                            $addToSet: { likes: userId },
                            $inc: { likeCount: 1 }
                        };
                    }

                    const updatedThread = await Thread.findByIdAndUpdate(id, updateQuery, { new: true });

                    return {
                        success: true,
                        data: {
                            likeCount: updatedThread!.likeCount,
                            isLiked: !isLiked
                        }
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
