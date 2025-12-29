package com.example.derdinesokayim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.clickable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.derdinesokayim.api.ForumViewModel
import com.example.derdinesokayim.api.UserResponse
import com.example.derdinesokayim.ui.components.ForumCardApi
import com.example.derdinesokayim.ui.components.UserAvatarApi
import com.example.derdinesokayim.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    navController: NavController,
    viewModel: ForumViewModel,
    modifier: Modifier = Modifier
) {
    val uiState = viewModel.uiState
    val labels = uiState.labels?.profile
    
    // Get logged in user from ViewModel
    // Get logged in user from ViewModel
    val currentUser = uiState.currentUser
    
    // Load user profile data when user is logged in
    LaunchedEffect(currentUser?._id) {
        currentUser?._id?.let { userId ->
            viewModel.loadUserProfile(userId)
        }
    }
    
    // Use specific lists for profile
    val userThreads = uiState.profileThreads
    val userReplies = uiState.profileReplies
    
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf(
        labels?.threads ?: "Konular",
        labels?.replies ?: "Cevaplar",
        "Rozetler"
    )
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(labels?.title ?: "Profil") },
                actions = {
                    IconButton(onClick = { navController.navigate(Screen.Settings.route) }) {
                        Icon(Icons.Default.Settings, "Ayarlar")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { paddingValues ->
        if (currentUser == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Column(
                     horizontalAlignment = Alignment.CenterHorizontally,
                     verticalArrangement = Arrangement.Center,
                     modifier = Modifier.padding(32.dp)
                ) {
                    Icon(
                        Icons.Default.AccountCircle,
                        null,
                        modifier = Modifier.size(80.dp),
                        tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Profilinizi Görmek İçin Giriş Yapın",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Konularınızı, cevaplarınızı ve rozetlerinizi görmek için giriş yapmalısınız.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    Button(
                        onClick = {
                            // Navigate to login screen
                            // We need to ensure we can navigate to login. 
                            // Since we are not passing a specific callback for "goToLogin", 
                            // we navigate to the Login route.
                            navController.navigate(Screen.Login.route)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Giriş Yap / Kayıt Ol")
                    }
                }
            }
        } else {
            LazyColumn(
                modifier = modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Profile header with gradient
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(
                                brush = Brush.verticalGradient(
                                    colors = listOf(
                                        MaterialTheme.colorScheme.primary,
                                        MaterialTheme.colorScheme.primaryContainer
                                    )
                                )
                            )
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            UserAvatarApi(
                                user = currentUser,
                                size = 80.dp,
                                showOnlineStatus = true
                            )
                            
                            Spacer(modifier = Modifier.height(12.dp))
                            
                            Text(
                                text = currentUser.username,
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                            
                            currentUser.badge?.let { badge ->
                                Spacer(modifier = Modifier.height(4.dp))
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.2f)
                                ) {
                                    Text(
                                        text = badge,
                                        style = MaterialTheme.typography.labelMedium,
                                        color = MaterialTheme.colorScheme.onPrimary,
                                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }
                
                // Stats cards
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatCard(
                            title = labels?.threads ?: "Konular",
                            value = currentUser.threadCount.toString(),
                            icon = Icons.Default.Article,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = labels?.replies ?: "Cevaplar",
                            value = currentUser.replyCount.toString(),
                            icon = Icons.Default.ChatBubble,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = labels?.reputation ?: "İtibar",
                            value = currentUser.reputation.toString(),
                            icon = Icons.Default.Star,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
                
                // Tabs
                item {
                    TabRow(
                        selectedTabIndex = selectedTab,
                        modifier = Modifier.padding(horizontal = 16.dp),
                        containerColor = MaterialTheme.colorScheme.surface,
                        indicator = { tabPositions ->
                            TabRowDefaults.Indicator(
                                modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    ) {
                        tabs.forEachIndexed { index, title ->
                            Tab(
                                selected = selectedTab == index,
                                onClick = { selectedTab = index },
                                text = {
                                    Text(
                                        text = title,
                                        fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                }
                
                // Tab content
                when (selectedTab) {
                    0 -> {
                        // User threads
                        if (userThreads.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "Henüz konu yok",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                            }
                        } else {
                            items(userThreads) { thread ->
                                ForumCardApi(
                                    thread = thread,
                                    onClick = {
                                        navController.navigate(Screen.ThreadDetail.createRoute(thread._id))
                                    },
                                    onLike = { viewModel.likeThread(thread._id) },
                                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                    1 -> {
                        if (userReplies.isEmpty()) {
                            item {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(32.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "Henüz cevap yok",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                            }
                        } else {
                            items(userReplies) { reply ->
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 6.dp)
                                        .clickable {
                                            navController.navigate(Screen.ThreadDetail.createRoute(reply.thread))
                                        },
                                    colors = CardDefaults.cardColors(
                                        containerColor = MaterialTheme.colorScheme.surface
                                    ),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                                ) {
                                    Column(
                                        modifier = Modifier.padding(16.dp)
                                    ) {
                                        Text(
                                            text = reply.content,
                                            style = MaterialTheme.typography.bodyMedium,
                                            color = MaterialTheme.colorScheme.onSurface,
                                            maxLines = 3,
                                            overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(
                                                Icons.Default.Favorite,
                                                null,
                                                modifier = Modifier.size(14.dp),
                                                tint = Color.Red.copy(alpha = 0.6f)
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(
                                                text = "${reply.likeCount}",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                    2 -> {
                        item {
                            BadgesSection()
                        }
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
fun StatCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}

@Composable
fun BadgesSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = "Kazanılan Rozetler",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 12.dp)
        )
        
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(3) { index ->
                BadgeCard(
                    title = when (index) {
                        0 -> "Aktif Üye"
                        1 -> "İlk Konu"
                        else -> "Yardımsever"
                    },
                    description = when (index) {
                        0 -> "100+ cevap yazdı"
                        1 -> "İlk konusunu oluşturdu"
                        else -> "50+ yardımcı cevap"
                    }
                )
            }
        }
    }
}

@Composable
fun BadgeCard(
    title: String,
    description: String
) {
    Card(
        modifier = Modifier
            .width(140.dp)
            .height(160.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.EmojiEvents,
                contentDescription = title,
                tint = MaterialTheme.colorScheme.secondary,
                modifier = Modifier.size(48.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSecondaryContainer
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
            )
        }
    }
}
