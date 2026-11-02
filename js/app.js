document.addEventListener("DOMContentLoaded", () => {

    const productsGrid = document.querySelector(".products-grid");

    if (!productsGrid) {
        return;
    }

    fetch("productos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar productos.json");
            }

            return response.json();
        })

        .then(productos => {

            productsGrid.innerHTML = "";

            productos.forEach(producto => {

                const card = document.createElement("article");

                card.className = "product-card";

                card.innerHTML = `
                    <div class="product-image">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>

                    <div class="product-info">

                        <span class="product-category">
                            ${producto.categoria}
                        </span>

                        <h3>
                            ${producto.nombre}
                        </h3>

                        <div class="product-bottom">

                            <strong>
                                $${producto.precio.toFixed(2)}
                            </strong>

                            <button>
                                Ver →
                            </button>

                        </div>

                    </div>
                `;

                productsGrid.appendChild(card);
            });
        })

        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });

});