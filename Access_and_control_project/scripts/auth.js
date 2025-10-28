/**
 * Cruz Technologies Access & Control System - Authentication Module
 * Handles user login and password recovery functionality
 */

// DOM Elements
const loginForm = document.getElementById('loginForm');
const forgotPassword = document.getElementById('forgotPassword');
const recoveryModal = document.getElementById('recoveryModal');
const closeModal = document.querySelector('.close-modal');
const recoveryForm = document.getElementById('recoveryForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if there are saved credentials
    const savedUsername = localStorage.getItem('ctacs_username');
    const savedPassword = localStorage.getItem('ctacs_password');
    
    if (savedUsername && savedPassword) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;
        document.getElementById('remember').checked = true;
    }
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    loginBtn.disabled = true;
    
    try {
        // API Call to authenticate user
        const response = await authenticateUser(username, password);
        
        if (response.success) {
            // Save credentials if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem('ctacs_username', username);
                localStorage.setItem('ctacs_password', password);
            } else {
                localStorage.removeItem('ctacs_username');
                localStorage.removeItem('ctacs_password');
            }
            
            // Redirect to main dashboard
            window.location.href = 'main.html';
        } else {
            showError('Invalid credentials. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
        console.error('Login error:', error);
    } finally {
        loginBtn.innerHTML = 'Login <i class="fas fa-sign-in-alt"></i>';
        loginBtn.disabled = false;
    }
});

// Password Recovery
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    recoveryModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    recoveryModal.style.display = 'none';
});

recoveryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value;
    
    try {
        // API Call to send recovery email
        const response = await sendRecoveryEmail(email);
        
        if (response.success) {
            alert('Password reset link has been sent to your email.');
            recoveryModal.style.display = 'none';
        } else {
            showError(response.message || 'Failed to send recovery email.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
        console.error('Recovery error:', error);
    }
});

/**
 * Authenticates user with backend API
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object>} Response from server
 */
async function authenticateUser(username, password) {
    // This would be replaced with actual API call
    // Example API structure:
    /*
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    return await response.json();
    */
    
    // Mock response for frontend development
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, token: 'mock-token-12345' });
        }, 1000);
    });
}

/**
 * Sends password recovery email
 * @param {string} email 
 * @returns {Promise<object>} Response from server
 */
async function sendRecoveryEmail(email) {
    // This would be replaced with actual API call
    // Example:
    /*
    const response = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });
    
    return await response.json();
    */
    
    // Mock response
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'Recovery email sent' });
        }, 1000);
    });
}

/**
 * Displays error message to user
 * @param {string} message 
 */
function showError(message) {
    // In a real app, you'd have a more sophisticated error display
    alert(message);
}