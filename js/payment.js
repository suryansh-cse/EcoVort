
// ======================================
// ECOVORT - PAYMENT METHOD
// ======================================

const PAYMENT_KEY = "ecovort-payment-selection";
const PENDING_ORDER_KEY = "ecovort-pending-order";

const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.href = "login.html";
}

// ======================================
// GET CART
// ======================================

const paymentCart = getCart();

const paymentItems = document.getElementById("payment-items");
const subtotalElement = document.getElementById("payment-subtotal");
const totalElement = document.getElementById("payment-total");

const paymentForm = document.getElementById("payment-form");
const paymentMessage = document.getElementById("payment-message");

// ======================================
// FORMAT PRICE
// ======================================

function formatPaymentPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

// ======================================
// CALCULATE TOTAL
// ======================================

function getPaymentTotal() {
    return paymentCart.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;

        return total + price * quantity;
    }, 0);
}

// ======================================
// GET SAVED DELIVERY ADDRESS
// ======================================

function getDeliveryAddress() {
    const savedAddresses = JSON.parse(
        localStorage.getItem("ecovort-addresses") || "{}"
    );

    const address =
        savedAddresses[currentUser.id] ||
        savedAddresses[currentUser.email];

    if (address) {
        return address;
    }

    const checkoutAddress = JSON.parse(
        localStorage.getItem("ecovort-checkout-address") || "null"
    );

    if (
        checkoutAddress &&
        String(checkoutAddress.customerId) === String(currentUser.id)
    ) {
        return checkoutAddress.address || null;
    }

    return null;
}

// ======================================
// DISPLAY ORDER ITEMS
// ======================================

function renderPaymentItems() {
    if (!Array.isArray(paymentCart) || paymentCart.length === 0) {
        paymentItems.textContent = "Your cart is empty.";

        const submitButton = paymentForm.querySelector(
            "button[type='submit']"
        );

        if (submitButton) {
            submitButton.disabled = true;
        }

        return;
    }

    paymentItems.innerHTML = "";

    paymentCart.forEach(item => {
        const row = document.createElement("div");
        row.className = "payment-item";

        const name = document.createElement("span");
        name.className = "payment-item-name";
        name.textContent = `${item.name} × ${item.quantity}`;

        const price = document.createElement("span");
        price.className = "payment-item-price";

        price.textContent = formatPaymentPrice(
            Number(item.price) * Number(item.quantity)
        );

        row.append(name, price);
        paymentItems.appendChild(row);
    });

    const total = getPaymentTotal();

    subtotalElement.textContent = formatPaymentPrice(total);
    totalElement.textContent = formatPaymentPrice(total);
}

// ======================================
// SAVE PAYMENT AND CREATE ORDER
// ======================================

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedMethod = document.querySelector(
        'input[name="payment-method"]:checked'
    );

    if (!selectedMethod) {
        showMessage(
            paymentMessage,
            "Please select a payment method."
        );
        return;
    }

    if (!Array.isArray(paymentCart) || paymentCart.length === 0) {
        showMessage(
            paymentMessage,
            "Your cart is empty."
        );
        return;
    }

    // Get delivery address
    const savedAddress = getDeliveryAddress();

    if (!savedAddress) {
        showMessage(
            paymentMessage,
            "Delivery address not found. Please go back to checkout."
        );
        console.error("EcoVort: No delivery address found.");
        return;
    }

    // Create payment selection
    const paymentData = {
        customerId: currentUser.id,
        method: selectedMethod.value,
        amount: getPaymentTotal(),
        selectedAt: new Date().toISOString()
    };

    // Create pending order
    const pendingOrder = {
        id: "EV-" + Date.now(),

        customerId: currentUser.id,
        customerName: currentUser.name,

        items: paymentCart.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || "",
            category: item.category || ""
        })),

        address: savedAddress,

        paymentMethod: selectedMethod.value,

        total: getPaymentTotal(),

        createdAt: new Date().toISOString(),

        status: "Order placed"
    };

    try {
        // Save payment selection
        localStorage.setItem(
            PAYMENT_KEY,
            JSON.stringify(paymentData)
        );

        // Save pending order
        localStorage.setItem(
            PENDING_ORDER_KEY,
            JSON.stringify(pendingOrder)
        );

        // Verify that order was saved
        const savedOrder = JSON.parse(
            localStorage.getItem(PENDING_ORDER_KEY)
        );

        if (!savedOrder || savedOrder.id !== pendingOrder.id) {
            throw new Error("Pending order could not be verified.");
        }

        console.log("EcoVort payment selection:", paymentData);
        console.log("EcoVort pending order:", savedOrder);

        // Redirect to confirmation page
        window.location.href = "order-confirmation.html";

    } catch (error) {
        console.error("EcoVort order creation failed:", error);

        showMessage(
            paymentMessage,
            "Something went wrong. Please try again."
        );
    }
});

// ======================================
// INITIALIZE PAYMENT PAGE
// ======================================

renderPaymentItems();

console.log("EcoVort payment page loaded.");
