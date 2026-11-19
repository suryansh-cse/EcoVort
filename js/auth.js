
// ======================================
// ECOVORT - AUTHENTICATION SYSTEM
// Frontend demonstration only
// ======================================

const USERS_KEY = "ecovort-demo-users";
const SESSION_KEY = "ecovort-user-session";

// ======================================
// STORAGE FUNCTIONS
// ======================================

function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USERS_KEY)
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("Could not load users:", error);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}

// ======================================
// SESSION MANAGEMENT
// ======================================

function createSession(user, rememberMe = false) {
    const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
    };

    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    const storage = rememberMe
        ? localStorage
        : sessionStorage;

    storage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}

function getCurrentUser() {
    const session =
        localStorage.getItem(SESSION_KEY) ||
        sessionStorage.getItem(SESSION_KEY);

    if (!session) return null;

    try {
        return JSON.parse(session);
    } catch (error) {
        console.error("Invalid session:", error);
        return null;
    }
}

function updateCurrentSession(user) {
    const rememberMe =
        localStorage.getItem(SESSION_KEY) !== null;

    createSession(user, rememberMe);
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";
}

// ======================================
// MESSAGE HANDLING
// ======================================

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

        const name = document
            .getElementById("signup-name")
            .value.trim();

        const email = document
            .getElementById("signup-email")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("signup-password")
            .value;

        const confirmPassword = document
            .getElementById("confirm-password")
            .value;

        const message = document.getElementById("signup-message");

        if (!name || !email || !password || !confirmPassword) {
            showMessage(message, "Please complete all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage(message, "Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            showMessage(message, "Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage(message, "Passwords do not match.");
            return;
        }

        const users = getUsers();

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            showMessage(message, "This email is already registered.");
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            avatar: "",
            phone: "",
            addresses: [],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        saveUsers(users);
        createSession(newUser);

        showMessage(
            message,
            "Account created successfully! Redirecting...",
            true
        );

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

        const email = document
            .getElementById("login-email")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("login-password")
            .value;

        const rememberMe = document
            .getElementById("remember-me")?.checked || false;

        const message = document.getElementById("login-message");

        if (!email || !password) {
            showMessage(message, "Please enter your email and password.");
            return;
        }

        const user = getUsers().find(
            account => account.email === email
        );

        if (!user) {
            showMessage(message, "No account found. Please sign up first.");
            return;
        }

        if (user.password !== password) {
            showMessage(message, "Incorrect password.");
            return;
        }

        createSession(user, rememberMe);

        showMessage(
            message,
            "Login successful! Redirecting...",
            true
        );

        setTimeout(() => {
            window.location.href = "profile.html";
        }, 700);
    });
}

// ======================================
// UPDATE USER PROFILE
// ======================================

function updateUserProfile(updatedData) {
    const currentUser = getCurrentUser();

    if (!currentUser) return false;

    const users = getUsers();

    const userIndex = users.findIndex(
        user => user.id === currentUser.id
    );

    if (userIndex === -1) return false;

    users[userIndex] = {
        ...users[userIndex],
        ...updatedData,
        id: users[userIndex].id,
        email: users[userIndex].email
    };

    saveUsers(users);
    updateCurrentSession(users[userIndex]);

    return true;
}

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

document.querySelectorAll("[data-toggle-password]").forEach(button => {
    button.addEventListener("click", function () {
        const input = document.getElementById(
            button.dataset.togglePassword
        );

        if (!input) return;

        const visible = input.type === "password";

        input.type = visible ? "text" : "password";
        button.textContent = visible ? "Hide" : "Show";
    });
});

// ======================================
// FORGOT PASSWORD
// ======================================

const forgotPassword = document.getElementById("forgot-password");

if (forgotPassword) {
    forgotPassword.addEventListener("click", function (event) {
        event.preventDefault();

        showMessage(
            document.getElementById("login-message"),
            "Password recovery requires backend integration."
        );
    });
}

// ======================================
// DYNAMIC ACCOUNT NAVIGATION
// ======================================

document.querySelectorAll("[data-account-link]").forEach(link => {
    const user = getCurrentUser();

    if (user) {
        link.href = "profile.html";

        const label = link.querySelector("[data-account-label]");

        if (label) {
            label.textContent = "My account";
        }
    } else {
        link.href = "login.html";

        const label = link.querySelector("[data-account-label]");

        if (label) {
            label.textContent = "Sign in";
        }
    }
});

console.log("EcoVort authentication system loaded.");
