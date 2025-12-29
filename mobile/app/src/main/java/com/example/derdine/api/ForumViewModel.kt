package com.example.derdine.api

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import com.example.derdine.auth.AuthManager

// UI State classes
data class ForumUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val theme: ThemeResponse? = null,
    val labels: LabelsResponse? = null,
    val categories: List<CategoryResponse> = emptyList(),
    val threads: List<ThreadResponse> = emptyList(),
    val users: List<UserResponse> = emptyList(),
    val currentThread: ThreadResponse? = null,
    val replies: List<ReplyResponse> = emptyList(),
    val currentUser: UserResponse? = null,
    val profileThreads: List<ThreadResponse> = emptyList(),
    val profileReplies: List<ReplyResponse> = emptyList()
)

// Login State
data class LoginState(
    val isLoading: Boolean = false,
    val isSuccess: Boolean = false,
    val error: String? = null
)

class ForumViewModel : ViewModel() {
    
    private val repository = ForumRepository()
    
    var uiState by mutableStateOf(ForumUiState())
        private set
    
    var loginState by mutableStateOf(LoginState())
        private set
    
    init {
        loadInitialData()
    }
    
    private fun loadInitialData() {
        loadTheme()
        loadLabels()
        loadCategories()
        loadThreads()
    }
    
    // Set logged in user from saved session and verify it
    fun setLoggedInUser(user: UserResponse) {
        // Optimistically set user first
        uiState = uiState.copy(currentUser = user)
        
        // Then verify with backend
        verifySession(user._id)
    }

    private fun verifySession(userId: String) {
        viewModelScope.launch {
            // We use getUser to verify if the user still exists
            // This is crucial because during dev, DB might be reset but mobile app keeps local storage
            repository.getUser(userId)
                .onSuccess { verifiedUser ->
                     // API returns success, update user with latest data
                     uiState = uiState.copy(currentUser = verifiedUser)
                }
                .onFailure {
                    // User not found or API error (e.g. 404)
                    // If 404, we MUST logout to prevent "Author not found" issues
                    if (it.message?.contains("404") == true || it.message?.contains("not found", ignoreCase = true) == true) {
                         logout()
                    }
                    // For network errors, we might want to keep the session optimistically, 
                    // or logout to be safe. Given the user report, let's be strict.
                    // But for pure network error (offline), we should maybe keep it?
                    // Let's assume for this specific "login required not showing" bug, it's the 404 case.
                }
        }
    }
    
    // Login function
    fun login(email: String, password: String) {
        viewModelScope.launch {
            loginState = LoginState(isLoading = true)
            repository.login(email, password)
                .onSuccess { user ->
                    uiState = uiState.copy(currentUser = user)
                    loginState = LoginState(isSuccess = true, isLoading = false)
                }
                .onFailure { error ->
                    loginState = LoginState(error = error.message ?: "Giriş başarısız", isLoading = false)
                }
        }
    }
    


    // Logout function
    fun logout() {
        uiState = uiState.copy(currentUser = null)
        loginState = LoginState()
        AuthManager.logout()
    }
    
    fun resetLoginState() {
        loginState = LoginState()
    }
    
    // Settings State
    var isDarkMode by mutableStateOf(com.example.derdine.auth.SettingsManager.isDarkMode)
        private set
        
    var areNotificationsEnabled by mutableStateOf(com.example.derdine.auth.SettingsManager.areNotificationsEnabled)
        private set
        
    fun toggleDarkMode() {
        isDarkMode = !isDarkMode
        com.example.derdine.auth.SettingsManager.isDarkMode = isDarkMode
    }
    
    fun toggleNotifications() {
        areNotificationsEnabled = !areNotificationsEnabled
        com.example.derdine.auth.SettingsManager.areNotificationsEnabled = areNotificationsEnabled
    }
    
