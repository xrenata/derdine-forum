package com.example.derdine

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Brush
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.derdine.api.ForumViewModel
import com.example.derdine.auth.AuthManager
import com.example.derdine.navigation.Screen
import com.example.derdine.ui.screens.CategoriesScreen
import com.example.derdine.ui.screens.CreateThreadScreen
import com.example.derdine.ui.screens.HomeScreen
import com.example.derdine.ui.screens.LoginScreen
import com.example.derdine.ui.screens.ProfileScreen
import com.example.derdine.ui.screens.SearchScreen
import com.example.derdine.ui.screens.SettingsScreen
import com.example.derdine.ui.screens.ThreadDetailScreen
import com.example.derdine.ui.theme.ForumTheme

data class BottomNavItem(
    val route: String,
    val icon: ImageVector,
    val label: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        AuthManager.init(applicationContext)
        com.example.derdine.auth.SettingsManager.init(applicationContext)
        
        enableEdgeToEdge()
        setContent {
            val viewModel: ForumViewModel = viewModel()
            ForumTheme(darkTheme = viewModel.isDarkMode) {
                MainScreen(viewModel)
            }
        }
    }
}

@Composable
fun MainScreen(viewModel: ForumViewModel = viewModel()) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val uiState = viewModel.uiState
    
    var isLoggedIn by remember { mutableStateOf(AuthManager.isLoggedIn()) }

    LaunchedEffect(Unit) {
        AuthManager.getUser()?.let { user ->
            viewModel.setLoggedInUser(user)
        }
    }
    
    val loginState = viewModel.loginState
    LaunchedEffect(loginState.isSuccess) {
        if (loginState.isSuccess && viewModel.uiState.currentUser != null) {
            viewModel.uiState.currentUser?.let { user ->
                AuthManager.saveUser(user)
                isLoggedIn = true
            }
        }
    }
    
    val navigationLabels = uiState.labels?.navigation
    
    val bottomNavItems = listOf(
        BottomNavItem(
            route = Screen.Home.route,
            icon = Icons.Default.Home,
            label = navigationLabels?.home ?: "Ana Sayfa"
        ),
        BottomNavItem(
            route = Screen.Categories.route,
            icon = Icons.Default.Category,
            label = navigationLabels?.categories ?: "Kategoriler"
        ),
        BottomNavItem(
            route = Screen.Profile.route,
            icon = Icons.Default.Person,
            label = navigationLabels?.profile ?: "Profil"
        ),
        BottomNavItem(
            route = Screen.Settings.route,
            icon = Icons.Default.Settings,
            label = "Ayarlar"
        )
    )
    
    val startDestination = if (isLoggedIn) Screen.Home.route else Screen.Login.route
    
    Box(modifier = Modifier.fillMaxSize()) {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = MaterialTheme.colorScheme.background,
            bottomBar = { }
        ) { paddingValues ->
            NavHost(
                navController = navController,
                startDestination = startDestination,
                modifier = Modifier.padding(paddingValues)
            ) {
                composable(Screen.Login.route) {
                    LoginScreen(
                        viewModel = viewModel,
                        onLoginSuccess = {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                    )
                }
                composable(Screen.Home.route) {
                    HomeScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.Categories.route) {
                    CategoriesScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.Profile.route) {
                    ProfileScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.ThreadDetail.route) { backStackEntry ->
                    val threadId = backStackEntry.arguments?.getString("threadId") ?: ""
                    ThreadDetailScreen(
                        threadId = threadId,
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.Search.route) {
                    SearchScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.Settings.route) {
                    SettingsScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
                composable(Screen.CreateThread.route) {
                    CreateThreadScreen(
                        navController = navController,
                        viewModel = viewModel
                    )
                }
            }
        }
        
        val showBottomNav = bottomNavItems.any { it.route == currentDestination?.route }
        AnimatedVisibility(
            visible = showBottomNav,
            enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(70.dp),
                    shape = RoundedCornerShape(35.dp),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 16.dp
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        val selectedIndex = bottomNavItems.indexOfFirst { item ->
                            currentDestination?.hierarchy?.any { it.route == item.route } == true
                        }.coerceAtLeast(0)
                        
                        val indicatorOffset by animateFloatAsState(
                            targetValue = selectedIndex.toFloat(),
                            animationSpec = spring(
                                dampingRatio = Spring.DampingRatioMediumBouncy,
                                stiffness = Spring.StiffnessMediumLow
                            ),
                            label = "indicatorOffset"
                        )
                        
                        BoxWithConstraints(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 8.dp)
                        ) {
                            val itemWidth = maxWidth / bottomNavItems.size
                            
                            Box(
                                modifier = Modifier
                                    .width(itemWidth)
                                    .fillMaxHeight()
                                    .offset(x = itemWidth * indicatorOffset)
                                    .clip(RoundedCornerShape(28.dp))
                                    .background(
                                        brush = Brush.horizontalGradient(
                                            colors = listOf(
                                                MaterialTheme.colorScheme.primary.copy(alpha = 0.9f),
                                                MaterialTheme.colorScheme.primary.copy(alpha = 0.7f)
                                            )
                                        )
                                    )
                            )
                        }
                        
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 8.dp),
                            horizontalArrangement = Arrangement.SpaceEvenly,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            bottomNavItems.forEachIndexed { index, item ->
                                val selected = currentDestination?.hierarchy?.any { it.route == item.route } == true
                                
                                val iconSize by animateDpAsState(
                                    targetValue = if (selected) 26.dp else 24.dp,
                                    animationSpec = spring(
                                        dampingRatio = Spring.DampingRatioMediumBouncy,
                                        stiffness = Spring.StiffnessMedium
                                    ),
                                    label = "iconSize"
                                )
                                
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .fillMaxHeight()
                                        .clickable(
                                            indication = null,
                                            interactionSource = remember { MutableInteractionSource() }
                                        ) {
                                            navController.navigate(item.route) {
                                                popUpTo(navController.graph.findStartDestination().id) {
                                                    saveState = true
                                                }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        }
                                        .padding(8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center
                                    ) {
                                        Icon(
                                            imageVector = item.icon,
                                            contentDescription = item.label,
                                            tint = if (selected) Color.White else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                                            modifier = Modifier.size(iconSize)
                                        )
                                        
                                        AnimatedVisibility(
                                            visible = selected,
                                            enter = fadeIn(
                                                animationSpec = tween(300, delayMillis = 100)
                                            ) + slideInVertically(
                                                animationSpec = tween(300, delayMillis = 100),
                                                initialOffsetY = { it / 2 }
                                            ),
                                            exit = fadeOut(
                                                animationSpec = tween(200)
                                            ) + slideOutVertically(
                                                animationSpec = tween(200),
                                                targetOffsetY = { it / 2 }
                                            )
                                        ) {
                                            Column(
                                                horizontalAlignment = Alignment.CenterHorizontally
                                            ) {
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Text(
                                                    text = item.label,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Color.White,
                                                    maxLines = 1
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}