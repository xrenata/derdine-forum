package com.example.derdine.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.derdine.api.ForumViewModel
import com.example.derdine.api.ReplyResponse
import com.example.derdine.navigation.Screen
import com.example.derdine.ui.components.UserAvatarApi
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThreadDetailScreen(
    threadId: String,
    navController: NavController,
    viewModel: ForumViewModel,
    modifier: Modifier = Modifier
) {
    val uiState = viewModel.uiState
    val labels = uiState.labels?.thread
    
    var replyText by remember { mutableStateOf("") }
    // Load thread and replies
    LaunchedEffect(threadId) {
        viewModel.loadThread(threadId)
    }
    
    val thread = uiState.currentThread
    val replies = uiState.replies
    
    var isLiked by remember(thread?.isLiked) { mutableStateOf(thread?.isLiked ?: false) }
    
    val context = androidx.compose.ui.platform.LocalContext.current
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Konu Detayı") },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.Default.ArrowBack, "Geri")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        val sendIntentStr = android.content.Intent().apply {
                            action = android.content.Intent.ACTION_SEND
                            putExtra(android.content.Intent.EXTRA_TEXT, "Bu konuyu incele: ${thread?.title} - http://localhost:3000/thread/${threadId}")
                            type = "text/plain"
                        }
                        val shareIntent = android.content.Intent.createChooser(sendIntentStr, null)
                        context.startActivity(shareIntent)
                    }) {
                        Icon(Icons.Default.Share, "Paylaş")
                    }
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.MoreVert, "Daha Fazla")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            // Reply input
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shadowElevation = 8.dp
            ) {
                if (uiState.currentUser == null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Button(
                            onClick = { navController.navigate(Screen.Login.route) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(24.dp)
                        ) {
                            Text("Yanıt yazmak için giriş yapın")
                        }
                    }
                } else {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = replyText,
                            onValueChange = { replyText = it },
                            placeholder = { Text(labels?.writeReply ?: "Yanıt yaz...") },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(24.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = MaterialTheme.colorScheme.primary,
                                unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)
                            ),
                            singleLine = true
                        )
                        
                        IconButton(
                            onClick = {
                                if (replyText.isNotBlank()) {
                                    viewModel.createReply(
                                        threadId = threadId,
                                        content = replyText,
                                        onSuccess = {
                                            replyText = ""
                                            android.widget.Toast.makeText(context, "Yanıt gönderildi", android.widget.Toast.LENGTH_SHORT).show()
                                        }
                                    )
                                }
                            },
                            enabled = replyText.isNotBlank() && !uiState.isLoading
                        ) {
                            if (uiState.isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(24.dp),
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(
                                    Icons.Default.Send,
                                    "Gönder",
                                    tint = if (replyText.isNotBlank()) 
                                        MaterialTheme.colorScheme.primary 
                                    else 
                                        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                                )
                            }
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        if (thread == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Thread content
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp)
                        ) {
                            // Author info
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                UserAvatarApi(
                                    user = thread.author,
                                    size = 48.dp,
                                    showOnlineStatus = true
                                )
                                
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Text(
                                            text = thread.author?.username ?: "Anonim",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                        thread.author?.badge?.let { badge ->
                                            Surface(
                                                shape = RoundedCornerShape(6.dp),
                                                color = MaterialTheme.colorScheme.primary
                                            ) {
                                                Text(
                                                    text = badge,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = MaterialTheme.colorScheme.onPrimary,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }
                                    }
                                    Text(
                                        text = formatTime(thread.createdAt),
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                                
                                // Category chip
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = parseColor(thread.category.color).copy(alpha = 0.15f)
                                ) {
                                    Text(
                                        text = thread.category.name,
                                        style = MaterialTheme.typography.labelMedium,
                                        color = parseColor(thread.category.color),
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                    )
                                }
                            }
                            
                            Spacer(modifier = Modifier.height(16.dp))
                            
                            // Title
                            Text(
                                text = thread.title,
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold
                            )
                            
                            Spacer(modifier = Modifier.height(12.dp))
                            
                            // Content
                            Text(
                                text = thread.content,
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                            )
                            
                            Spacer(modifier = Modifier.height(16.dp))
                            
                            // Stats and actions
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            Icons.Outlined.RemoveRedEye,
                                            null,
                                            modifier = Modifier.size(18.dp),
                                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                        )
                                        Text(
                                            "${thread.viewCount} ${labels?.views ?: "görüntülenme"}",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                        )
                                    }
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            Icons.Outlined.ChatBubbleOutline,
                                            null,
                                            modifier = Modifier.size(18.dp),
                                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                        )
                                        Text(
                                            "${thread.replyCount} ${labels?.replies ?: "yanıt"}",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                        )
                                    }
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            Icons.Outlined.FavoriteBorder,
                                            null,
                                            modifier = Modifier.size(18.dp),
                                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                                        )
                                        Text(
                                            "${thread.likeCount} ${labels?.likes ?: "beğeni"}",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                        )
                                    }
                                }
                                
                                IconButton(
                                    onClick = {
                                        if (uiState.currentUser == null) {
                                            android.widget.Toast.makeText(context, "Beğenmek için giriş yapmalısınız", android.widget.Toast.LENGTH_SHORT).show()
                                            return@IconButton
                                        }
                                        isLiked = !isLiked
                                        viewModel.likeThread(thread._id)
                                    }
                                ) {
                                   Icon(
                                       if (isLiked) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                                       "Beğen",
                                       tint = if (isLiked) Color.Red else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                   )
                                }
                            }
                        }
                    }
                }
                
                // Replies header
                if (replies.isNotEmpty()) {
                    item {
                        Text(
                            text = "${labels?.replies ?: "Yanıtlar"} (${replies.size})",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    items(replies) { reply ->
                        ReplyCardApi(
                            reply = reply,
                            onLike = { viewModel.likeReply(reply._id) },
                            currentUser = uiState.currentUser
                        )
                    }
                }
                
                // Bottom spacing
                item {
                    Spacer(modifier = Modifier.height(120.dp))
                }
            }
        }
    }
}

