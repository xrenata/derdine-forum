package com.example.derdinesokayim.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.derdinesokayim.data.model.User

@Composable
fun UserAvatar(
    user: User,
    size: Dp = 40.dp,
    showOnlineStatus: Boolean = false,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        // Avatar circle with initial
        Box(
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primary),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = user.username.first().uppercase(),
                color = Color.White,
                fontSize = (size.value / 2).sp,
                fontWeight = FontWeight.Bold
            )
        }
        
        // Online status indicator
        if (showOnlineStatus && user.isOnline) {
            Box(
                modifier = Modifier
                    .size(size / 4)
                    .clip(CircleShape)
                    .background(Color(0xFF10B981))
                    .align(Alignment.BottomEnd)
            )
        }
    }
}
