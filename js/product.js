        const searchForm = document.querySelector("#product-search");
        const searchInput = document.querySelector("#product-query");
        const categories = [...document.querySelectorAll("section[data-category]")];
        const productRails = [...document.querySelectorAll(".product-rail")];
        const noProductsMessage = document.querySelector("#no-products");

        function updateScrollControls(rail) {
            const category = rail.closest(".category-section");
            const previousButton = category.querySelector('[data-scroll="-1"]');
            const nextButton = category.querySelector('[data-scroll="1"]');
            const canScroll = rail.scrollWidth > rail.clientWidth + 1;

            previousButton.disabled = !canScroll || rail.scrollLeft <= 8;
            nextButton.disabled = !canScroll || rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
        }

        function filterProducts(query) {
            let visibleProducts = 0;
            const normalizedQuery = query.trim().toLowerCase();

            for (const category of categories) {
                let categoryProductCount = 0;

                for (const card of category.querySelectorAll(".product-card")) {
                    const searchableText = `${card.textContent} ${card.dataset.category}`.toLowerCase();
                    const matches = searchableText.includes(normalizedQuery);
                    card.hidden = !matches;
                    categoryProductCount += Number(matches);
                }

                category.hidden = categoryProductCount === 0;
                visibleProducts += categoryProductCount;

                const rail = category.querySelector(".product-rail");
                rail.scrollLeft = 0;
                updateScrollControls(rail);
            }

            noProductsMessage.hidden = visibleProducts > 0;
        }

        for (const rail of productRails) {
            rail.addEventListener("scroll", () => updateScrollControls(rail));
            rail.closest(".category-section").querySelectorAll("[data-scroll]").forEach(button => {
                button.addEventListener("click", () => {
                    const direction = Number(button.dataset.scroll);
                    const card = rail.querySelector(".product-card:not([hidden])");
                    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
                    const distance = card ? card.getBoundingClientRect().width + gap : rail.clientWidth;
                    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
                });
            });
        }

        searchInput.value = new URLSearchParams(window.location.search).get("q") || "";
        filterProducts(searchInput.value);
        searchInput.addEventListener("input", () => filterProducts(searchInput.value));
        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            filterProducts(searchInput.value);
        });
        window.addEventListener("resize", () => productRails.forEach(updateScrollControls));