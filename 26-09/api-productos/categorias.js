import express from "express";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";
import { validarId, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

const validarCategoria = () => [
    body("nombre")
        .isAlpha("es-ES", { ignore: " -'" })
        .withMessage("El nombre debe contener solo letras, espacios o guiones")
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ max: 50 })
        .withMessage("El nombre no debe exceder los 50 caracteres"),
];

router.get("/", async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM categorias');
    res.json({ success: true, data: rows });
});
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }
    res.json({ success: true, data: rows[0] });
});
router.get("/:id/productos", async (req, res) => {
    const id = req.params.id;

    const sql =
        "SELECT p.id, p.nombre, p.cantidad " +
        "FROM productos p " +
        "WHERE p.categoria_id = ?" +
        " ORDER BY p.nombre ASC";

    const [rows] = await db.execute(sql, [id]);
    res.json({ success: true, data: rows });
});
router.post("/", validarCategoria(), verificarValidaciones, async (req, res) => {
    const { nombre } = req.body;

    const [result] = await db.execute(
        "INSERT INTO categorias (nombre) VALUES (?)",
        [nombre]
    );

    res.json({ success: true, data: { id: result.insertId, nombre } });
});
router.put("/:id", validarId(), validarCategoria(), verificarValidaciones, async (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;

    const [rows] = await db.execute("SELECT * FROM categorias WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    await db.execute(
        "UPDATE categorias SET nombre = ? WHERE id = ?",
        [nombre, id]
    );

    res.json({ success: true, data: { id, nombre } });
});
router.delete("/:id", validarId(), verificarValidaciones, async (req, res) => {
    const id = req.params.id;

    const [rows] = await db.execute("SELECT * FROM categorias WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    await db.execute(
        "DELETE FROM categorias WHERE id = ?",
        [id]
    );

    res.json({ success: true, message: "Categoría eliminada" });
});

export default router;
