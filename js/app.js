document.addEventListener("DOMContentLoaded", () => {

const productsGrid = document.querySelector(".products-grid");

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

        // =========================================
        // ROTACIÓN DE IMÁGENES EN INDEX
        // =========================================

        const categorias = [
            "impresion-3d",
            "corte-laser",
            "grabado-laser",
            "algo-mas"
        ];

        // Solo ejecutar en la página principal
        if (document.querySelector(".services-grid")) {

            categorias.forEach(categoria => {

                const productosCategoria = productos.filter(producto =>
                    normalizarTexto(producto.categoria) === categoria &&
                    producto.imagen
                );

                const tarjeta = document.querySelector(
                    `.service-card a[href*="categoria=${categoria}"]`
                );

                if (!tarjeta || productosCategoria.length === 0) {
                    return;
                }

                const contenedor = tarjeta.closest(".service-card")
                    .querySelector(".service-image");

                const imagen = document.createElement("img");

                imagen.className = "service-carousel-image";
                imagen.alt = `Productos de ${categoria}`;

                contenedor.appendChild(imagen);

                // Mantener el texto original de la categoría
                const texto = contenedor.querySelector("span");

                let indice = 0;

                function cambiarImagen() {

                    const siguiente = productosCategoria[indice];

                    const nuevaImagen = new Image();

                    nuevaImagen.onload = () => {

                        imagen.classList.remove("visible");

                        setTimeout(() => {

                            imagen.src = nuevaImagen.src;
                            imagen.classList.add("visible");

                        }, 250);

                    };

                    nuevaImagen.onerror = () => {
                        console.warn(
                            "No se pudo cargar la imagen:",
                            siguiente.imagen
                        );
                    };

                    nuevaImagen.src = siguiente.imagen;

                    indice = (indice + 1) % productosCategoria.length;
                }

                // Mostrar la primera imagen
                cambiarImagen();

                // Cambiar cada 5 segundos
                if (productosCategoria.length > 1) {
                    setInterval(cambiarImagen, 5000);
                }

            });

        }

        // =========================================
        // CATÁLOGO DE PRODUCTOS
        // =========================================

        if (!productsGrid) {
            return;
        }

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
            categoryTitle.textContent = categoriaSeleccionada.toUpperCase();
        }

        if (categoriaSeleccionada && categoryTag) {
            categoryTag.textContent = "CATÁLOGO";
        }

        productsGrid.innerHTML = "";

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

            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>

                <div class="product-info">

                    <div class="product-bottom">

                        <button type="button">
                            Ver →
                        </button>

                    </div>

                </div>

            `;

            card.querySelector("button").addEventListener("click", () => {

                const productoId = normalizarTexto(producto.nombre);

                window.location.href = `producto.html?producto=${productoId}`;

            });

            productsGrid.appendChild(card);

        });

    })

    .catch(error => {

        console.error("Error al cargar los productos:", error);

        if (productsGrid) {
            productsGrid.innerHTML = `
                <p>
                    No fue posible cargar los productos.
                </p>
            `;
        }

    });

});