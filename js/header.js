
/* =====================================
   ECOVORT - HEADER ACCOUNT
===================================== */

const accountLink = document.querySelector("[data-account-link]");
const accountLabel = document.querySelector("[data-account-label]");

if (accountLink && accountLabel) {

    const currentUser = getCurrentUser();

    if (currentUser) {

        // User is logged in
        accountLink.href = "profile.html";
        accountLabel.textContent = "My Account";

        accountLink.setAttribute(
            "aria-label",
            "Go to your account"
        );

    } else {

        // User is logged out
        accountLink.href = "login.html";
        accountLabel.textContent = "Sign in";

        accountLink.setAttribute(
            "aria-label",
            "Sign in to your account"
        );
    }
}
