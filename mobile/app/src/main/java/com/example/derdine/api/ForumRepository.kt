package com.example.derdine.api

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ForumRepository {
    
    private val api = RetrofitClient.api
    
    // Theme
    suspend fun getTheme(): Result<ThemeResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.getTheme()
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get theme"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Categories
    suspend fun getCategories(): Result<List<CategoryResponse>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getCategories()
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get categories"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getCategory(id: String): Result<CategoryResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.getCategory(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Category not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Labels
    suspend fun getLabels(): Result<LabelsResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.getLabels()
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get labels"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Users
    suspend fun getUsers(): Result<List<UserResponse>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getUsers()
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get users"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUser(id: String): Result<UserResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.getUser(id)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "User not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Login
    suspend fun login(email: String, password: String): Result<UserResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.login(LoginRequest(email, password))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Giriş başarısız"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Threads
    suspend fun getThreads(
        categoryId: String? = null,
        authorId: String? = null,
        pinned: Boolean? = null,
        limit: Int = 20,
        page: Int = 1,
        userId: String? = null
    ): Result<List<ThreadResponse>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getThreads(categoryId, authorId, pinned, limit, page, userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get threads"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getThread(id: String, userId: String? = null): Result<ThreadResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.getThread(id, userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Thread not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun likeThread(id: String, userId: String): Result<LikeResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.likeThread(id, LikeRequest(userId))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to like thread"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Replies
    suspend fun getReplies(
        thread: String? = null,
        author: String? = null,
        limit: Int = 20,
        page: Int = 1,
        userId: String? = null
    ): Result<List<ReplyResponse>> = withContext(Dispatchers.IO) {
        try {
            val response = api.getReplies(thread, author, limit, page, userId)
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to get replies"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun likeReply(id: String, userId: String): Result<LikeResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.likeReply(id, LikeRequest(userId))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Failed to like reply"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Create Thread
    suspend fun createThread(
        title: String,
        content: String,
        authorId: String,
        categoryId: String
    ): Result<ThreadResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.createThread(CreateThreadRequest(title, content, authorId, categoryId))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Konu oluşturulamadı"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Create Reply
    suspend fun createReply(
        threadId: String,
        content: String,
        authorId: String
    ): Result<ReplyResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.createReply(CreateReplyRequest(threadId, content, authorId))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Cevap gönderilemedi"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    // Update User
    suspend fun updateUser(id: String, avatarUrl: String): Result<UserResponse> = withContext(Dispatchers.IO) {
        try {
            val response = api.updateUser(id, id, UpdateUserRequest(avatarUrl))
            if (response.success && response.data != null) {
                Result.success(response.data)
            } else {
                Result.failure(Exception(response.message ?: "Profil güncellenemedi"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Change Password
    suspend fun changePassword(id: String, current: String, new: String): Result<String> = withContext(Dispatchers.IO) {
        try {
            val response = api.changePassword(id, id, ChangePasswordRequest(current, new))
            if (response.success) {
                Result.success(response.message ?: "Şifre değiştirildi")
            } else {
                Result.failure(Exception(response.message ?: "Şifre değiştirilemedi"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
