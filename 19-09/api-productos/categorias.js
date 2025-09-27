import express from "express";
import { db } from "./db.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
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
router.post("/", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

export default router;
