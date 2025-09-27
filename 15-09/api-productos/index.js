import express from "express";
import mysql from "mysql2/promise";

// Conectar a la base de datos
const db = await mysql.createConnection({
    host: process.env.DB_HOST, // dominio o IP
    user: process.env.DB_USER, // usuario
    password: process.env.DB_PASS, // contraseña
    database: process.env.DB_NAME, // nombre de la base de datos o esquema
});

// Inicializar la aplicación
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// ---------------- Ruta principal
app.get("/", (req, res) => {
    // Responde con string
    res.send("Hola Mundo!");
});

// <----------------> OBTENER PRODUCTOS <---------------->
app.get("/productos", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM productos");
    // console.log('rows:',rows);
    res.json({success: true, data: rows});
});

// <----------------> CREAR PRODUCTO <---------------->
app.post("/productos", async (req, res) => {
    
    // Crear un nuevo producto
    const { nombre, categoria, cantidad } = req.body;

    const [result] = await db.execute(
        "INSERT INTO productos (nombre, categoria, cantidad) VALUES (?, ?, ?)",
        [nombre, categoria, cantidad]
    );
    
    res.json({ success: true, data: { id: result.insertId, nombre, categoria, cantidad } });
});

// <----------------> OBTENER PRODUCTO POR ID <---------------->
app.get("/productos/:id", async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM productos WHERE id = ?", [id]);

    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.json({ success: true, data: rows[0] });
});

// <----------------> MODIFICAR PRODUCTO <---------------->
app.put("/productos/:id", async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Actualizar los campos del producto
    const { nombre, categoria, cantidad } = req.body;

    await db.execute(
        "UPDATE productos SET nombre = ?, categoria = ?, cantidad = ? WHERE id = ?",
        [nombre, categoria, cantidad, id]
    );

    res.json({ success: true, data: { id, nombre, categoria, cantidad } });
});

// <----------------> ELIMINAR PRODUCTO <---------------->
app.delete("/productos/:id", async (req, res) => {
    // Obtener el ID del producto
    const id = Number(req.params.id);

    // Eliminar el producto
    await db.execute("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ success: true, data: { id } });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
