# Derdine Forum - Android Application

A native Android forum application built with Kotlin and Jetpack Compose, featuring Material Design 3 aesthetics.

## Tech Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Design System**: Material Design 3 (Material You)
- **HTTP Client**: Retrofit 2
- **JSON Parsing**: Gson
- **Architecture**: MVVM (Model-View-ViewModel)
- **Navigation**: Jetpack Navigation Compose
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 35

## Project Structure

```
app/src/main/java/com/example/derdine/
├── MainActivity.kt          # Main activity with navigation host
├── api/
│   ├── ForumApi.kt          # Retrofit API interface and data models
│   ├── ForumRepository.kt   # Repository layer for API calls
│   └── ForumViewModel.kt    # ViewModel for state management
├── auth/
│   ├── AuthManager.kt       # Authentication state management
│   └── SettingsManager.kt   # User preferences (dark mode, notifications)
├── data/
│   └── model/               # Local data models (Thread, User, Category, Reply)
├── navigation/
│   └── Screen.kt            # Navigation route definitions
└── ui/
    ├── components/          # Reusable UI components
    │   ├── ForumCard.kt         # Thread card for local data
    │   ├── ForumCardApi.kt      # Thread card for API data
    │   ├── CategoryCard.kt      # Category display card
    │   ├── ReplyCard.kt         # Reply display component
    │   └── UserAvatar.kt        # User avatar component
    ├── screens/             # Application screens
    │   ├── HomeScreen.kt        # Main feed screen
    │   ├── CategoriesScreen.kt  # Categories listing
    │   ├── ProfileScreen.kt     # User profile
    │   ├── SettingsScreen.kt    # App settings
    │   ├── LoginScreen.kt       # Authentication screen
    │   ├── SearchScreen.kt      # Thread search
    │   ├── ThreadDetailScreen.kt # Thread view with replies
    │   └── CreateThreadScreen.kt # New thread creation
    └── theme/               # Theme configuration
        ├── Color.kt             # Color definitions
        ├── Theme.kt             # Theme setup
        └── Type.kt              # Typography
```

## Features

### Core Features
- View and browse forum threads
- Category-based thread filtering
- Thread detail view with replies
- Like/unlike threads and replies
- Create new threads and replies
- User authentication (login/logout)
- User profile management

### UI Features
- Material Design 3 theming
- Dynamic color support (Material You)
- Dark mode support
- Animated bottom navigation bar
- Pull-to-refresh
- Loading states and error handling

## Setup

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK 35

### Configuration

1. Open the `mobile` folder in Android Studio

2. Configure the API base URL in `api/ForumApi.kt`:
```kotlin
object ApiConfig {
    // For Android Emulator
    const val BASE_URL = "http://10.0.2.2:3001/"
    
    // For Physical Device (use your computer's IP)
    // const val BASE_URL = "http://192.168.1.x:3001/"
}
```

3. Sync Gradle files

4. Run on emulator or physical device

### Network Configuration

The app requires the backend server to be running. For emulator testing:
- `10.0.2.2` maps to the host machine's localhost
- Ensure backend is running on port 3001

For physical device testing:
- Use your computer's local IP address
- Ensure both devices are on the same network
- Backend should allow connections from external IPs

## API Integration

### Data Models

| Model | Description |
|-------|-------------|
| `ThreadResponse` | Thread data with author, category, likes |
| `ReplyResponse` | Reply with author and like status |
| `CategoryResponse` | Category with icon and color |
| `UserResponse` | User profile with badge and reputation |
| `ThemeResponse` | Dynamic theme colors |
| `LabelsResponse` | UI text labels |

### Endpoints Used

- `GET /api/threads` - Fetch threads list
- `GET /api/threads/:id` - Fetch single thread
- `POST /api/threads` - Create new thread
- `POST /api/threads/:id/like` - Toggle like
- `GET /api/replies` - Fetch replies
- `POST /api/replies` - Create reply
- `POST /api/replies/:id/like` - Toggle reply like
- `GET /api/categories` - Fetch categories
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile
- `GET /api/theme` - Get theme colors
- `GET /api/labels` - Get UI labels

## State Management

The app uses a single `ForumViewModel` for state management:

```kotlin
data class ForumUiState(
    val isLoading: Boolean = false,
    val error: String? = null,
    val theme: ThemeResponse? = null,
    val labels: LabelsResponse? = null,
    val categories: List<CategoryResponse> = emptyList(),
    val threads: List<ThreadResponse> = emptyList(),
    val currentThread: ThreadResponse? = null,
    val replies: List<ReplyResponse> = emptyList(),
    val currentUser: UserResponse? = null
)
```

## Authentication

Authentication is managed through `AuthManager`:
- Session persistence using SharedPreferences
- Automatic session restoration on app launch
- Session verification against backend

## Build

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

APK output: `app/build/outputs/apk/`

## Dependencies

```kotlin
// Compose BOM
implementation(platform("androidx.compose:compose-bom:2024.02.00"))

// Retrofit
implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.squareup.retrofit2:converter-gson:2.9.0")
implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

// Navigation
implementation("androidx.navigation:navigation-compose:2.7.7")

// Material 3
implementation("androidx.compose.material3:material3")
```

## License

This project is for educational purposes.
