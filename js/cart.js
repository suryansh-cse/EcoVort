
// ======================================
// ECOVORT - SHOPPING CART SYSTEM
// ======================================

const CART_KEY = "ecovort-cart";


// 1. GET CART FROM LOCAL STORAGE

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        console.error("Could not read cart:", error);
        return [];
    }
}


// 2. SAVE CART TO LOCAL STORAGE

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


// 3. FORMAT PRICE IN USD

function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price);
}


// 4. UPDATE CART COUNT IN HEADER

function updateCartCount() {

    const cart = getCart();

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.querySelectorAll("[data-cart-count]").forEach(element => {
        element.textContent = totalItems;
    });
}


// 5. ADD PRODUCT TO CART

function addToCart(productCard) {

    const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: Number(productCard.dataset.price),
        image: productCard.querySelector("img").getAttribute("src"),
        category: productCard.dataset.category,
        quantity: 1
    };

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    updateCartCount();

    console.log("Cart updated:", cart);
}


// 6. CHANGE PRODUCT QUANTITY

function updateQuantity(productId, change) {

    const cart = getCart();

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;

    product.quantity += change;

    // Remove product if quantity becomes zero
    const updatedCart = cart.filter(
        item => item.quantity > 0
    );

    saveCart(updatedCart);

    renderCart();
    updateCartCount();
}


// 7. REMOVE PRODUCT FROM CART

function removeFromCart(productId) {

    const cart = getCart();

    const updatedCart = cart.filter(
        item => item.id !== productId
    );

    saveCart(updatedCart);

    renderCart();
    updateCartCount();
}


// 8. CALCULATE SUBTOTAL

function calculateTotal(cart) {

    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}


// 9. SAFELY DISPLAY TEXT IN HTML

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// 10. DISPLAY CART PRODUCTS

function renderCart() {

    const cartList = document.getElementById("cart-items-list");

    // This function only renders on the cart page
    if (!cartList) return;

    const cart = getCart();

    const emptyMessage = document.getElementById("cart-empty");
    const cartLabels = document.getElementById("cart-labels");
    const cartBottom = document.getElementById("cart-bottom");

    const checkoutButton = document.getElementById("checkout-button");

    // Handle empty cart
    if (cart.length === 0) {

        cartList.innerHTML = "";

        emptyMessage.hidden = false;
        cartLabels.hidden = true;
        cartBottom.hidden = true;

        checkoutButton.disabled = true;

    } else {

        emptyMessage.hidden = true;
        cartLabels.hidden = false;
        cartBottom.hidden = false;

        checkoutButton.disabled = false;

        // Generate product HTML
        cartList.innerHTML = cart.map(item => {

            const categoryNames = {
                bags: "BAGS & ON THE GO",
                care: "BATH & BODY",
                cleaning: "HOME CLEANING",
                kitchen: "KITCHEN & DINING"
            };

            const category =
                categoryNames[item.category] || item.category;

            const safeId = escapeHTML(item.id);
            const safeName = escapeHTML(item.name);
            const safeCategory = escapeHTML(category);
            const safeImage = escapeHTML(item.image);

            const itemTotal = item.price * item.quantity;

            return `
                <article class="cart-item">

                    <div class="product-info">

                        <div class="product-image">
                            <img
                                src="${safeImage}"
                                alt="${safeName}"
                            >
                        </div>

                        <div class="product-details">

                            <p class="product-category">
                                ${safeCategory}
                            </p>

                            <h3>${safeName}</h3>

                            <p class="product-price">
                                ${formatPrice(item.price)}
                            </p>

                            <button
                                type="button"
                                class="remove-item"
                                data-remove-from-cart="${safeId}">
                                Remove
                            </button>

                        </div>

                    </div>

                    <div class="quantity-control">

                        <button
                            type="button"
                            data-quantity-change="-1"
                            data-product-id="${safeId}"
                            aria-label="Decrease quantity">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-quantity-change="1"
                            data-product-id="${safeId}"
                            aria-label="Increase quantity">
                            +
                        </button>

                    </div>

                    <p class="item-total">
                        ${formatPrice(itemTotal)}
                    </p>

                </article>
            `;

        }).join("");

    }

    // Update order summary
    const subtotal = calculateTotal(cart);

    document.getElementById("cart-subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("cart-discount").textContent =
        "− " + formatPrice(0);

    document.getElementById("cart-total").textContent =
        formatPrice(subtotal);

    // Shipping will be calculated at checkout
    document.getElementById("cart-shipping").textContent =
        "Calculated at checkout";
}


// 11. HANDLE ALL CART BUTTON CLICKS

document.addEventListener("click", function(event) {

    // Add to Cart button
    const addButton = event.target.closest("[data-add-to-cart]");

    if (addButton) {

        const productCard = addButton.closest(".product-card");

        if (!productCard) return;

        addToCart(productCard);

        const originalText = addButton.textContent;

        addButton.textContent = "Added ✓";
        addButton.disabled = true;

        setTimeout(() => {
            addButton.textContent = originalText;
            addButton.disabled = false;
        }, 1000);

        return;
    }

    // Quantity buttons
    const quantityButton = event.target.closest(
        "[data-quantity-change]"
    );

    if (quantityButton) {

        const productId = quantityButton.dataset.productId;
        const change = Number(quantityButton.dataset.quantityChange);

        updateQuantity(productId, change);

        return;
    }

    // Remove buttons
    const removeButton = event.target.closest(
        "[data-remove-from-cart]"
    );

    if (removeButton) {

        const productId = removeButton.dataset.removeFromCart;

        removeFromCart(productId);
    }

});


// 12. INITIALIZE CART WHEN PAGE LOADS

updateCartCount();
renderCart();

