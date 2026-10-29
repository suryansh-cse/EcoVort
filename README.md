# EcoVort

A static website for browsing EcoVort's sustainable everyday products. The site uses plain HTML, CSS, and JavaScript; no package installation or build step is required.

## Run locally

### VS Code Live Server

1. Open this folder in VS Code.
2. Open `index.html`.
3. Select **Go Live** in the status bar. The workspace config uses port `5501`.

Open `http://127.0.0.1:5501/` for the home page, or visit:

- `http://127.0.0.1:5501/product.html` — shop
- `http://127.0.0.1:5501/about.html` — About Us

### Python fallback

If Live Server is unavailable, open a terminal in this folder and run:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/`. Press **Ctrl+C** in the terminal to stop the server.

## HTML and JavaScript selector reference

Use the existing classes and IDs below when selecting or updating page elements. Class names start with `.` in CSS/JavaScript selectors; IDs start with `#`. For example:

```js
const shop = document.querySelector("#product-search");
const products = document.querySelectorAll(".product-card");
```

### HTML tags used

These are the HTML element tags currently used across the three pages:

`a`, `article`, `body`, `br`, `button`, `div`, `footer`, `form`, `h1`, `h2`, `h3`, `head`, `header`, `html`, `img`, `input`, `label`, `link`, `main`, `meta`, `nav`, `p`, `script`, `section`, `span`, `title`

Useful structures: each page has a `header` and `nav`; the home and shop pages also use `main`; content groups use `section` and product entries use `article`. The About page's current content sections are direct children of `body`.

### Classes by page

**`index.html` — home**

`brand`, `brand-leaf`, `button`, `button-outline`, `button-primary`, `cart-link`, `text-link`, `product-card`, `about-art`, `about-content`, `about-copy`, `container`, `copyright`, `eyebrow`, `footer-brand`, `footer-content`, `footer-nav`, `header-content`, `hero`, `hero-content`, `hero-copy`, `hero-description`, `hero-image`, `hero-image-wrap`, `hero-note`, `image-caption`, `main-nav`, `note-icon`, `price`, `product-grid`, `product-image-wrap`, `product-info`, `product-label`, `product-title-row`, `products-section`, `section-heading`, `section-padding`, `site-footer`, `site-header`, `about-leaf`, `about-leaf-one`, `about-leaf-two`, `about-pot`, `about-stem`, `about-sun`, `caption-mark`

**`about.html` — About Us**

`brand`, `brand-leaf`, `button`, `button-light`, `cart-link`, `footer-logo`, `about-illustration`, `about-text`, `container`, `copyright`, `eyebrow`, `feature-card`, `features`, `header-content`, `main-nav`, `section-description`, `site-header`, `vision-icon`, `big-leaf`, `footer`, `about-hero`, `about-section`, `cta-section`, `mission-section`, `vision-section`

**`product.html` — shop**

`brand`, `brand-leaf`, `button`, `button-outline`, `button-primary`, `cart-link`, `scroll-button`, `product-card`, `category-controls`, `category-heading`, `container`, `copyright`, `eyebrow`, `footer-brand`, `footer-content`, `header-content`, `main-nav`, `product-image-wrap`, `product-info`, `product-label`, `product-rail`, `product-title-row`, `price`, `shop-empty`, `shop-heading`, `shop-search`, `site-footer`, `site-header`, `visually-hidden`, `category-section`, `shop-section`, `footer-nav`

### IDs by page

| Page | IDs | Purpose |
|---|---|---|
| `index.html` | `home`, `products`, `about`, `contact` | Section/anchor navigation |
| `about.html` | None | Use classes or semantic elements for page content |
| `product.html` | `products`, `product-search`, `product-query`, `bags-heading`, `care-heading`, `cleaning-heading`, `kitchen-heading`, `no-products`, `contact` | Shop section, search form/input, category headings, empty-search message, footer |

`products` and `contact` occur on more than one page, so scope selectors to the current document or use a page-specific ancestor.

### Shop script hooks

The shop JavaScript in `product.html` uses:

- `#product-search` and `#product-query` for the search form and input.
- `#no-products` for the empty-results message.
- `section[data-category]` for each category section.
- `.product-card` for product entries. Each card's `data-category` value is included in search matching.
- `.product-rail` for the horizontally scrolling products in a category.
- `[data-scroll="-1"]` and `[data-scroll="1"]` on the left/right buttons for each rail.

Example markup for an additional category rail:

```html
<section class="category-section" data-category aria-labelledby="garden-heading">
    <h2 id="garden-heading">Garden</h2>
    <button class="scroll-button" type="button" data-scroll="-1" aria-label="Scroll Garden left">←</button>
    <div class="product-rail" role="region" aria-label="Garden products">
        <article class="product-card" data-category="garden">...</article>
    </div>
    <button class="scroll-button" type="button" data-scroll="1" aria-label="Scroll Garden right">→</button>
</section>
```
