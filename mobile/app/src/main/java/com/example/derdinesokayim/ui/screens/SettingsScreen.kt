package com.example.derdinesokayim.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.derdinesokayim.api.ForumViewModel
import com.example.derdinesokayim.auth.AuthManager
import com.example.derdinesokayim.navigation.Screen

data class SettingItem(
    val icon: ImageVector,
    val title: String,
    val subtitle: String? = null,
    val isSwitch: Boolean = false,
    val switchState: Boolean = false,
    val onClick: (() -> Unit)? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    navController: NavController,
    viewModel: ForumViewModel,
    modifier: Modifier = Modifier
) {
    val uiState = viewModel.uiState
    val labels = uiState.labels?.settings
    
    val context = androidx.compose.ui.platform.LocalContext.current

    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showChangePasswordDialog by remember { mutableStateOf(false) }

    if (showEditProfileDialog) {
        EditProfileDialog(
            currentAvatarUrl = uiState.currentUser?.avatarUrl,
            onDismiss = { showEditProfileDialog = false },
            onSubmit = { newAvatarUrl ->
                viewModel.updateUser(
                    avatarUrl = newAvatarUrl,
                    onSuccess = {
                        showEditProfileDialog = false
                        android.widget.Toast.makeText(context, "Profil güncellendi", android.widget.Toast.LENGTH_SHORT).show()
                    },
                    onError = { error ->
                        android.widget.Toast.makeText(context, error, android.widget.Toast.LENGTH_SHORT).show()
                    }
                )
            }
        )
    }

    if (showChangePasswordDialog) {
        ChangePasswordDialog(
            onDismiss = { showChangePasswordDialog = false },
            onSubmit = { current, new ->
                viewModel.changePassword(
                    current = current,
                    new = new,
                    onSuccess = {
                        showChangePasswordDialog = false
                        android.widget.Toast.makeText(context, "Şifre değiştirildi", android.widget.Toast.LENGTH_SHORT).show()
                    },
                    onError = { error ->
                        android.widget.Toast.makeText(context, error, android.widget.Toast.LENGTH_SHORT).show()
                    }
                )
            }
        )
    }

    val appSettings = listOf(
        SettingItem(
            icon = Icons.Default.DarkMode,
            title = labels?.darkMode ?: "Karanlık Mod",
            subtitle = "Koyu tema kullan",
            isSwitch = true,
            switchState = viewModel.isDarkMode,
            onClick = { viewModel.toggleDarkMode() }
        ),
        SettingItem(
            icon = Icons.Default.Notifications,
            title = labels?.notifications ?: "Bildirimler",
            subtitle = "Push bildirimleri",
            isSwitch = true,
            switchState = viewModel.areNotificationsEnabled,
            onClick = { viewModel.toggleNotifications() }
        ),
        SettingItem(
            icon = Icons.Default.Language,
            title = labels?.language ?: "Dil",
            subtitle = "Türkçe",
            onClick = {
                 android.widget.Toast.makeText(context, "Çoklu dil desteği yakında eklenecek!", android.widget.Toast.LENGTH_SHORT).show()
            }
        )
    )
    
    val accountSettings = listOf(
        SettingItem(
            icon = Icons.Default.Person,
            title = "Profili Düzenle",
            subtitle = "Kullanıcı adı, avatar",
            onClick = {
                showEditProfileDialog = true
            }
        ),
        SettingItem(
            icon = Icons.Default.Lock,
            title = "Şifre Değiştir",
            subtitle = "Hesap güvenliği",
            onClick = {
                showChangePasswordDialog = true
            }
        ),
        SettingItem(
            icon = Icons.Default.Email,
            title = "E-posta",
            subtitle = "E-posta ayarları",
            onClick = {
                android.widget.Toast.makeText(context, "E-posta ayarları yakında eklenecek!", android.widget.Toast.LENGTH_SHORT).show()
            }
        )
    )
    
    val aboutSettings = listOf(
        SettingItem(
            icon = Icons.Default.Info,
            title = "Hakkında",
            subtitle = "Versiyon 1.0.0",
             onClick = {
                android.widget.Toast.makeText(context, "Derdine Forum v1.0.0", android.widget.Toast.LENGTH_SHORT).show()
            }
        ),
        SettingItem(
            icon = Icons.Default.Policy,
            title = "Gizlilik Politikası",
             onClick = {
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("http://localhost:3000/privacy"))
                context.startActivity(intent)
            }
        ),
        SettingItem(
            icon = Icons.Default.Description,
            title = "Kullanım Koşulları",
             onClick = {
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("http://localhost:3000/terms"))
                context.startActivity(intent)
            }
        )
    )
    
    Scaffold(
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.08f),
                                MaterialTheme.colorScheme.background
                            )
                        )
                    )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    IconButton(
                        onClick = { navController.navigateUp() },
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Icon(
                            Icons.Default.ArrowBack,
                            "Geri",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    
                    Text(
                        text = labels?.title ?: "Ayarlar",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // App Settings
            item {
                Text(
                    text = "Uygulama",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column {
                        appSettings.forEachIndexed { index, setting ->
                            SettingItemCard(
                                setting = setting,
                                onSwitchChange = {
                                    setting.onClick?.invoke()
                                }
                            )
                            if (index < appSettings.size - 1) {
                                HorizontalDivider(
                                    modifier = Modifier.padding(horizontal = 16.dp),
                                    color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)
                                )
                            }
                        }
                    }
                }
            }
            
            // Account Settings - Only show if logged in
            if (uiState.currentUser != null) {
                item {
                    Text(
                        text = "Hesap",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                    
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surface
                        )
                    ) {
                        Column {
                            accountSettings.forEachIndexed { index, setting ->
                                SettingItemCard(setting = setting)
                                if (index < accountSettings.size - 1) {
                                    HorizontalDivider(
                                        modifier = Modifier.padding(horizontal = 16.dp),
                                        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)
                                    )
                                }
                            }
                        }
                    }
                }
            }
            
            // About
            item {
                Text(
                    text = "Hakkında",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Column {
                        aboutSettings.forEachIndexed { index, setting ->
                            SettingItemCard(setting = setting)
                            if (index < aboutSettings.size - 1) {
                                HorizontalDivider(
                                    modifier = Modifier.padding(horizontal = 16.dp),
                                    color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)
                                )
                            }
                        }
                    }
                }
            }
            
            // Logout / Login
            item {
                Button(
                    onClick = {
                        if (uiState.currentUser != null) {
                            // Clear auth state
                            AuthManager.logout()
                            viewModel.logout()
                            // Navigate to login
                            navController.navigate(Screen.Login.route) {
                                popUpTo(0) { inclusive = true }
                            }
                        } else {
                            // Navigate to login
                            navController.navigate(Screen.Login.route)
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (uiState.currentUser != null) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(if (uiState.currentUser != null) Icons.Default.Logout else Icons.Default.Login, null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(if (uiState.currentUser != null) (labels?.logout ?: "Çıkış Yap") else "Giriş Yap")
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(120.dp))
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileDialog(
    currentAvatarUrl: String?,
    onDismiss: () -> Unit,
    onSubmit: (String) -> Unit
) {
    var avatarUrl by remember { mutableStateOf(currentAvatarUrl ?: "") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                "Profili Düzenle",
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        },
        text = {
            Column {
                OutlinedTextField(
                    value = avatarUrl,
                    onValueChange = { avatarUrl = it },
                    label = { Text("Avatar URL") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                if (avatarUrl.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Önizleme:", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    // Simple basic AsyncImage placeholder - assuming Coil is not set up, user can see URL
                    Text(avatarUrl, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onSubmit(avatarUrl) },
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Kaydet")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("İptal")
            }
        },
        containerColor = MaterialTheme.colorScheme.surface,
        textContentColor = MaterialTheme.colorScheme.onSurface
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangePasswordDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, String) -> Unit
) {
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                "Şifre Değiştir",
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
        },
        text = {
            Column {
                if (error != null) {
                    Text(
                        text = error!!,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }
                OutlinedTextField(
                    value = currentPassword,
                    onValueChange = { currentPassword = it },
                    label = { Text("Mevcut Şifre") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = newPassword,
                    onValueChange = { newPassword = it },
                    label = { Text("Yeni Şifre") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it },
                    label = { Text("Yeni Şifre (Tekrar)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (newPassword.length < 6) {
                        error = "Şifre en az 6 karakter olmalı"
                    } else if (newPassword != confirmPassword) {
                        error = "Şifreler eşleşmiyor"
                    } else {
                        onSubmit(currentPassword, newPassword)
                    }
                },
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Değiştir")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("İptal")
            }
        },
        containerColor = MaterialTheme.colorScheme.surface,
        textContentColor = MaterialTheme.colorScheme.onSurface
    )
}

@Composable
fun SettingItemCard(
    setting: SettingItem,
    onSwitchChange: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = !setting.isSwitch) { setting.onClick?.invoke() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = setting.icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = setting.title,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
            setting.subtitle?.let {
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
        
        if (setting.isSwitch) {
            Switch(
                checked = setting.switchState,
                onCheckedChange = { onSwitchChange?.invoke() },
                colors = SwitchDefaults.colors(
                    checkedThumbColor = MaterialTheme.colorScheme.primary,
                    checkedTrackColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        } else {
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
            )
        }
    }
}