@Composable
fun ReplyCardApi(
    reply: ReplyResponse,
    onLike: () -> Unit,
    currentUser: com.example.derdine.api.UserResponse?
) {
    var isLiked by remember(reply.isLiked) { mutableStateOf(reply.isLiked) }
    val context = androidx.compose.ui.platform.LocalContext.current
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                UserAvatarApi(
                    user = reply.author,
                    size = 36.dp
                )
                
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = reply.author?.username ?: "Anonim",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = formatTime(reply.createdAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = reply.content,
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                IconButton(
                    onClick = {
                        if (currentUser == null) {
                            android.widget.Toast.makeText(context, "Beğenmek için giriş yapmalısınız", android.widget.Toast.LENGTH_SHORT).show()
                            return@IconButton
                        }
                        isLiked = !isLiked
                        onLike()
                    },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        if (isLiked) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                        "Beğen",
                        tint = if (isLiked) Color.Red else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        modifier = Modifier.size(18.dp)
                    )
                }
                Text(
                    text = reply.likeCount.toString(),
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
    }
}

private fun formatTime(isoDate: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        inputFormat.timeZone = TimeZone.getTimeZone("UTC")
        val date = inputFormat.parse(isoDate) ?: return isoDate
        
        val now = System.currentTimeMillis()
        val diff = now - date.time
        
        when {
            diff < 60000 -> "Az önce"
            diff < 3600000 -> "${diff / 60000} dakika önce"
            diff < 86400000 -> "${diff / 3600000} saat önce"
            diff < 604800000 -> "${diff / 86400000} gün önce"
            else -> {
                val outputFormat = SimpleDateFormat("dd MMM", Locale("tr"))
                outputFormat.format(date)
            }
        }
    } catch (e: Exception) {
        isoDate
    }
}

private fun parseColor(hexColor: String): Color {
    return try {
        Color(android.graphics.Color.parseColor(hexColor))
    } catch (e: Exception) {
        Color.Gray
    }
}
