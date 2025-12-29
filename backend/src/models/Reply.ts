import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Reply = mongoose.model('Reply', ReplySchema);
