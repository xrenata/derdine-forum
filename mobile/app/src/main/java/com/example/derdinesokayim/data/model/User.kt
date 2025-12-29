package com.example.derdinesokayim.data.model

data class User(
    val id: String,
    val username: String,
    val avatarUrl: String? = null,
    val badge: String? = null,
    val isOnline: Boolean = false,
    val threadCount: Int = 0,
    val replyCount: Int = 0,
    val reputation: Int = 0
)
