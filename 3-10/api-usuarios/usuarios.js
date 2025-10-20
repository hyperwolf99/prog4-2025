import express from "express";
import { db } from "./db.js";
import {
    validarId,
    verificarValidaciones,
    validarUsuario, validarRolId, validarParamRolId
} from "./validaciones.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM usuarios");

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "No hay usuarios" });
    }

    const usuarios = rows.map((u) => ({
        ...u,
        activo: !!u.activo,
    }));

    // Quitar la contraseña antes de enviar la respuesta
    res.json({
        success: true,
        data: usuarios.map((u) => ({ ...u, password_hash: undefined })),
    });
});

// Obtener usuario por ID
router.get("/:id", validarId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
        "SELECT id, username, nombre, apellido, activo FROM usuarios WHERE id = ?",
        [id]
    );
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
    }
    res.json({ success: true, data: rows[0] });
});

router.post("/", validarUsuario(), verificarValidaciones, async (req, res) => {
    const { username, nombre, apellido, password_hash, activo } = req.body;

    const [result] = await db.execute(
        "INSERT INTO usuarios (username, nombre, apellido, password_hash, activo) VALUES (?, ?, ?, ?, ?)",
        [username, nombre, apellido, password_hash, activo]
    );

    res.json({
        success: true,
        data: {
            id: result.insertId,
            username,
            nombre,
            apellido,
            password_hash,
            activo,
        },
    });
});

router.put("/:id", validarId(), validarUsuario(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { username, nombre, apellido, password_hash, activo } = req.body;

    const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
        id,
    ]);
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute(
        "UPDATE usuarios SET username = ?, nombre = ?, apellido = ?, password_hash = ?, activo = ? WHERE id = ?",
        [username, nombre, apellido, password_hash, activo, id]
    );

    res.json({ success: true, data: { id, username, nombre, apellido, password_hash, activo } });
});

router.delete("/:id", validarId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [rows] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [
        id,
    ]);
    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
    }

    await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ success: true, message: "Usuario eliminado" });
});

router.get("/:id/roles", validarId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);

    const [rows] = await db.execute(
        `SELECT r.id, r.nombre AS rol_nombre FROM roles r JOIN usuarios_roles ur ON r.id = ur.rol_id WHERE ur.usuario_id = ? ORDER BY r.nombre`,
        [id]
    );

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "No hay roles para este usuario" });
    }

    res.json({ success: true, data: id, roles: rows.map((r) => r.rol_nombre) });
});

router.post("/:id/roles", validarId(), validarRolId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const { rol_id } = req.body;


    const [rows] = await db.execute("SELECT * FROM roles WHERE id = ?", [rol_id]);

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Rol no encontrado" });
    }

    await db.execute("INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (?, ?)", [id, rol_id]);

    res.json({ success: true, data: { id, rol_id } });
});

router.delete("/:id/roles/:rol_id", validarId(), validarParamRolId(), verificarValidaciones, async (req, res) => {
    const id = Number(req.params.id);
    const rol_id = Number(req.params.rol_id);

    await db.execute("DELETE FROM usuarios_roles WHERE usuario_id = ? AND rol_id = ?", [id, rol_id]);

    res.json({ success: true, data: { id, rol_id } });
});

export default router;
