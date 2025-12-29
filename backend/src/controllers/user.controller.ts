import { Elysia } from 'elysia';
import { User } from '../models/User';

// Bcrypt-like password hashing using Bun's built-in crypto
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + (process.env.PASSWORD_SALT || 'forum_secret_salt_2024'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const hashedInput = await hashPassword(password);
    return hashedInput === hashedPassword;
};

export const userController = (app: Elysia) =>
    app.group('/api/users', (app) =>
        app
            // Get all users
            .get('/', async ({ set }) => {
                try {
                    const users = await User.find().select('-password').sort({ createdAt: -1 });
                    return { success: true, count: users.length, data: users };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Get single user
            .get('/:id', async ({ params: { id }, set }) => {
                try {
                    const user = await User.findById(id).select('-password');
                    if (!user) {
                        set.status = 404;
                        return { success: false, message: 'User not found' };
                    }
                    return { success: true, data: user };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Register user - Requires admin token in production
            .post('/', async ({ body, headers, set }) => {
                try {
                    const adminToken = headers['x-admin-token'];

                    // Only allow registration with admin token
                    if (adminToken !== process.env.ADMIN_TOKEN && process.env.NODE_ENV === 'production') {
                        set.status = 403;
                        return { success: false, message: 'Registration requires admin authorization' };
                    }

                    const { username, email, password, badge } = body as any;

                    if (!username || !email || !password) {
                        set.status = 400;
                        return { success: false, message: 'Username, email and password are required' };
                    }

                    // Check if user exists
                    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
                    if (existingUser) {
                        set.status = 400;
                        return { success: false, message: 'User already exists' };
                    }

                    // Hash password
                    const hashedPassword = await hashPassword(password);
                    const user = await User.create({
                        username,
                        email,
                        password: hashedPassword,
                        badge: badge || 'Yeni Üye'
                    });

                    // Remove password from response
                    const userResponse = user.toObject();
                    delete (userResponse as any).password;

                    set.status = 201;
                    return { success: true, data: userResponse };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Login user
            .post('/login', async ({ body, set }) => {
                try {
                    const { email, password } = body as any;

                    if (!email || !password) {
                        set.status = 400;
                        return { success: false, message: 'Email and password are required' };
                    }

                    const user = await User.findOne({ email });
                    if (!user) {
                        set.status = 401;
                        return { success: false, message: 'Invalid credentials' };
                    }

                    // Verify password - supports both hashed and plain text (for migration)
                    const isValidHash = await verifyPassword(password, user.password);
                    const isValidPlain = user.password === password; // Fallback for old passwords

                    if (!isValidHash && !isValidPlain) {
                        set.status = 401;
                        return { success: false, message: 'Invalid credentials' };
                    }

                    // If plain text password was used, upgrade to hashed
                    if (isValidPlain && !isValidHash) {
                        user.password = await hashPassword(password);
                    }

                    // Update online status
                    user.isOnline = true;
                    await user.save();

                    // Remove password from response
                    const userResponse = user.toObject();
                    delete (userResponse as any).password;

                    return {
                        success: true,
                        data: userResponse,
                        message: 'Login successful'
                    };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Logout user
            .post('/logout', async ({ body, set }) => {
                try {
                    const { userId } = body as any;

                    if (!userId) {
                        set.status = 400;
                        return { success: false, message: 'User ID is required' };
                    }

                    const user = await User.findByIdAndUpdate(
                        userId,
                        { isOnline: false },
                        { new: true }
                    ).select('-password');

                    if (!user) {
                        set.status = 404;
                        return { success: false, message: 'User not found' };
                    }

                    return { success: true, message: 'Logged out successfully' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Update user - Only self or admin
            .put('/:id', async ({ params: { id }, body, headers, set }) => {
                try {
                    const requestingUserId = headers['x-user-id'];
                    const adminToken = headers['x-admin-token'];

                    // Check authorization
                    const isAdmin = adminToken === process.env.ADMIN_TOKEN;
                    const isSelf = requestingUserId === id;

                    if (!isAdmin && !isSelf && process.env.NODE_ENV === 'production') {
                        set.status = 403;
                        return { success: false, message: 'Not authorized to update this user' };
                    }

                    const updateData = body as any;
                    delete updateData.password;
                    delete updateData.email;
                    updateData.updatedAt = new Date();

                    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
                    if (!user) {
                        set.status = 404;
                        return { success: false, message: 'User not found' };
                    }
                    return { success: true, data: user };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            // Delete user - Admin only
            .delete('/:id', async ({ params: { id }, headers, set }) => {
                try {
                    const adminToken = headers['x-admin-token'];

                    // Only admin can delete users
                    if (adminToken !== process.env.ADMIN_TOKEN && process.env.NODE_ENV === 'production') {
                        set.status = 403;
                        return { success: false, message: 'Only admin can delete users' };
                    }

                    const user = await User.findByIdAndDelete(id);
                    if (!user) {
                        set.status = 404;
                        return { success: false, message: 'User not found' };
                    }
                    return { success: true, message: 'User deleted' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
            .post('/:id/change-password', async ({ params: { id }, body, headers, set }) => {
                try {
                    const requestingUserId = headers['x-user-id'];

                    if (requestingUserId !== id && process.env.NODE_ENV === 'production') {
                        set.status = 403;
                        return { success: false, message: 'Not authorized' };
                    }

                    const { currentPassword, newPassword } = body as any;

                    if (!currentPassword || !newPassword) {
                        set.status = 400;
                        return { success: false, message: 'Current and new password are required' };
                    }

                    if (newPassword.length < 6) {
                        set.status = 400;
                        return { success: false, message: 'Password must be at least 6 characters' };
                    }

                    const user = await User.findById(id);
                    if (!user) {
                        set.status = 404;
                        return { success: false, message: 'User not found' };
                    }

                    // Verify current password
                    const isValid = await verifyPassword(currentPassword, user.password);
                    const isValidPlain = user.password === currentPassword;

                    if (!isValid && !isValidPlain) {
                        set.status = 401;
                        return { success: false, message: 'Current password is incorrect' };
                    }

                    // Update password
                    user.password = await hashPassword(newPassword);
                    user.updatedAt = new Date();
                    await user.save();

                    return { success: true, message: 'Password changed successfully' };
                } catch (error) {
                    set.status = 500;
                    return { success: false, message: 'Server Error', error };
                }
            })
    );
