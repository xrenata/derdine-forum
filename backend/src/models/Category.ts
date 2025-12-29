import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'folder' },
    color: { type: String, default: '#3B82F6' },
    threadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Category = mongoose.model('Category', CategorySchema);
