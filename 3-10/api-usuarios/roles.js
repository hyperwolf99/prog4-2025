import express from "express";
import { db } from "./db.js";
import { validarId, validarRol, verificarValidaciones } from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM roles");
    res.json({ success: true, data: rows });
});

router.get("/:id", validarId(), verificarValidaciones, async (req, res) => {
    const id = req.params.id;
    const [rows] = await db.execute("SELECT * FROM roles WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Rol no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
});

router.post("/", validarRol(), verificarValidaciones, async (req, res) => {
    const { nombre } = req.body;

    const [result] = await db.execute("INSERT INTO roles (nombre) VALUES (?)", [
        nombre,
    ]);

    res.json({ success: true, data: { id: result.insertId, nombre } });
});

router.put("/:id", validarId(), validarRol(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { nombre } = req.body;

    const [rows] = await db.execute("SELECT * FROM roles WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Rol no encontrado" });
    }

    await db.execute("UPDATE roles SET nombre = ? WHERE id = ?", [nombre, id]);

    res.json({ success: true, data: { id, nombre } });
});

router.delete("/:id", validarId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT * FROM roles WHERE id = ?", [
        id,
    ]);
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Rol no encontrado" });
    }

    await db.execute("DELETE FROM roles WHERE id = ?", [id]);

    res.json({ success: true, message: "Rol eliminado" });
});

router.get("/:id/usuarios", validarId(), verificarValidaciones, async (req, res) => {});
router.post("/:id/usuarios", validarId(), verificarValidaciones, async (req, res) => {});
router.delete("/:id/usuarios/:usuario_id", validarId(), verificarValidaciones, async (req, res) => {});

export default router;
