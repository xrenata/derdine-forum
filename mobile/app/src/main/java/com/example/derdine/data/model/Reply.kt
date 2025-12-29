package com.example.derdinesokayim.data.model

data class Reply(
    val id: String,
    val threadId: String,
    val content: String,
    val author: User,
    val createdAt: Long,
    val likeCount: Int = 0,
    val isLiked: Boolean = false,
    val isEdited: Boolean = false
)
