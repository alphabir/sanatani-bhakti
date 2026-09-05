package com.sanatanibhakti.app

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.google.firebase.auth.FirebaseAuthInvalidUserException
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.FirebaseAuthWeakPasswordException
import com.google.firebase.auth.FirebaseUser
import com.sanatanibhakti.app.data.AuthRepository
import com.sanatanibhakti.app.databinding.ActivityAuthBinding
import com.sanatanibhakti.app.ui.LoginUiState
import com.sanatanibhakti.app.ui.LoginViewModel
import kotlinx.coroutines.launch

class AuthActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAuthBinding
    private lateinit var auth: FirebaseAuth
    private val authRepository = AuthRepository()
    private val loginViewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize FirebaseAuth
        auth = FirebaseAuth.getInstance()

        setupClickListeners()
        observeViewModelState()
    }

    /**
     * Auth state observer in onStart.
     * Automatically redirects already signed-in users directly to MainActivity.
     */
    override fun onStart() {
        super.onStart()
        val currentUser: FirebaseUser? = authRepository.getCurrentUser()
        if (currentUser != null) {
            navigateToHome(currentUser)
        }
    }

    private fun setupClickListeners() {
        // Modern CredentialManager Google Sign-In
        binding.btnGoogleSignIn.setOnClickListener {
            loginViewModel.signInWithGoogle(this)
        }

        binding.btnSignIn.setOnClickListener {
            val email = binding.etEmail.text?.toString()?.trim() ?: ""
            val password = binding.etPassword.text?.toString()?.trim() ?: ""

            if (validateInputs(email, password)) {
                signInUser(email, password)
            }
        }

        binding.btnSignUp.setOnClickListener {
            val email = binding.etEmail.text?.toString()?.trim() ?: ""
            val password = binding.etPassword.text?.toString()?.trim() ?: ""

            if (validateInputs(email, password)) {
                signUpUser(email, password)
            }
        }

        binding.btnSkip.setOnClickListener {
            // Allow guest access directly into MainActivity
            navigateToHome(null)
        }
    }

    /**
     * Observe StateFlow from LoginViewModel for Google Sign-In UI State
     */
    private fun observeViewModelState() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                loginViewModel.uiState.collect { state ->
                    when (state) {
                        is LoginUiState.Loading -> {
                            setLoading(true)
                        }
                        is LoginUiState.Success -> {
                            setLoading(false)
                            val name = state.user.displayName ?: "साधक"
                            Toast.makeText(this@AuthActivity, "स्वागतम्, $name! 🙏", Toast.LENGTH_SHORT).show()
                            navigateToHome(state.user)
                        }
                        is LoginUiState.Error -> {
                            setLoading(false)
                            showToast(state.message)
                            loginViewModel.resetState()
                        }
                        is LoginUiState.Idle -> {
                            setLoading(false)
                        }
                    }
                }
            }
        }
    }

    /**
     * Sign-up with robust error handling (weak password, user collision, invalid email)
     */
    private fun signUpUser(email: String, password: String) {
        setLoading(true)

        auth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                setLoading(false)
                if (task.isSuccessful) {
                    val user = auth.currentUser
                    Toast.makeText(this, "साधना खाता सफल! स्वागतम् 🙏", Toast.LENGTH_SHORT).show()
                    navigateToHome(user)
                } else {
                    val exception = task.exception
                    val errorMessage = when (exception) {
                        is FirebaseAuthWeakPasswordException -> {
                            "कमजोर पासवर्ड: कृपया कम से कम 6 अक्षरों का मजबूत पासवर्ड रखें।"
                        }
                        is FirebaseAuthUserCollisionException -> {
                            "यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।"
                        }
                        is FirebaseAuthInvalidCredentialsException -> {
                            "अमान्य ईमेल प्रारूप। कृपया सही ईमेल दर्ज करें।"
                        }
                        else -> {
                            exception?.localizedMessage ?: "पंजीकरण में त्रुटि। कृपया पुनः प्रयास करें।"
                        }
                    }
                    showToast(errorMessage)
                }
            }
    }

    /**
     * Login with robust error handling (invalid credentials, non-existent user)
     */
    private fun signInUser(email: String, password: String) {
        setLoading(true)

        auth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                setLoading(false)
                if (task.isSuccessful) {
                    val user = auth.currentUser
                    Toast.makeText(this, "स्वागतम् साधक! 🙏", Toast.LENGTH_SHORT).show()
                    navigateToHome(user)
                } else {
                    val exception = task.exception
                    val errorMessage = when (exception) {
                        is FirebaseAuthInvalidUserException -> {
                            "यह खाता मौजूद नहीं है या अक्षम कर दिया गया है।"
                        }
                        is FirebaseAuthInvalidCredentialsException -> {
                            "गलत पासवर्ड या ईमेल। कृपया पुनः जांचें।"
                        }
                        else -> {
                            exception?.localizedMessage ?: "लॉगिन विफल। इंटरनेट कनेक्शन की जांच करें।"
                        }
                    }
                    showToast(errorMessage)
                }
            }
    }

    /**
     * Redirect to MainActivity and clear AuthActivity from backstack
     */
    private fun navigateToHome(user: FirebaseUser?) {
        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        startActivity(intent)
        finish()
    }

    private fun validateInputs(email: String, password: String): Boolean {
        if (email.isEmpty()) {
            binding.tilEmail.error = "कृपया ईमेल दर्ज करें"
            return false
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "कृपया एक मान्य ईमेल आईडी दर्ज करें"
            return false
        }
        binding.tilEmail.error = null

        if (password.isEmpty()) {
            binding.tilPassword.error = "कृपया पासवर्ड दर्ज करें"
            return false
        }
        if (password.length < 6) {
            binding.tilPassword.error = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए"
            return false
        }
        binding.tilPassword.error = null

        return true
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnGoogleSignIn.isEnabled = !isLoading
        binding.btnSignIn.isEnabled = !isLoading
        binding.btnSignUp.isEnabled = !isLoading
        binding.btnSkip.isEnabled = !isLoading
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}
