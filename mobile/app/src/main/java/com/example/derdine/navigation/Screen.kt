package com.example.derdine.navigation

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Home : Screen("home")
    object Categories : Screen("categories")
    object ThreadDetail : Screen("thread/{threadId}") {
        fun createRoute(threadId: String) = "thread/$threadId"
    }
    object CreateThread : Screen("create_thread")
    object Profile : Screen("profile")
    object Search : Screen("search")
    object Settings : Screen("settings")
}
