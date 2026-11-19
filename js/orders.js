
// ======================================
// ECOVORT - MY ORDERS
// ======================================

const ORDERS_KEY = "ecovort-orders";

const user = getCurrentUser();

if (!user) {
    window.location.href = "login.html";
}

// ======================================
// FORMAT PRICE
// ======================================

function formatOrderPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}

// ======================================
// GET CUSTOMER ORDERS
// ======================================

function getCustomerOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_KEY) || "[]"
        );

        if (!Array.isArray(orders)) return [];

        return orders.filter(
            order => order.customerId === user.id
        );

    } catch (error) {
        console.error("Could not load orders:", error);
        return [];
    }
}

// ======================================
// RENDER ORDER HISTORY
// ======================================

function renderOrders() {
    const orders = getCustomerOrders();

    const ordersList = document.getElementById("orders-list");
    const emptyMessage = document.getElementById("orders-empty");
    const count = document.getElementById("orders-count");

    ordersList.replaceChildren();

    count.textContent =
        `${orders.length} ${orders.length === 1 ? "order" : "orders"}`;

    if (orders.length === 0) {
        emptyMessage.hidden = false;
        return;
    }

    emptyMessage.hidden = true;

    const paymentMethods = {
        upi: "UPI",
        card: "Credit / Debit Card",
        netbanking: "Net Banking",
        cod: "Cash on Delivery"
    };

    orders.forEach(order => {
        const card = document.createElement("article");
        card.className = "order-history-card";

        // Header

        const header = document.createElement("div");
        header.className = "order-history-header";

        const info = document.createElement("div");

        const id = document.createElement("strong");
        id.textContent = order.id;

        const date = document.createElement("small");
        date.textContent = new Date(order.createdAt).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

        info.append(id, date);

        const status = document.createElement("span");
        status.className = "order-status";
        status.textContent = order.status || "Order placed";

        header.append(info, status);

        // Products

        const products = document.createElement("div");
        products.className = "order-history-products";

        (order.items || []).forEach(item => {
            const row = document.createElement("div");
            row.className = "order-history-product";

            const name = document.createElement("span");
            name.textContent = `${item.name} × ${item.quantity}`;

            const price = document.createElement("strong");
            price.textContent = formatOrderPrice(
                Number(item.price) * Number(item.quantity)
            );

            row.append(name, price);
            products.appendChild(row);
        });

        // Footer

        const footer = document.createElement("div");
        footer.className = "order-history-footer";

        const payment = document.createElement("span");

        payment.textContent =
            paymentMethods[order.paymentMethod] ||
            order.paymentMethod;

        const total = document.createElement("strong");
        total.textContent = formatOrderPrice(order.total);

        footer.append(payment, total);

        card.append(header, products, footer);

        ordersList.appendChild(card);
    });
}

// ======================================
// INITIALIZE
// ======================================

renderOrders();

console.log("EcoVort order history loaded:", getCustomerOrders());
