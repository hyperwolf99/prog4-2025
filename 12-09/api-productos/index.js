import express from "express";
import { body, param, validationResult, query } from "express-validator";

// Inicializar la aplicación
const app = express();
const port = 3000;
app.use(express.json());

let productos = [
    {
        id: 1,
        nombre: "Laptop",
        categoria: "Electrónica",
        cantidad: 10,
        precio: 1000,
    },
    {
        id: 2,
        nombre: "Teléfono",
        categoria: "Electrónica",
        cantidad: 5,
        precio: 500,
    },
    {
        id: 3,
        nombre: "Tablet",
        categoria: "Periféricos",
        cantidad: 8,
        precio: 300,
    },
    {
        id: 4,
        nombre: "Monitor",
        categoria: "Periféricos",
        cantidad: 2,
        precio: 200,
    },
];

// Validaciones
const validarId = () =>
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un número entero mayor a 0");
const validarProducto = () => [
    body("nombre")
        .isAlpha("es-ES")
        .withMessage("El nombre debe contener solo letras, espacios o guiones")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ max: 50 })
        .withMessage("El nombre no debe exceder los 50 caracteres"),
    body("categoria")
        .isAlpha("es-ES")
        .withMessage(
            "La categoría debe contener solo letras, espacios o guiones"
        )
        .notEmpty()
        .withMessage("La categoría es obligatoria")
        .isLength({ max: 50 })
        .withMessage("La categoría no debe exceder los 50 caracteres"),
    body("cantidad")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),
    body("precio")
        .isFloat({ min: 0.01 })
        .withMessage("El precio debe ser un número decimal mayor a 0")
        .notEmpty()
        .withMessage("El precio es obligatorio"),
];

const verificarValidaciones = (req, res, next) => {
    // Validar ID
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Falla de validación",
            errors: validacion.array(),
        });
    }
    next();
};

const validarFiltros = [
    query("producto").isAlpha("es-ES").optional(),
    query("precioMin").isFloat({ min: 0 }).optional(),
    query("precioMax")
        .isFloat({ min: 0 })
        .optional()
        .custom((value, { req }) => {
            if (
                req.query.precioMin &&
                parseFloat(value) < parseFloat(req.query.precioMin)
            ) {
                throw new Error(
                    "El precioMax no puede ser menor que precioMin"
                );
            }
            return true;
        }),
    query("categoria").isAlpha("es-ES").optional(),
    query("cantidad").isInt({ min: 1 }).optional(),
];

// ---------------- Ruta principal
app.get("/", (req, res) => {
    // Responde con string
    res.send("Hola Mundo!");
});

// <----------------> OBTENER PRODUCTOS <---------------->
app.get("/productos", validarFiltros, verificarValidaciones, (req, res) => {
    // Clonar el arreglo de productos
    let productosFiltrados = [...productos];

    // Filtrado por nombre de producto
    const producto = req.query.producto;
    if (producto) {
        // Verifica que el nombre del producto contenga el texto buscado
        productosFiltrados = productosFiltrados.filter((p) =>
            p.nombre.toLowerCase().includes(producto.toLowerCase())
        );
    }

    // Filtrado por precio mínimo
    const precioMin = req.query.precioMin;
    if (precioMin) {
        const precioMinimo = Number(precioMin);
        productosFiltrados = productosFiltrados.filter(
            (p) => p.precio >= precioMinimo
        );
    }

    // Filtrado por precio máximo
    const precioMax = req.query.precioMax;
    if (precioMax) {
        const precioMaximo = Number(precioMax);
        productosFiltrados = productosFiltrados.filter(
            (p) => p.precio <= precioMaximo
        );
    }

    // Filtrado por categoría
    const categoria = req.query.categoria;
    if (categoria) {
        // Verifica que la categoría del producto contenga el texto buscado
        productosFiltrados = productosFiltrados.filter((p) =>
            p.categoria.toLowerCase().includes(categoria.toLowerCase())
        );
    }

    // Filtrado por cantidad
    const cantidad = req.query.cantidad;
    if (cantidad) {
        // Verifica que la cantidad sea mayor o igual a la cantidad buscada
        productosFiltrados = productosFiltrados.filter(
            (p) => p.cantidad >= cantidad
        );
    }

    // Respuesta final
    res.json({ success: true, data: productosFiltrados });
});

