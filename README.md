# EcoVort

EcoVort is a static product catalogue for reusable everyday essentials. It is built with plain HTML, CSS, and JavaScript; there is no package installation or build step.

## Run locally

Open `index.html` with VS Code Live Server, or start Python's local server from the project folder:

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000/`.

## Pages

- `index.html` — homepage and featured products
- `product.html` — searchable catalogue with horizontally scrollable product categories
- `about.html` — what the catalogue covers

The garden photography is served by Unsplash; the category illustrations are local SVG assets. The shop supports text search and category scrolling; it does not have a cart or checkout.

## Styles and assets

- `css/style.css` — shared layout, typography, colors, and homepage styles
- `css/product.css` — catalogue layout and search/rail controls
- `css/about.css` — About page layouts
- `assets/ecovort-logo.svg` — EcoVort mark
