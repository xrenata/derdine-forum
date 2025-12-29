import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    badge: { type: String, default: null },
    isOnline: { type: Boolean, default: false },
    threadCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
