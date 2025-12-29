import mongoose from 'mongoose';

const UIConfigSchema = new mongoose.Schema({
    screen: {
        type: String,
        required: true,
    },
    config: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index for unique config per screen if desired, or just screen based.
// For now, we assume one config document per screen.
UIConfigSchema.index({ screen: 1 }, { unique: true });

export const UIConfig = mongoose.model('UIConfig', UIConfigSchema);
