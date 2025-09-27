import { body, param, validationResult, query } from "express-validator";
import express from "express";
import { db } from "./db.js";

// Enrutador
const router = express.Router();

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
    body("categoriaId")
        .isInt({ min: 1 })
        .withMessage("La categoría es obligatoria")
        .isLength({ max: 50 })
        .withMessage("La categoría no debe exceder los 50 caracteres"),
    body("cantidad")
        .isInt({ min: 1 })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),
    // body("precio")
    //     .isFloat({ min: 0.01 })
    //     .withMessage("El precio debe ser un número decimal mayor a 0")
    //     .notEmpty()
    //     .withMessage("El precio es obligatorio"),
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
    query("nombre").isAlpha("es-ES").optional(),
    query("cantidadMin").isFloat({ min: 0 }).optional(),
    query("cantidadMax")
        .isFloat({ min: 0 })
        .optional()
        .custom((value, { req }) => {
            if (
                req.query.precioMin &&
                parseFloat(value) < parseFloat(req.query.precioMin)
            ) {
                throw new Error(
                    "La cantidadMax no puede ser menor que cantidadMin"
                );
            }
            return true;
        }),
    query("categoriaId").isInt({ min: 1 }).optional(),
    query("cantidad").isInt({ min: 1 }).optional(),
];

// <----------------> OBTENER PRODUCTOS <---------------->
router.get("/", validarFiltros, verificarValidaciones, async (req, res) => {
    // Filtros y parámetros
    const filtros = []
    const parametros = []

    // Crear un nuevo producto
    const { nombre, cantidadMin, cantidadMax, precioMin, precioMax } = req.query;

    // Filtros
    if (nombre) {
        filtros.push("nombre LIKE ?");
        parametros.push(`%${nombre}%`);
    }

    if (cantidadMin !== undefined) {
        filtros.push("cantidad >= ?");
        parametros.push(Number(cantidadMin));
    }

    if (cantidadMax !== undefined) {
        filtros.push("cantidad <= ?");
        parametros.push(Number(cantidadMax));
    }

    if (precioMin !== undefined) { // No funciona porque no existe el campo precio en la tabla
        filtros.push("precio >= ?");
        parametros.push(Number(precioMin));
    }

    if (precioMax !== undefined) { // No funciona porque no existe el campo precio en la tabla
        filtros.push("precio <= ?");
        parametros.push(Number(precioMax));
    }

    // Construir la consulta SQL
    let sql = "SELECT p.id, p.nombre, p.cantidad, c.nombre AS categoria FROM productos p JOIN categorias c ON p.categoria_id = c.id";

    // Agregar condiciones WHERE si hay filtros
    if (filtros.length > 0) {
        sql += " WHERE " + filtros.join(" AND ");
    }

    // Ejecutar la consulta
    console.log(sql);
    const [result] = await db.execute(sql, parametros);

    // Responder con los productos
    res.json({ success: true, data: result });
});

// <----------------> CREAR PRODUCTO <---------------->
router.post("/", validarProducto(), verificarValidaciones, async (req, res) => {

    // Crear un nuevo producto
    const { nombre, categoriaId, cantidad } = req.body;

    const [result] = await db.execute(
        "INSERT INTO productos (nombre, categoria_id, cantidad) VALUES (?, ?, ?)",
        [nombre, categoriaId, cantidad]
    );

    res.json({ success: true, data: { id: result.insertId, nombre, categoriaId, cantidad } });
});

// <----------------> OBTENER PRODUCTO POR ID <---------------->
router.get("/:id", validarId(), verificarValidaciones, async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT * FROM productos WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

// <----------------> MODIFICAR PRODUCTO <---------------->
router.put("/:id", async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Actualizar los campos del producto
    const { nombre, categoriaId, cantidad } = req.body;

    await db.execute(
        "UPDATE productos SET nombre = ?, categoria_id = ?, cantidad = ? WHERE id = ?",
        [nombre, categoriaId, cantidad, id]
    );

    res.json({ success: true, data: { id, nombre, categoriaId, cantidad } });
});

// <----------------> ELIMINAR PRODUCTO <---------------->
router.delete("/:id", validarId(), verificarValidaciones, async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Verificar si el producto existe
    const [rows] = await db.execute("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Eliminar el producto
    await db.execute("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ success: true, data: { id } });
});

export default router;