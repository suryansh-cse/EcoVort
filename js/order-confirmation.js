
// ======================================
// ECOVORT - ORDER CONFIRMATION
// ======================================

const ORDERS_KEY = "ecovort-orders";
const PENDING_KEY = "ecovort-pending-order";
const LAST_ORDER_KEY = "ecovort-last-order-id";


const user = getCurrentUser();

if (!user) {
    window.location.href = "login.html";
}

// ======================================
// GET ORDERS
// ======================================

function getOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Order storage error:", error);
        return [];
    }
}

// ======================================
// PRICE FORMAT
// ======================================

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}

// ======================================
// SAVE PENDING ORDER
// ======================================

function savePendingOrder() {
    const pendingOrder = JSON.parse(
        localStorage.getItem(PENDING_KEY) || "null"
    );

    if (
        !pendingOrder ||
        pendingOrder.customerId !== user.id ||
        !Array.isArray(pendingOrder.items) ||
        pendingOrder.items.length === 0
    ) {
        return null;
    }

    const orders = getOrders();

    const existingOrder = orders.find(
        order => order.id === pendingOrder.id
    );

    if (!existingOrder) {
        orders.unshift(pendingOrder);

        localStorage.setItem(
            ORDERS_KEY,
            JSON.stringify(orders)
        );
    }

    localStorage.setItem(
        LAST_ORDER_KEY,
        pendingOrder.id
    );

    localStorage.removeItem(PENDING_KEY);

    localStorage.removeItem("ecovort-payment-selection");

    localStorage.removeItem("ecovort-cart");

    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

    return pendingOrder;
}

// ======================================
// GET MOST RECENT CONFIRMED ORDER
// ======================================

function getLatestOrder() {
    const lastOrderId = localStorage.getItem(LAST_ORDER_KEY);

    return getOrders().find(order =>
        order.id === lastOrderId &&
        order.customerId === user.id
    ) || null;
}

// ======================================
// DISPLAY ORDER
// ======================================

function displayOrder(order) {
    const title = document.getElementById("confirmation-title");
    const description = document.getElementById("confirmation-description");

    if (!order) {
        title.textContent = "No order found.";

        description.textContent =
            "Please complete checkout before viewing confirmation.";

        document.getElementById("order-number").textContent = "—";

        return;
    }

    document.getElementById("order-number").textContent = order.id;

    document.getElementById("confirmed-total").textContent =
        formatPrice(order.total);

    description.textContent =
        `Thank you, ${order.customerName}. Your order has been saved.`;

    const paymentMethods = {
        upi: "UPI",
        card: "Credit / Debit Card",
        netbanking: "Net Banking",
        cod: "Cash on Delivery"
    };

    document.getElementById("confirmed-payment").textContent =
        paymentMethods[order.paymentMethod] || order.paymentMethod;

    // Products

    const itemsContainer = document.getElementById("confirmed-items");

    itemsContainer.replaceChildren();

    order.items.forEach(item => {
        const row = document.createElement("div");
        row.className = "confirmed-item";

        const name = document.createElement("span");
        name.textContent = `${item.name} × ${item.quantity}`;

        const price = document.createElement("strong");
        price.textContent = formatPrice(
            Number(item.price) * Number(item.quantity)
        );

        row.append(name, price);
        itemsContainer.appendChild(row);
    });

    // Delivery address

    const address = order.address || {};

    const addressText = [
        address.name,
        address.phone,
        address.house,
        address.street,
        address.landmark,
        address.city,
        address.state,
        address.pincode
    ].filter(Boolean).join(", ");

    document.getElementById("confirmed-address").textContent =
        addressText || "Address unavailable.";
}

// ======================================
// INITIALIZE
// ======================================

savePendingOrder();

const latestOrder = getLatestOrder();

displayOrder(latestOrder);

console.log("EcoVort order confirmation:", latestOrder);
