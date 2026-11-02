document.addEventListener("DOMContentLoaded", async () => {

    const contenedor = document.getElementById("product-detail-content");

    const parametros = new URLSearchParams(window.location.search);
    const productoId = parametros.get("producto");

    if (!productoId) {
        contenedor.innerHTML = "<p>No se especificó ningún producto.</p>";
        return;
    }

    function normalizarTexto(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }

    try {

        const respuesta = await fetch("productos.json");
        const productos = await respuesta.json();

        const producto = productos.find(p =>
            normalizarTexto(p.nombre) === productoId
        );

        if (!producto) {
            contenedor.innerHTML = "<p>Producto no encontrado.</p>";
            return;
        }

        document.title = `${producto.nombre} | 3dyLaser`;

        const descripcion = producto.descripcion ||
            "Producto elaborado con la calidad de 3dyLaser. Contáctanos para conocer más detalles.";

        const personalizacion = producto.personalizacion || "";

        const mensaje = encodeURIComponent(
            `Hola, me interesa el producto: ${producto.nombre}`
        );

        const whatsapp = `https://wa.me/524437331158?text=${mensaje}`;

        contenedor.innerHTML = `

            <div class="product-detail-image">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >

            </div>

            <div class="product-detail-info">

                <h1>${producto.nombre}</h1>

                <p class="product-detail-description">
                    ${descripcion}
                </p>

                <h2>
                    ${producto.precio
                        ? `$${producto.precio} MXN`
                        : "Consultar precio"}
                </h2>

                ${personalizacion ? `
                    <p>
                        <strong>Personalización:</strong>
                        ${personalizacion}
                    </p>
                ` : ""}

                <a
                    href="${whatsapp}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-whatsapp"
                >
                    Solicitar por WhatsApp
                </a>

            </div>

        `;

    } catch (error) {

        console.error("Error al cargar el producto:", error);

        contenedor.innerHTML =
            "<p>No fue posible cargar la información del producto.</p>";

    }

});