document.addEventListener('DOMContentLoaded', () => {
    const excelUrl = 'https://electrocolor.net/catalogo_electrocolor.xlsx'; // URL del archivo Excel en tu servidor

    fetch(excelUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer();
        })
        .then(data => {
            console.log('Archivo Excel cargado con éxito');
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            console.log('Datos del Excel convertidos a JSON:', jsonData);

            const productos = jsonData.slice(1).map(row => ({
                id: row[0],
                nombre: row[1],
                tipo: row[2],
                precio: parseFloat(row[3]).toFixed(2), // Asegurarse de que el precio tiene dos decimales
                stock: row[4],
                estado: row[5]
            }));

            console.log('Productos procesados:', productos);

            generarCatalogo(productos);
        })
        .catch(error => console.error('Error al cargar el archivo Excel:', error));
});

function generarCatalogo(productos) {
    const productosPorCategoria = productos.reduce((acc, producto) => {
        if (producto.tipo) { // Evitar categorías 'undefined'
            acc[producto.tipo] = acc[producto.tipo] || [];
            acc[producto.tipo].push(producto);
        }
        return acc;
    }, {});

    const catalogoContainer = document.getElementById("catalogo-container");
    catalogoContainer.innerHTML = '';

    Object.keys(productosPorCategoria).forEach(tipo => {
        const categoriaProductos = productosPorCategoria[tipo];
        const categoriaContainer = document.createElement("div");
        categoriaContainer.className = "col-12 mb-5";

        const categoriaHeader = document.createElement("div");
        categoriaHeader.className = "d-flex justify-content-between align-items-center";
        categoriaHeader.innerHTML = `
            <h4 class="category-title" onclick="mostrarTodos('${tipo}')">${tipo}</h4>
            <button class="btn btn-secondary" onclick="mostrarTodos('${tipo}')">Ver más</button>
        `;
        categoriaContainer.appendChild(categoriaHeader);

        const productosContainer = document.createElement("div");
        productosContainer.className = "row";

        categoriaProductos.slice(0, 6).forEach(producto => {
            const productoCard = document.createElement("div");
            productoCard.className = "product-card col-md-4 mb-4";
            productoCard.innerHTML = `
                <div class="card">
                    <img src="images/catalogo/${producto.id}.jpg" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body text-center">
                        <h5 class="product-title">${producto.nombre}</h5>
                        <p class="product-price">${producto.precio} €</p>
                        <p class="product-status ${producto.estado === 'En stock' ? 'in-stock' : 'out-of-stock'}">${producto.estado}</p>
                    </div>
                </div>
            `;
            productosContainer.appendChild(productoCard);
        });

        categoriaContainer.appendChild(productosContainer);
        catalogoContainer.appendChild(categoriaContainer);
    });
}

function mostrarTodos(tipo) {
    const categoriaProductos = productosPorCategoria[tipo];
    const productosContainer = document.createElement("div");
    productosContainer.className = "row";

    categoriaProductos.forEach(producto => {
        const productoCard = document.createElement("div");
        productoCard.className = "product-card col-md-4 mb-4";
        productoCard.innerHTML = `
            <div class="card">
                <img src="images/catalogo/${producto.id}.jpg" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body text-center">
                    <h5 class="product-title">${producto.nombre}</h5>
                    <p class="product-price">${producto.precio} €</p>
                    <p class="product-status ${producto.estado === 'En stock' ? 'in-stock' : 'out-of-stock'}">${producto.estado}</p>
                </div>
            </div>
        `;
        productosContainer.appendChild(productoCard);
    });

    const categoriaContainer = document.querySelector(`.d-flex h4.category-title[onclick="mostrarTodos('${tipo}')"]`).closest('.col-12');
    categoriaContainer.replaceChild(productosContainer, categoriaContainer.querySelector('.row'));
}
