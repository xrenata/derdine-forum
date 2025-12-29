package com.example.derdine.data.model

data class Thread(
    val id: String,
    val title: String,
    val content: String,
    val author: User,
    val category: Category,
    val createAt: Long,
    val viewCount: Int = 0,
    val replyCount: Int = 0,
    val likeCount: Int = 0,
    val isPinned: Boolean = false,
    val isLocked: Boolean = false
)
