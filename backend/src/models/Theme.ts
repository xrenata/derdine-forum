import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
    // Primary Colors
    primary: { type: String, default: '#6366F1' },
    primaryVariant: { type: String, default: '#4F46E5' },
    onPrimary: { type: String, default: '#FFFFFF' },

    // Secondary Colors
    secondary: { type: String, default: '#8B5CF6' },
    secondaryVariant: { type: String, default: '#7C3AED' },
    onSecondary: { type: String, default: '#FFFFFF' },

    // Background Colors
    backgroundDark: { type: String, default: '#0F0F1E' },
    backgroundLight: { type: String, default: '#FAFAFA' },

    // Surface Colors
    surfaceDark: { type: String, default: '#1A1A2E' },
    surfaceLight: { type: String, default: '#FFFFFF' },

    // Text Colors
    onBackgroundDark: { type: String, default: '#E5E5E5' },
    onBackgroundLight: { type: String, default: '#1A1A1A' },
    onSurfaceDark: { type: String, default: '#FFFFFF' },
    onSurfaceLight: { type: String, default: '#1A1A1A' },

    // Status Colors
    error: { type: String, default: '#EF4444' },
    onError: { type: String, default: '#FFFFFF' },
    success: { type: String, default: '#10B981' },
    warning: { type: String, default: '#F59E0B' },
    info: { type: String, default: '#3B82F6' },

    updatedAt: { type: Date, default: Date.now }
});

export const Theme = mongoose.model('Theme', ThemeSchema);
