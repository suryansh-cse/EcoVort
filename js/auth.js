
// ======================================
// ECOVORT - AUTHENTICATION PROTOTYPE
// ======================================


// 1. STORAGE KEYS

const USERS_KEY = "ecovort-demo-users";
const SESSION_KEY = "ecovort-user-session";


// 2. GET REGISTERED DEMO USERS

function getUsers() {

    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
        console.error("Could not read demo users:", error);
        return [];
    }

}


// 3. SAVE DEMO USERS

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


// 4. CREATE USER SESSION

function createSession(user, rememberMe = false) {

    const userSession = {
        name: user.name,
        email: user.email
    };

    // Remove previous session
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    // Remember me determines session duration
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(
        SESSION_KEY,
        JSON.stringify(userSession)
    );

}


// 5. GET CURRENT LOGGED-IN USER

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


// 6. LOG OUT

function logoutUser() {

    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";

}


// 7. DISPLAY FORM MESSAGES

function showMessage(element, message, success = false) {

    if (!element) return;

    element.textContent = message;

    element.classList.toggle("success", success);

}


// 8. SIGNUP FUNCTIONALITY

const signupForm = document.getElementById("signup-form");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("signup-name")
            .value.trim();

        const email = document.getElementById("signup-email")
            .value.trim().toLowerCase();

        const password = document.getElementById("signup-password")
            .value;

        const confirmPassword = document.getElementById("confirm-password")
            .value;

        const message = document.getElementById("signup-message");

        // Check password length
        if (password.length < 8) {

            showMessage(
                message,
                "Password must contain at least 8 characters."
            );

            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {

            showMessage(
                message,
                "Your passwords do not match."
            );

            return;
        }

        // Get existing demo users
        const users = getUsers();

        // Check duplicate email
        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {

            showMessage(
                message,
                "An account with this email already exists."
            );

            return;
        }

        // Create demo profile
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email
        };

        users.push(newUser);

        saveUsers(users);

        // Automatically log in after signup
        createSession(newUser);

        showMessage(
            message,
            "Account created! Redirecting...",
            true
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    });

}


// 9. LOGIN FUNCTIONALITY

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("login-email")
            .value.trim().toLowerCase();

        const password = document.getElementById("login-password")
            .value;

        const rememberMe = document.getElementById("remember-me")
            .checked;

        const message = document.getElementById("login-message");

        // Check empty password
        if (!password.trim()) {

            showMessage(
                message,
                "Please enter your password."
            );

            return;
        }

        // Find registered demo user
        const users = getUsers();

        const user = users.find(
            account => account.email === email
        );

        if (!user) {

            showMessage(
                message,
                "No demo account found. Please sign up first."
            );

            return;
        }

        // Prototype login: password is not verified
        createSession(user, rememberMe);

        showMessage(
            message,
            "Welcome back! Redirecting...",
            true
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    });

}


// 10. SHOW / HIDE PASSWORD

document.querySelectorAll("[data-toggle-password]").forEach(button => {

    button.addEventListener("click", function() {

        const inputId = button.dataset.togglePassword;

        const passwordInput = document.getElementById(inputId);

        if (!passwordInput) return;

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        button.textContent = isPassword ? "Hide" : "Show";

    });

});


// 11. FORGOT PASSWORD PROTOTYPE MESSAGE

const forgotPassword = document.getElementById("forgot-password");

if (forgotPassword) {

    forgotPassword.addEventListener("click", function(event) {

        event.preventDefault();

        const message = document.getElementById("login-message");

        showMessage(
            message,
            "Password recovery will be available when authentication is connected to a backend."
        );

    });

}
