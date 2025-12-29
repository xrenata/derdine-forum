package com.example.derdinesokayim.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

object ApiConfig {
    const val BASE_URL = "http://10.0.2.2:3001/"
}

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val message: String? = null,
    val count: Int? = null,
    val total: Int? = null
)

data class ThemeResponse(
    val _id: String,
    val primary: String,
    val primaryVariant: String,
    val onPrimary: String,
    val secondary: String,
    val secondaryVariant: String,
    val onSecondary: String,
    val backgroundDark: String,
    val backgroundLight: String,
    val surfaceDark: String,
    val surfaceLight: String,
    val onBackgroundDark: String,
    val onBackgroundLight: String,
    val onSurfaceDark: String,
    val onSurfaceLight: String,
    val error: String,
    val onError: String,
    val success: String,
    val warning: String,
    val info: String
)

// Category Model
data class CategoryResponse(
    val _id: String,
    val name: String,
    val description: String,
    val icon: String,
    val color: String,
    val threadCount: Int,
    val createdAt: String,
    val updatedAt: String
)

// User Model
data class UserResponse(
    val _id: String,
    val username: String,
    val email: String? = null,
    val avatarUrl: String? = null,
    val badge: String? = null,
    val isOnline: Boolean = false,
    val threadCount: Int = 0,
    val replyCount: Int = 0,
    val reputation: Int = 0
)

// Login Request
data class LoginRequest(
    val email: String,
    val password: String
)

// Create Thread Request
data class CreateThreadRequest(
    val title: String,
    val content: String,
    val author: String,
    val category: String
)

// Create Reply Request
data class CreateReplyRequest(
    val thread: String,
    val content: String,
    val author: String
)

// Like Request
data class LikeRequest(
    val userId: String
)

// Thread Model
data class ThreadResponse(
    val _id: String,
    val title: String,
    val content: String,
    val author: UserResponse?,
    val category: CategoryResponse,
    val viewCount: Int = 0,
    val replyCount: Int = 0,
    val likeCount: Int = 0,
    val isLiked: Boolean = false,
    val isPinned: Boolean = false,
    val isLocked: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)

// Reply Model
data class ReplyResponse(
    val _id: String,
    val thread: String,
    val content: String,
    val author: UserResponse?,
    val likeCount: Int = 0,
    val isLiked: Boolean = false,
    val isEdited: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)

// Like Response
data class LikeResponse(
    val likeCount: Int,
    val isLiked: Boolean
)

// Labels Model
data class LabelsResponse(
    val _id: String,
    val home: HomeLabels,
    val categories: CategoriesLabels,
    val thread: ThreadLabels,
    val profile: ProfileLabels,
    val settings: SettingsLabels,
    val search: SearchLabels,
    val createThread: CreateThreadLabels,
    val buttons: ButtonLabels,
    val navigation: NavigationLabels
)

data class HomeLabels(
    val title: String,
    val trending: String,
    val recent: String,
    val pinnedThreads: String
)

data class CategoriesLabels(
    val title: String,
    val threads: String
)

data class ThreadLabels(
    val replies: String,
    val writeReply: String,
    val views: String,
    val likes: String
)

data class ProfileLabels(
    val title: String,
    val threads: String,
    val replies: String,
    val reputation: String,
    val editProfile: String
)

data class SettingsLabels(
    val title: String,
    val darkMode: String,
    val notifications: String,
    val language: String,
    val logout: String
)

data class SearchLabels(
    val placeholder: String,
    val noResults: String
)

data class CreateThreadLabels(
    val title: String,
    val titlePlaceholder: String,
    val contentPlaceholder: String,
    val selectCategory: String
)

data class ButtonLabels(
    val submit: String,
    val cancel: String,
    val save: String,
    val delete: String,
    val edit: String,
    val reply: String,
    val like: String,
    val share: String
)

data class NavigationLabels(
    val home: String,
    val categories: String,
    val notifications: String,
    val profile: String
)

// API Interface
interface ForumApi {
    
    // Theme
    @GET("api/theme")
    suspend fun getTheme(): ApiResponse<ThemeResponse>
    
    // Categories
    @GET("api/categories")
    suspend fun getCategories(): ApiResponse<List<CategoryResponse>>
    
    @GET("api/categories/{id}")
    suspend fun getCategory(@Path("id") id: String): ApiResponse<CategoryResponse>
    
    // Labels
    @GET("api/labels")
    suspend fun getLabels(): ApiResponse<LabelsResponse>
    
    // Users
    @GET("api/users")
    suspend fun getUsers(): ApiResponse<List<UserResponse>>
    
    @GET("api/users/{id}")
    suspend fun getUser(@Path("id") id: String): ApiResponse<UserResponse>
    
    // Login
    @POST("api/users/login")
    suspend fun login(@Body credentials: LoginRequest): ApiResponse<UserResponse>
    
    // Threads
    @GET("api/threads")
    suspend fun getThreads(
        @Query("category") category: String? = null,
        @Query("author") author: String? = null,
        @Query("pinned") pinned: Boolean? = null,
        @Query("limit") limit: Int = 20,
        @Query("page") page: Int = 1,
        @Query("userId") userId: String? = null
    ): ApiResponse<List<ThreadResponse>>
    
    @GET("api/threads/{id}")
    suspend fun getThread(
        @Path("id") id: String,
        @Query("userId") userId: String? = null
    ): ApiResponse<ThreadResponse>
    
    @POST("api/threads")
    suspend fun createThread(@Body request: CreateThreadRequest): ApiResponse<ThreadResponse>
    
    @POST("api/threads/{id}/like")
    suspend fun likeThread(@Path("id") id: String, @Body request: LikeRequest): ApiResponse<LikeResponse>
    
    // Replies
    @GET("api/replies")
    suspend fun getReplies(
        @Query("thread") thread: String? = null,
        @Query("author") author: String? = null,
        @Query("limit") limit: Int = 20,
        @Query("page") page: Int = 1,
        @Query("userId") userId: String? = null
    ): ApiResponse<List<ReplyResponse>>
    
    @POST("api/replies")
    suspend fun createReply(@Body request: CreateReplyRequest): ApiResponse<ReplyResponse>
    
    @POST("api/replies/{id}/like")
    suspend fun likeReply(@Path("id") id: String, @Body request: LikeRequest): ApiResponse<LikeResponse>

    // Profile Updates
    @PUT("api/users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Header("x-user-id") userId: String,
        @Body request: UpdateUserRequest
    ): ApiResponse<UserResponse>

    @POST("api/users/{id}/change-password")
    suspend fun changePassword(
        @Path("id") id: String,
        @Header("x-user-id") userId: String,
        @Body request: ChangePasswordRequest
    ): ApiResponse<Map<String, String>>
}

// Update Requests
data class UpdateUserRequest(
    val avatarUrl: String
)

data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)

// Retrofit Instance
object RetrofitClient {
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(ApiConfig.BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val api: ForumApi = retrofit.create(ForumApi::class.java)
}
