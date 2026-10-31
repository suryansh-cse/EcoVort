// ======================================
// ECOVORT - PROFILE PAGE
// ======================================

const profileForm = document.getElementById("profile-form");

if (profileForm) {
    const currentUser = getCurrentUser();

    // Require the user to be signed in
    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        const nameInput = document.getElementById("profile-name");
        const emailInput = document.getElementById("profile-email");
        const avatarInput = document.getElementById("profile-avatar-url");
        const avatar = document.getElementById("profile-avatar");
        const message = document.getElementById("profile-message");

        // Fill the form with saved profile data
        nameInput.value = currentUser.name || "";
        emailInput.value = currentUser.email || "";
        avatarInput.value = currentUser.avatar || "";

        renderAvatar(currentUser.avatar, currentUser.name);

        function renderAvatar(imageUrl, name) {
            avatar.replaceChildren();

            if (imageUrl) {
                const image = document.createElement("img");
                image.src = imageUrl;
                image.alt = "Profile photo";
                image.onerror = () => renderAvatar("", name);
                avatar.appendChild(image);
                return;
            }

            const initials = document.createElement("span");
            initials.textContent = getInitials(name);
            avatar.appendChild(initials);
        }

        function getInitials(name) {
            return (name || "EcoVort")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part.charAt(0).toUpperCase())
                .join("");
        }

        avatarInput.addEventListener("input", () => {
            renderAvatar(avatarInput.value.trim(), nameInput.value);
        });

        nameInput.addEventListener("input", () => {
            if (!avatarInput.value.trim()) {
                renderAvatar("", nameInput.value);
            }
        });

        // Save profile changes
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim().toLowerCase();
            const avatarUrl = avatarInput.value.trim();

            if (!name || !email) {
                showMessage(message, "Please enter your name and email.");
                return;
            }

            const users = getUsers();

            const emailAlreadyUsed = users.some(user =>
                user.email === email && user.id !== currentUser.id
            );

            if (emailAlreadyUsed) {
                showMessage(message, "That email is already used by another account.");
                return;
            }

            const updatedUser = {
                ...currentUser,
                name,
                email,
                avatar: avatarUrl
            };

            const updatedUsers = users.map(user =>
                user.id === currentUser.id ? updatedUser : user
            );

            saveUsers(updatedUsers);
            updateCurrentSession(updatedUser);

            showMessage(message, "Profile saved successfully.", true);
            renderAvatar(avatarUrl, name);
        });
    }
}

// Log out button
const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
}