    fun loadTheme() {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.getTheme()
                .onSuccess { theme ->
                    uiState = uiState.copy(theme = theme, isLoading = false, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }
    
    fun loadLabels() {
        viewModelScope.launch {
            repository.getLabels()
                .onSuccess { labels ->
                    uiState = uiState.copy(labels = labels, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message)
                }
        }
    }
    
    fun loadCategories() {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.getCategories()
                .onSuccess { categories ->
                    uiState = uiState.copy(categories = categories, isLoading = false, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }
    
    fun loadThreads(categoryId: String? = null, pinned: Boolean? = null) {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.getThreads(categoryId = categoryId, pinned = pinned, userId = uiState.currentUser?._id)
                .onSuccess { threads ->
                    uiState = uiState.copy(threads = threads, isLoading = false, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }
    
    fun loadThread(id: String) {
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.getThread(id, userId = uiState.currentUser?._id)
                .onSuccess { thread ->
                    uiState = uiState.copy(currentThread = thread, isLoading = false, error = null)
                    loadReplies(id)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }
    
    fun loadReplies(threadId: String) {
        viewModelScope.launch {
            repository.getReplies(thread = threadId, userId = uiState.currentUser?._id)
                .onSuccess { replies ->
                    uiState = uiState.copy(replies = replies, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message)
                }
        }
    }
    
    fun loadUserProfile(userId: String) {
        viewModelScope.launch {
            // Load user threads
            launch {
                repository.getThreads(authorId = userId)
                    .onSuccess { threads ->
                        uiState = uiState.copy(profileThreads = threads)
                    }
            }
            
            // Load user replies
            launch {
                repository.getReplies(author = userId)
                    .onSuccess { replies ->
                        uiState = uiState.copy(profileReplies = replies)
                    }
            }
        }
    }
    
    fun loadUsers() {
        viewModelScope.launch {
            repository.getUsers()
                .onSuccess { users ->
                    uiState = uiState.copy(users = users, error = null)
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message)
                }
        }
    }
    
    fun likeThread(id: String) {
        val userId = uiState.currentUser?._id ?: return
        viewModelScope.launch {
            repository.likeThread(id, userId)
                .onSuccess { likeResponse ->
                    // Update the thread in the list
                    val updatedThreads = uiState.threads.map { thread ->
                        if (thread._id == id) thread.copy(likeCount = likeResponse.likeCount, isLiked = likeResponse.isLiked) else thread
                    }
                    uiState = uiState.copy(threads = updatedThreads)
                    
                    // Update current thread if viewing it
                    uiState.currentThread?.let { current ->
                        if (current._id == id) {
                            uiState = uiState.copy(currentThread = current.copy(likeCount = likeResponse.likeCount, isLiked = likeResponse.isLiked))
                        }
                    }
                }
        }
    }
    
    fun likeReply(id: String) {
        val userId = uiState.currentUser?._id ?: return
        viewModelScope.launch {
            repository.likeReply(id, userId)
                .onSuccess { likeResponse ->
                    val updatedReplies = uiState.replies.map { reply ->
                        if (reply._id == id) reply.copy(likeCount = likeResponse.likeCount, isLiked = likeResponse.isLiked) else reply
                    }
                    uiState = uiState.copy(replies = updatedReplies)
                }
        }
    }
    
    fun clearError() {
        uiState = uiState.copy(error = null)
    }
    
    fun refresh() {
        loadInitialData()
    }
    
    // Create Thread
    fun createThread(
        title: String,
        content: String,
        categoryId: String,
        onSuccess: () -> Unit
    ) {
        val authorId = uiState.currentUser?._id ?: return
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.createThread(title, content, authorId, categoryId)
                .onSuccess { thread ->
                    uiState = uiState.copy(isLoading = false, error = null)
                    loadThreads()
                    onSuccess()
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }
    
    // Create Reply
    fun createReply(
        threadId: String,
        content: String,
        onSuccess: () -> Unit
    ) {
        val authorId = uiState.currentUser?._id ?: return
        viewModelScope.launch {
            uiState = uiState.copy(isLoading = true)
            repository.createReply(threadId, content, authorId)
                .onSuccess { reply ->
                    // Add new reply to list
                    val updatedReplies = uiState.replies + reply
                    uiState = uiState.copy(
                        replies = updatedReplies,
                        isLoading = false,
                        error = null
                    )
                    // Update reply count on current thread
                    uiState.currentThread?.let { thread ->
                        uiState = uiState.copy(
                            currentThread = thread.copy(replyCount = thread.replyCount + 1)
                        )
                    }
                    onSuccess()
                }
                .onFailure { error ->
                    uiState = uiState.copy(error = error.message, isLoading = false)
                }
        }
    }

    // Update User
    fun updateUser(avatarUrl: String, onSuccess: () -> Unit, onError: (String) -> Unit) {
        val user = uiState.currentUser ?: return
        viewModelScope.launch {
            repository.updateUser(user._id, avatarUrl)
                .onSuccess { updatedUser ->
                    uiState = uiState.copy(currentUser = updatedUser)
                    onSuccess()
                }
                .onFailure { error ->
                    onError(error.message ?: "Profil güncellenemedi")
                }
        }
    }

    // Change Password
    fun changePassword(current: String, new: String, onSuccess: () -> Unit, onError: (String) -> Unit) {
        val user = uiState.currentUser ?: return
        viewModelScope.launch {
            repository.changePassword(user._id, current, new)
                .onSuccess {
                    onSuccess()
                }
                .onFailure { error ->
                    onError(error.message ?: "Şifre değiştirilemedi")
                }
        }
    }
}
