'use client';

import Link from 'next/link';
import { Category } from '@/lib/api';
import {
    ComputerDesktopIcon,
    MusicalNoteIcon,
    PaintBrushIcon,
    BeakerIcon,
    FolderIcon,
    RectangleStackIcon
} from '@heroicons/react/24/outline';

interface CategoryCardProps {
    category: Category;
}

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    computer: ComputerDesktopIcon,
    music_note: MusicalNoteIcon,
    palette: PaintBrushIcon,
    science: BeakerIcon,
    folder: FolderIcon,
};

export default function CategoryCard({ category }: CategoryCardProps) {
    const IconComponent = iconMap[category.icon] || RectangleStackIcon;

    return (
        <Link href={`/categories/${category._id}`}>
            <div className="bg-gray-900 rounded-xl p-5 card-hover border border-gray-800 h-full">
                {/* Icon */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${category.color}20` }}
                >
                    <IconComponent
                        className="w-6 h-6"
                        style={{ color: category.color }}
                    />
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-white mb-2">
                    {category.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {category.description}
                </p>

                {/* Thread count */}
                <div
                    className="inline-flex px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                        backgroundColor: `${category.color}15`,
                        color: category.color
                    }}
                >
                    {category.threadCount} konu
                </div>
            </div>
        </Link>
    );
}
