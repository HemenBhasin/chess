const socket = window.socket; // Use the globally available socket

// Authentication functions
const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            document.getElementById('username-display').textContent = data.username;
            document.getElementById('user-info').style.display = 'block';
            document.getElementById('auth-modal').style.display = 'none';
            window.location.reload();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred during login');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            document.getElementById('show-login').click();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('An error occurred during registration');
    }
};

// Update UI based on auth status
function updateAuthUI(isLoggedIn, username) {
    if (isLoggedIn) {
        // Show user info and hide auth modal
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('username-display').textContent = username;
        
        // Update main sections
        document.getElementById('guest-section').style.display = 'none';
        document.getElementById('user-section').style.display = 'block';
        document.getElementById('welcome-username').textContent = username;
    } else {
        // Hide user info
        document.getElementById('user-info').style.display = 'none';
        
        // Update main sections
        document.getElementById('guest-section').style.display = 'block';
        document.getElementById('user-section').style.display = 'none';
    }
}

// Initialize authentication UI
const initAuth = () => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        updateAuthUI(true, payload.username);
    } else {
        updateAuthUI(false);
    }

    // Set up event listeners
    document.getElementById('login').addEventListener('submit', handleLogin);
    document.getElementById('show-login-modal')?.addEventListener('click', () => {
        document.getElementById('auth-modal').style.display = 'block';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    });
    document.getElementById('register').addEventListener('submit', handleRegister);
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('auth-modal').style.display = 'none';
    });
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        updateAuthUI(false);
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
