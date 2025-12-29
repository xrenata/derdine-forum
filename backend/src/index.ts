import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import connectDB from './db/connect';

// Controllers
import { themeController } from './controllers/theme.controller';
import { categoryController } from './controllers/category.controller';
import { labelsController } from './controllers/labels.controller';
import { userController } from './controllers/user.controller';
import { threadController } from './controllers/thread.controller';
import { replyController } from './controllers/reply.controller';
import { adminController } from './controllers/admin.controller';

// Connect to MongoDB
connectDB();

const app = new Elysia()
    .use(cors())
    .get('/', () => ({
        message: 'Derdine Forum API is running',
        version: '1.0.0',
        endpoints: {
            theme: '/api/theme',
            categories: '/api/categories',
            labels: '/api/labels',
            users: '/api/users',
            threads: '/api/threads',
            replies: '/api/replies'
        }
    }))
    // Register controllers
    .use(themeController)
    .use(categoryController)
    .use(labelsController)
    .use(userController)
    .use(threadController)
    .use(replyController)
    .use(adminController)
    .listen({
        port: process.env.PORT || 3000,
        hostname: '0.0.0.0'
    });

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
