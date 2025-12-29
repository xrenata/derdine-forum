package com.example.derdinesokayim.auth

import android.content.Context
import android.content.SharedPreferences

object SettingsManager {
    private const val PREFS_NAME = "settings_prefs"
    private const val KEY_DARK_MODE = "dark_mode"
    private const val KEY_NOTIFICATIONS = "notifications"

    private var prefs: SharedPreferences? = null

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    var isDarkMode: Boolean
        get() = prefs?.getBoolean(KEY_DARK_MODE, true) ?: true
        set(value) = prefs?.edit()?.putBoolean(KEY_DARK_MODE, value)?.apply()!!

    var areNotificationsEnabled: Boolean
        get() = prefs?.getBoolean(KEY_NOTIFICATIONS, true) ?: true
        set(value) = prefs?.edit()?.putBoolean(KEY_NOTIFICATIONS, value)?.apply()!!
}
