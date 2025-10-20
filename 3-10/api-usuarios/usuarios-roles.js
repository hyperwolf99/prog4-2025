import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { param } from "express-validator";

const router = express.Router();

export const validarUsuarioId = param("usuario_id").isInt().withMessage("El ID del usuario debe ser un número entero");
export const validarRolId = param("rol_id").isInt().withMessage("El ID del rol debe ser un número entero");

router.get("/", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM usuarios_roles");
    res.json({ success: true, data: rows });
});

router.get("/usuarios/:usuario_id", async (req, res) => {
    
});

router.get("/roles/:rol_id", async (req, res) => {
    
});

router.get("/usuarios/:usuario_id/roles/:rol_id", validarUsuarioId, validarRolId, verificarValidaciones, getUsuariosRoles, async (req, res) => {
    
});

router.get("/roles/:rol_id/usuarios/:usuario_id", validarRolId, validarUsuarioId, verificarValidaciones, getUsuariosRoles, async (req, res) => {

});

async function getUsuariosRoles(req,res) {
    const usuarioId = Number(req.params.usuario_id);
    const rolId = Number(req.params.rol_id);
    const [rows] = await db.execute(
        "SELECT ur.usuario_id, ur.rol_id, u.username, r.nombre AS rol_nombre, ur.descripcion, ur.nivel FROM usuarios_roles ur JOIN usuarios u ON ur.usuario_id = u.id JOIN roles r ON ur.rol_id = r.id WHERE ur.usuario_id = ? AND ur.rol_id = ?",
        [usuarioId, rolId]
    );

    if (rows.length === 0) {
        return res
            .status(404)
            .json({ success: false, message: "Usuario/rol no encontrado" });
    }

    // console.log(rows);

    res.json({ success: true, data: rows[0] });
}

router.post("/", verificarValidaciones, async (req, res) => {
    const { usuario_id, rol_id, descripcion, nivel } = req.body;

    const [result] = await db.execute(
        "INSERT INTO usuarios_roles (usuario_id, rol_id, descripcion, nivel) VALUES (?, ?, ?, ?)",
        [usuario_id, rol_id, descripcion, nivel]
    );

    res.status(201).json({ success: true, data: { id: result.insertId, usuario_id, rol_id, descripcion, nivel } });
});

router.put("/usuarios/:usuario_id/roles/:rol_id", verificarValidaciones, async (req, res) => {
    
});

router.put("/roles/:rol_id/usuarios/:usuario_id", verificarValidaciones, async (req, res) => {
    
});

router.delete("/usuarios/:usuario_id/roles/:rol_id", verificarValidaciones, async (req, res) => {
    
});

router.delete("/roles/:rol_id/usuarios/:usuario_id", verificarValidaciones, async (req, res) => {
    
});

router.get("/:id/usuarios", verificarValidaciones, async (req, res) => {});
router.post("/:id/usuarios", verificarValidaciones, async (req, res) => {});
router.delete("/:id/usuarios/:usuario_id", verificarValidaciones, async (req, res) => {});

export default router;
