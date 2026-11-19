
// ======================================
// ECOVORT - CHECKOUT PAGE
// ======================================

const ADDRESS_KEY = "ecovort-addresses";


// ======================================
// GET CURRENT CUSTOMER
// ======================================

const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.href = "login.html";
}


// ======================================
// GET CART FROM EXISTING CART SYSTEM
// ======================================

const cartItems = getCart();
console.log("Cart data:", cartItems);
console.log("Is array:", Array.isArray(cartItems));
console.log("First item:", cartItems[0]);
console.log("EcoVort checkout cart:", cartItems);

// ======================================
// PRICE FORMATTING
// ======================================

function formatCheckoutPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(amount);
}


// ======================================
// CALCULATE SUBTOTAL
// ======================================

function calculateCheckoutSubtotal() {
    return cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity ?? item.qty) || 0;

        return total + (price * quantity);
    }, 0);
}


// ======================================
// DISPLAY CART ITEMS
// ======================================

function renderCheckoutItems() {
    const itemsContainer = document.getElementById("checkout-items");
    const subtotalElement = document.getElementById("checkout-subtotal");
    const totalElement = document.getElementById("checkout-total");
    const continueButton = document.getElementById("continue-payment");

    if (!itemsContainer) return;

    itemsContainer.replaceChildren();

    if (cartItems.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "checkout-empty";
        emptyMessage.textContent = "Your cart is empty. Add some products before checking out.";

        itemsContainer.appendChild(emptyMessage);

        if (continueButton) {
            continueButton.disabled = true;
        }

        if (subtotalElement) {
            subtotalElement.textContent = formatCheckoutPrice(0);
        }

        if (totalElement) {
            totalElement.textContent = formatCheckoutPrice(0);
        }

        return;
    }

    cartItems.forEach(item => {
        const name = item.name || item.title || "EcoVort product";
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity ?? item.qty) || 0;

        const itemRow = document.createElement("div");
        itemRow.className = "checkout-item";

        const details = document.createElement("div");

        const productName = document.createElement("span");
        productName.className = "checkout-item-name";
        productName.textContent = name;

        const productQuantity = document.createElement("span");
        productQuantity.className = "checkout-item-quantity";
        productQuantity.textContent = `Quantity: ${quantity}`;

        details.appendChild(productName);
        details.appendChild(productQuantity);

        const productPrice = document.createElement("span");
        productPrice.className = "checkout-item-price";
        productPrice.textContent = formatCheckoutPrice(price * quantity);

        itemRow.appendChild(details);
        itemRow.appendChild(productPrice);

        itemsContainer.appendChild(itemRow);
    });

    const subtotal = calculateCheckoutSubtotal();

    if (subtotalElement) {
        subtotalElement.textContent = formatCheckoutPrice(subtotal);
    }

    if (totalElement) {
        totalElement.textContent = formatCheckoutPrice(subtotal);
    }
}


// ======================================
// LOAD SAVED ADDRESS
// ======================================

function getSavedAddress() {
    try {
        const allAddresses =
            JSON.parse(localStorage.getItem(ADDRESS_KEY)) || {};

        const customerKey = currentUser.id || currentUser.email;

        return allAddresses[customerKey] || null;

    } catch (error) {
        console.error("Could not load saved address:", error);
        return null;
    }
}


// ======================================
// FILL ADDRESS FORM
// ======================================

function fillAddressForm(address) {
    if (!address) return;

    document.getElementById("delivery-name").value =
        address.name || currentUser.name || "";

    document.getElementById("delivery-phone").value =
        address.phone || "";

    document.getElementById("delivery-pincode").value =
        address.pincode || "";

    document.getElementById("delivery-house").value =
        address.house || "";

    document.getElementById("delivery-street").value =
        address.street || "";

    document.getElementById("delivery-landmark").value =
        address.landmark || "";

    document.getElementById("delivery-city").value =
        address.city || "";

    document.getElementById("delivery-state").value =
        address.state || "";

    document.getElementById("delivery-instructions").value =
        address.instructions || "";
}


// ======================================
// SAVE ADDRESS
// ======================================

function saveDeliveryAddress(address) {
    try {
        const allAddresses =
            JSON.parse(localStorage.getItem(ADDRESS_KEY)) || {};

        const customerKey = currentUser.id || currentUser.email;

        allAddresses[customerKey] = address;

        localStorage.setItem(
            ADDRESS_KEY,
            JSON.stringify(allAddresses)
        );

        // Keep a copy of the address for the next checkout step.
        localStorage.setItem(
            "ecovort-checkout-address",
            JSON.stringify({
                customerId: currentUser.id || currentUser.email,
                address: address
            })
        );

        return true;

    } catch (error) {
        console.error("Could not save delivery address:", error);
        return false;
    }
}


// ======================================
// ADDRESS FORM SUBMISSION
// ======================================

const addressForm = document.getElementById("checkout-address-form");

if (addressForm) {
    addressForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const message = document.getElementById("checkout-message");

        message.textContent = "";
        message.classList.remove("success");

        if (cartItems.length === 0) {
            message.textContent = "Your cart is empty. Please add products first.";
            return;
        }

        if (!addressForm.reportValidity()) {
            return;
        }

        const address = {
            name: document.getElementById("delivery-name").value.trim(),
            phone: document.getElementById("delivery-phone").value.trim(),
            pincode: document.getElementById("delivery-pincode").value.trim(),
            house: document.getElementById("delivery-house").value.trim(),
            street: document.getElementById("delivery-street").value.trim(),
            landmark: document.getElementById("delivery-landmark").value.trim(),
            city: document.getElementById("delivery-city").value.trim(),
            state: document.getElementById("delivery-state").value.trim(),
            instructions: document.getElementById("delivery-instructions").value.trim()
        };

        const saved = saveDeliveryAddress(address);

        if (!saved) {
            message.textContent =
                "We couldn't save your address. Please check your browser storage.";
            return;
        }

        message.textContent = "Address saved! Moving to payment...";
        message.classList.add("success");

        setTimeout(() => {
            window.location.href = "payment.html";
        }, 700);
    });
}


// ======================================
// INITIAL PAGE SETUP
// ======================================

if (currentUser) {
    // Pre-fill the customer's name.
    document.getElementById("delivery-name").value =
        currentUser.name || "";

    // Load the last saved delivery address.
    const savedAddress = getSavedAddress();

    if (savedAddress) {
        fillAddressForm(savedAddress);
    }

    // Display the cart summary.
    renderCheckoutItems();
}
