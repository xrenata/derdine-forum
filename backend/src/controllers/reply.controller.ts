import { Elysia } from 'elysia';
import { Reply } from '../models/Reply';
import { Thread } from '../models/Thread';
import { User } from '../models/User';

export const replyController = (app: Elysia) =>
    app.group('/api/replies', (app) =>
        app
            // Get replies for a thread
            .get('/', async ({ query, set }) => {
                try {
                    const { thread, author, limit = '20', page = '1', userId } = query as any;

                    const filter: any = {};
                    if (thread) filter.thread = thread;
                    if (author) filter.author = author;

                    const pageNum = parseInt(page);
                    const limitNum = parseInt(limit);
                    const skip = (pageNum - 1) * limitNum;

                    const replies = await Reply.find(filter)
                        .populate('author', '-password')
                        .sort({ createdAt: 1 })
                        .skip(skip)
                        .limit(limitNum);

                    const total = await Reply.countDocuments(filter);

                    // Add isLiked field for each reply based on current user
                    const repliesWithLikeStatus = replies.map(reply => {
                        const replyObj = reply.toObject();
                        return {
                            ...replyObj,
                            isLiked: userId ? reply.likes.includes(userId) : false
                        };
                    });

                    return {
                        success: true,
                        count: replies.length,
                        total,
                        page: pageNum,
                        pages: Math.ceil(total / limitNum),
                        data: repliesWithLikeStatus
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Get single reply
            .get('/:id', async ({ params: { id }, set }) => {
                try {
                    const reply = await Reply.findById(id).populate('author', '-password');
                    if (!reply) {
                        set.status = 404;
                        return { success: false, message: 'Reply not found' };
                    }
                    return { success: true, data: reply };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Create reply
            .post('/', async ({ body, set }) => {
                try {
                    const { thread, content, author } = body as any;

                    // Validate thread and author exist
                    const threadExists = await Thread.findById(thread);
                    if (!threadExists) {
                        set.status = 400;
                        return { success: false, message: 'Thread not found' };
                    }

                    if (threadExists.isLocked) {
                        set.status = 400;
                        return { success: false, message: 'Thread is locked' };
                    }

                    const authorExists = await User.findById(author);
                    if (!authorExists) {
                        set.status = 400;
                        return { success: false, message: 'Author not found' };
                    }

                    const reply = await Reply.create({ thread, content, author });

                    // Update thread reply count
                    await Thread.findByIdAndUpdate(thread, { $inc: { replyCount: 1 } });

                    // Update user reply count
                    await User.findByIdAndUpdate(author, { $inc: { replyCount: 1 } });

                    const populatedReply = await Reply.findById(reply._id).populate('author', '-password');

                    set.status = 201;
                    return { success: true, data: populatedReply };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update reply
            .put('/:id', async ({ params: { id }, body, set }) => {
                try {
                    const updateData = body as any;
                    updateData.isEdited = true;
                    updateData.updatedAt = new Date();

                    const reply = await Reply.findByIdAndUpdate(id, updateData, { new: true })
                        .populate('author', '-password');

                    if (!reply) {
                        set.status = 404;
                        return { success: false, message: 'Reply not found' };
                    }
                    return { success: true, data: reply };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Delete reply
            .delete('/:id', async ({ params: { id }, set }) => {
                try {
                    const reply = await Reply.findById(id);
                    if (!reply) {
                        set.status = 404;
                        return { success: false, message: 'Reply not found' };
                    }

                    // Update thread and user counts
                    await Thread.findByIdAndUpdate(reply.thread, { $inc: { replyCount: -1 } });
                    await User.findByIdAndUpdate(reply.author, { $inc: { replyCount: -1 } });

                    await Reply.findByIdAndDelete(id);

                    return { success: true, message: 'Reply deleted' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Like/Unlike reply
            .post('/:id/like', async ({ params: { id }, body, set }) => {
                try {
                    const { userId } = body as any;
                    if (!userId) {
                        set.status = 401;
                        return { success: false, message: 'Unauthorized' };
                    }

                    const reply = await Reply.findById(id);
                    if (!reply) {
                        set.status = 404;
                        return { success: false, message: 'Reply not found' };
                    }

                    const isLiked = reply.likes.includes(userId);
                    let updateQuery;

                    if (isLiked) {
                        // Unlike
                        updateQuery = {
                            $pull: { likes: userId },
                            $inc: { likeCount: -1 }
                        };
                    } else {
                        // Like
                        updateQuery = {
                            $addToSet: { likes: userId },
                            $inc: { likeCount: 1 }
                        };
                    }

                    const updatedReply = await Reply.findByIdAndUpdate(id, updateQuery, { new: true });

                    return {
                        success: true,
                        data: {
                            likeCount: updatedReply!.likeCount,
                            isLiked: !isLiked
                        }
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
