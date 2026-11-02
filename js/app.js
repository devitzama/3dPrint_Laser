document.addEventListener("DOMContentLoaded", () => {

const productsGrid = document.querySelector(".products-grid");

if (!productsGrid) {
    return;
}

// Obtener la categoría desde la URL
const params = new URLSearchParams(window.location.search);
const categoriaSeleccionada = params.get("categoria");

// Convertir texto a formato comparable
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

fetch("productos.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        return response.json();

    })

    .then(productos => {

        // Filtrar productos cuando se selecciona una categoría
        let productosMostrar = productos;

        if (categoriaSeleccionada) {

            productosMostrar = productos.filter(producto =>
                normalizarTexto(producto.categoria) ===
                normalizarTexto(categoriaSeleccionada)
            );

        }

        // Actualizar encabezado de categoría
        const categoryTitle = document.getElementById("category-title");
        const categoryTag = document.getElementById("category-tag");

        if (categoriaSeleccionada && categoryTitle) {

            categoryTitle.textContent = categoriaSeleccionada;

        }

        if (categoriaSeleccionada && categoryTag) {

            categoryTag.textContent = "CATÁLOGO";

        }

        // Limpiar productos anteriores
        productsGrid.innerHTML = "";

        // Mostrar mensaje cuando no existen productos
        if (productosMostrar.length === 0) {

            productsGrid.innerHTML = `
                <p>
                    Próximamente tendremos productos en esta categoría.
                </p>
            `;

            return;

        }

        // Crear tarjetas
        productosMostrar.forEach(producto => {

            const card = document.createElement("article");

            card.className = "product-card";

            const precio = Number(producto.precio || 0);

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

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
                            $${precio.toFixed(2)}
                        </strong>

                        <button type="button">
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

        productsGrid.innerHTML = `
            <p>
                No fue posible cargar los productos.
            </p>
        `;

    });

});