// <----------------> CREAR PRODUCTO <---------------->
app.post("/productos", validarProducto(), verificarValidaciones, (req, res) => {
    // Crear un nuevo producto
    const { nombre, categoria, cantidad, precio } = req.body;

    // Validar que todos los campos estén presentes
    if (
        !nombre ||
        !categoria ||
        cantidad === undefined ||
        precio === undefined
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Todos los campos (nombre, categoria, cantidad, precio) son obligatorios",
        });
    }

    // Buscar el ID máximo actual y sumar 1
    const maxId =
        productos.length > 0 ? Math.max(...productos.map((p) => p.id)) : 0;
    const nuevoProducto = {
        id: maxId + 1,
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        cantidad,
        precio,
    };

    // Agregar el nuevo producto al arreglo
    productos.push(nuevoProducto);

    console.log("Nuevo producto creado:", nuevoProducto);

    // Responder con el nuevo producto
    res.send({ success: true, data: nuevoProducto });
});

// <----------------> OBTENER PRODUCTO POR ID <---------------->
app.get("/productos/:id", validarId(), verificarValidaciones, (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Buscar el producto por ID
    const producto = productos.find((p) => p.id === id);
    if (!producto) {
        // Si no se encuentra el producto, se devuelve un error 404
        return res
            .status(404)
            .json({ success: false, message: "Producto no encontrado" });
    }

    // Si se encuentra el producto, se devuelve en la respuesta
    res.json({ success: true, data: producto });
});

// <----------------> MODIFICAR PRODUCTO <---------------->
app.put("/productos/:id", (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Validar id
    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "ID inválido" });
    }

    // Buscar el producto por ID
    let productoEncontrado = productos.find((p) => p.id === id);

    // Si no se encuentra el producto, se devuelve un error 404
    if (!productoEncontrado) {
        return res
            .status(404)
            .json({ success: false, message: "Producto no encontrado" });
    }

    // Actualizar los campos del producto
    const { nombre, categoria, cantidad, precio } = req.body;

    // Validar que todos los campos estén presentes
    if (
        nombre === undefined ||
        categoria === undefined ||
        cantidad === undefined ||
        precio === undefined
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Todos los campos (nombre, categoria, cantidad, precio) son obligatorios",
        });
    }

    // Validar nombre
    if (nombre.trim() === "" || nombre.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: "El campo nombre esta vacío o excede los 100 caracteres",
        });
    }

    // Validar categoría
    if (categoria.trim() === "") {
        return res
            .status(400)
            .json({ success: false, message: "El campo categoria esta vacío" });
    }

    // Validar cantidad
    if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad < 0) {
        return res
            .status(400)
            .json({ success: false, message: "Cantidad invalida" });
    }

    // Validar precio
    if (isNaN(precio) || precio < 0) {
        return res
            .status(400)
            .json({ success: false, message: "Precio invalido" });
    }

    // Modificar el producto

    // Alternativa 1: Modificar atributo por atributo
    /*
    productoEncontrado.producto = producto;
    productoEncontrado.categoria = categoria;
    productoEncontrado.cantidad = cantidad;
    productoEncontrado.precio = precio;
    */

    // Alternativa 2: empleando findIndex anteriormente

    // Alternativa 3: Reemplazar el arreglo
    productos = productos.map((p) =>
        p.id === id ? { id, nombre, categoria, cantidad, precio } : p
    );

    // Obtener el producto modificado
    const productoModificado = productos.find((p) => p.id === id);

    // Responder con producto modificado
    res.json({ success: true, data: productoModificado });
});

// <----------------> ELIMINAR PRODUCTO <---------------->
app.delete("/productos/:id", validarId(), verificarValidaciones, (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Buscar el producto por ID
    const productoEncontrado = productos.find((p) => p.id === id);
    if (!productoEncontrado) {
        // Si no se encuentra el producto, se devuelve un error 404
        return res
            .status(404)
            .json({ success: false, message: "Producto no encontrado" });
    }

    // Eliminar el producto
    productos = productos.filter((p) => p.id !== id);
    console.log("Producto eliminado:", productoEncontrado);

    // Responder con el producto eliminado
    res.json({ success: true, data: productoEncontrado });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
