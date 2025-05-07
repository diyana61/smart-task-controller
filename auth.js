document.addEventListener('DOMContentLoaded', function() {
    // Login form validation and submission
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Basic validation
            if (!email || !password) {
                errorMessage.textContent = 'Please fill in all fields';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.display = 'block';
                return;
            }
            
            // Prepare form data
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('remember', document.getElementById('remember')?.checked || false);
            
            // Send login request
            fetch('php/login.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to dashboard on successful login
                    window.location.href = 'dashboard.html';
                } else {
                    // Display error message
                    errorMessage.textContent = data.message || 'Invalid email or password';
                    errorMessage.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            });
        });
    }
    
    // Signup form validation and submission
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            const errorMessage = document.getElementById('error-message');
            
            const fullnameError = document.getElementById('fullname-error');
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            const confirmPasswordError = document.getElementById('confirm-password-error');
            const termsError = document.getElementById('terms-error');
            
            // Reset error messages
            [fullnameError, emailError, passwordError, confirmPasswordError, termsError].forEach(el => {
                if (el) el.style.display = 'none';
            });
            errorMessage.style.display = 'none';
            
            let hasError = false;
            
            // Full name validation
            if (!fullname) {
                fullnameError.textContent = 'Please enter your full name';
                fullnameError.style.display = 'block';
                hasError = true;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                emailError.textContent = 'Please enter your email';
                emailError.style.display = 'block';
                hasError = true;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                hasError = true;
            }
            
            // Password validation
            if (!password) {
                passwordError.textContent = 'Please enter a password';
                passwordError.style.display = 'block';
                hasError = true;
            } else if (password.length < 8) {
                passwordError.textContent = 'Password must be at least 8 characters long';
                passwordError.style.display = 'block';
                hasError = true;
            }
            
            // Confirm password validation
            if (!confirmPassword) {
                confirmPasswordError.textContent = 'Please confirm your password';
                confirmPasswordError.style.display = 'block';
                hasError = true;
            } else if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordError.style.display = 'block';
                hasError = true;
            }
            
            // Terms validation
            if (!terms) {
                termsError.textContent = 'You must agree to the Terms of Service';
                termsError.style.display = 'block';
                hasError = true;
            }
            
            if (hasError) {
                return;
            }
            
            // Prepare form data
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('password', password);
            
            // Send signup request
            fetch('php/signup.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to dashboard on successful signup
                    window.location.href = 'dashboard.html';
                } else {
                    // Display error message
                    if (data.field && data.message) {
                        const fieldError = document.getElementById(`${data.field}-error`);
                        if (fieldError) {
                            fieldError.textContent = data.message;
                            fieldError.style.display = 'block';
                        } else {
                            errorMessage.textContent = data.message;
                            errorMessage.style.display = 'block';
                        }
                    } else {
                        errorMessage.textContent = data.message || 'Registration failed. Please try again.';
                        errorMessage.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            });
        });
    }

    // Check if user is already logged in
    function checkLoginStatus() {
        fetch('php/check_login.php')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    // If already logged in and on login/signup page, redirect to dashboard
                    if (window.location.pathname.endsWith('login.html') || 
                        window.location.pathname.endsWith('signup.html')) {
                        window.location.href = 'dashboard.html';
                    }
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }
    
    // Call login status check
    checkLoginStatus();
});