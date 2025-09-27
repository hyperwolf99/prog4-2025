import express from "express";
import { conectarDB } from "./db.js";
import productosRouter from "./productos.js";
import categoriasRouter from "./categorias.js";

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

// Usar el enrutador de productos
app.use("/productos", productosRouter);
app.use("/categorias", categoriasRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
