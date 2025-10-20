import express from "express";
import { db } from "./db.js";
import {
    verificarValidaciones
} from "./validaciones.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig(){
    // Opciones para la estrategia JWT
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };

    // Configurar la estrategia de passport
    passport.use(
        new Strategy(jwtOptions, async (payload, next) => {
            next(null, payload);
        })
    );
}

router.post("/login", body("username").isAlphanumeric().isLength({ max: 20 }), body("password").isAlphanumeric(), verificarValidaciones, async (req, res) => {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos
    const [rows] = await db.execute("SELECT * FROM usuarios WHERE username = ?", [username]);

    // Si no existe, devolver error
    if (rows.length === 0){
        return res
            .status(404)
            .json({ success: false, message: "Usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const hashedPassword = rows[0]?.password_hash;
    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada){
        return res
            .status(404)
            .json({ success: false, message: "Usuario o contraseña incorrectos" });
    }

    // Generar y devolver el jwt
    const payload = { userId: rows[0].id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Devolver el token
    res.json({ success: true, token });
});

    export default router;