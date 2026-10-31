// ======================================
// ECOVORT - AUTHENTICATION PROTOTYPE
// ======================================

const USERS_KEY = "ecovort-demo-users";
const SESSION_KEY = "ecovort-user-session";

// Get registered demo users
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
        console.error("Could not read demo users:", error);
        return [];
    }
}

// Save registered demo users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Create a session for the selected user
function createSession(user, rememberMe = false) {
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
    };

    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(userSession));
}

// Read the currently signed-in user
function getCurrentUser() {
    const session =
        localStorage.getItem(SESSION_KEY) ||
        sessionStorage.getItem(SESSION_KEY);

    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch (error) {
        return null;
    }
}

// Update the session after profile edits
function updateCurrentSession(user) {
    const rememberMe = localStorage.getItem(SESSION_KEY) !== null;
    createSession(user, rememberMe);
}

// Log out without deleting the saved profile
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}

// Display a form message
function showMessage(element, message, success = false) {
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("success", success);
}

// ======================================
// SIGNUP
// ======================================

const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email")
            .value.trim().toLowerCase();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const message = document.getElementById("signup-message");

        if (password.length < 8) {
            showMessage(message, "Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Your passwords do not match.");
            return;
        }

        const users = getUsers();
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            showMessage(message, "An account with this email already exists.");
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            avatar: ""
        };

        users.push(newUser);
        saveUsers(users);
        createSession(newUser);

        showMessage(message, "Account created! Redirecting...", true);

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });
}

// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("login-email")
            .value.trim().toLowerCase();
        const password = document.getElementById("login-password").value;
        const rememberMe = document.getElementById("remember-me").checked;
        const message = document.getElementById("login-message");

        if (!password.trim()) {
            showMessage(message, "Please enter your password.");
            return;
        }

        const user = getUsers().find(account => account.email === email);

        if (!user) {
            showMessage(message, "No demo account found. Please sign up first.");
            return;
        }

        // Prototype only: this does not verify the password.
        createSession(user, rememberMe);

        showMessage(message, "Welcome back! Redirecting...", true);

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });
}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

document.querySelectorAll("[data-toggle-password]").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(button.dataset.togglePassword);
        if (!input) return;

        const showPassword = input.type === "password";
        input.type = showPassword ? "text" : "password";
        button.textContent = showPassword ? "Hide" : "Show";
    });
});

// ======================================
// FORGOT PASSWORD PROTOTYPE MESSAGE
// ======================================

const forgotPassword = document.getElementById("forgot-password");

if (forgotPassword) {
    forgotPassword.addEventListener("click", function (event) {
        event.preventDefault();

        showMessage(
            document.getElementById("login-message"),
            "Password recovery will be available after backend integration."
        );
    });
}