import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    viewCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Thread = mongoose.model('Thread', ThreadSchema);
