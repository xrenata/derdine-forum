package com.example.derdinesokayim.data.model

import androidx.compose.ui.graphics.Color

data class Category(
    val id: String,
    val name: String,
    val description: String,
    val icon: String,
    val color: Color,
    val threadCount: Int = 0
)
