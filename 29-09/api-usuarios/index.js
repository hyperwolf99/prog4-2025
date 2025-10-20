import express from "express";
import { conectarDB } from "./db.js";
import usuariosRouter from "./usuarios.js";
import rolesRouter from "./roles.js";

conectarDB();

// Inicializar la aplicación
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    // Responde con string
    res.send("Hola Mundo!");
});

// Usar el enrutador de usuarios
app.use("/usuarios", usuariosRouter);
app.use("/roles", rolesRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
