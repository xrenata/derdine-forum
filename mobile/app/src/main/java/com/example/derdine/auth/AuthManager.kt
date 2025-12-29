package com.example.derdine.auth

import android.content.Context
import android.content.SharedPreferences
import com.example.derdine.api.UserResponse
import com.google.gson.Gson

object AuthManager {
    private const val PREFS_NAME = "auth_prefs"
    private const val KEY_USER = "user"
    private const val KEY_IS_LOGGED_IN = "is_logged_in"

    private var prefs: SharedPreferences? = null
    private val gson = Gson()

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun saveUser(user: UserResponse) {
        prefs?.edit()?.apply {
            putString(KEY_USER, gson.toJson(user))
            putBoolean(KEY_IS_LOGGED_IN, true)
            apply()
        }
    }

    fun getUser(): UserResponse? {
        val userJson = prefs?.getString(KEY_USER, null)
        return if (userJson != null) {
            try {
                gson.fromJson(userJson, UserResponse::class.java)
            } catch (e: Exception) {
                null
            }
        } else {
            null
        }
    }

    fun isLoggedIn(): Boolean {
        return prefs?.getBoolean(KEY_IS_LOGGED_IN, false) ?: false
    }

    fun logout() {
        prefs?.edit()?.apply {
            remove(KEY_USER)
            putBoolean(KEY_IS_LOGGED_IN, false)
            apply()
        }
    }
}
