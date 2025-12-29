const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface ThemeColors {
    _id: string;
    primary: string;
    primaryVariant: string;
    onPrimary: string;
    secondary: string;
    secondaryVariant: string;
    onSecondary: string;
    backgroundDark: string;
    backgroundLight: string;
    surfaceDark: string;
    surfaceLight: string;
    onBackgroundDark: string;
    onBackgroundLight: string;
    onSurfaceDark: string;
    onSurfaceLight: string;
    error: string;
    onError: string;
    success: string;
    warning: string;
    info: string;
}

export interface Category {
    _id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    threadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    badge?: string;
    isOnline: boolean;
    threadCount: number;
    replyCount: number;
    reputation: number;
}

export interface Thread {
    _id: string;
    title: string;
    content: string;
    author: User;
    category: Category;
    viewCount: number;
    replyCount: number;
    likeCount: number;
    isLiked?: boolean;
    isPinned: boolean;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Reply {
    _id: string;
    thread: string;
    content: string;
    author: User;
    likeCount: number;
    isLiked?: boolean;
    likes?: string[];
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Labels {
    _id: string;
    home: { title: string; trending: string; recent: string; pinnedThreads: string };
    categories: { title: string; threads: string };
    thread: { replies: string; writeReply: string; views: string; likes: string };
    profile: { title: string; threads: string; replies: string; reputation: string; editProfile: string };
    settings: { title: string; darkMode: string; notifications: string; language: string; logout: string };
    search: { placeholder: string; noResults: string };
    createThread: { title: string; titlePlaceholder: string; contentPlaceholder: string; selectCategory: string };
    buttons: { submit: string; cancel: string; save: string; delete: string; edit: string; reply: string; like: string; share: string };
    navigation: { home: string; categories: string; notifications: string; profile: string };
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
    total?: number;
}

// API Functions
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
    const json: ApiResponse<T> = await res.json();
    if (!json.success) throw new Error(json.message || 'API Error');
    return json.data;
}

// Theme
export const getTheme = () => fetchApi<ThemeColors>('/api/theme');
export const updateTheme = (data: Partial<ThemeColors>) =>
    fetchApi<ThemeColors>('/api/theme', { method: 'PUT', body: JSON.stringify(data) });

// Categories
export const getCategories = () => fetchApi<Category[]>('/api/categories');
export const getCategory = (id: string) => fetchApi<Category>(`/api/categories/${id}`);
export const createCategory = (data: Partial<Category>) =>
    fetchApi<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id: string, data: Partial<Category>) =>
    fetchApi<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id: string) =>
    fetchApi<void>(`/api/categories/${id}`, { method: 'DELETE' });

// Labels
export const getLabels = () => fetchApi<Labels>('/api/labels');
export const updateLabels = (data: Partial<Labels>) =>
    fetchApi<Labels>('/api/labels', { method: 'PUT', body: JSON.stringify(data) });

// Users
export const getUsers = () => fetchApi<User[]>('/api/users');
export const getUser = (id: string) => fetchApi<User>(`/api/users/${id}`);
export const createUser = (data: Partial<User & { password: string }>) =>
    fetchApi<User>('/api/users', { method: 'POST', body: JSON.stringify(data) });
// Helper for AuthContext - internally calls createUser but named for clarity
export const register = (username: string, email: string, password: string) =>
    fetchApi<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
    });
export const login = (email: string, password: string) =>
    fetchApi<User>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
export const updateUser = (id: string, data: Partial<User>) =>
    fetchApi<User>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id: string) =>
    fetchApi<void>(`/api/users/${id}`, { method: 'DELETE' });
export const changePassword = (id: string, data: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ success: boolean; message: string }>(`/api/users/${id}/change-password`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'x-user-id': id }
    });

// Threads
export const getThreads = (params?: { category?: string; author?: string; pinned?: boolean; limit?: number; page?: number; userId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.author) searchParams.set('author', params.author);
    if (params?.pinned !== undefined) searchParams.set('pinned', String(params.pinned));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.userId) searchParams.set('userId', params.userId);
    const query = searchParams.toString();
    return fetchApi<Thread[]>(`/api/threads${query ? `?${query}` : ''}`);
};
export const getThread = (id: string, userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return fetchApi<Thread>(`/api/threads/${id}${query}`);
};
export const createThread = (data: { title: string; content: string; author: string; category: string }) =>
    fetchApi<Thread>('/api/threads', { method: 'POST', body: JSON.stringify(data) });
export const updateThread = (id: string, data: Partial<Thread>) =>
    fetchApi<Thread>(`/api/threads/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteThread = (id: string) =>
    fetchApi<void>(`/api/threads/${id}`, { method: 'DELETE' });
export const likeThread = (id: string, userId: string) =>
    fetchApi<{ likeCount: number; isLiked: boolean }>(`/api/threads/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });

// Replies
export const getReplies = (threadId: string, params?: { limit?: number; page?: number; userId?: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.set('thread', threadId);
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.userId) searchParams.set('userId', params.userId);
    return fetchApi<Reply[]>(`/api/replies?${searchParams.toString()}`);
};
export const createReply = (data: { thread: string; content: string; author: string }) =>
    fetchApi<Reply>('/api/replies', { method: 'POST', body: JSON.stringify(data) });
export const deleteReply = (id: string) =>
    fetchApi<void>(`/api/replies/${id}`, { method: 'DELETE' });
export const likeReply = (id: string, userId: string) =>
    fetchApi<{ likeCount: number; isLiked: boolean }>(`/api/replies/${id}/like`, {
        method: 'POST',
        body: JSON.stringify({ userId })
    });

// Seed
export const seedDatabase = () =>
    fetchApi<{ theme: boolean; labels: boolean; categories: number; users: number }>('/api/seed', { method: 'POST' });
