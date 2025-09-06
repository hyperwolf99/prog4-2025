import express from 'express'

// Inicializar la aplicación
const app = express()
const port = 3000
app.use(express.json())

const nombres = ['Ana', 'Luis', 'Carlos', 'María']

// ---------------- Nombres
app.get('/nombres', (req, res) => {
    // Responde con arreglos
    res.send(nombres)
})

app.get('/nombres/:id', (req, res) => {
    // Obtener el ID del nombre
    const id = parseInt(req.params.id)
    // Validar id
    if (isNaN(id) || id < 0 || id >= nombres.length) {
        return res.status(400).json({ success: false, message: 'ID inválido' })
    }
    // Responder con el nombre correspondiente al ID
    res.json({ success: true, data: nombres[id] })
})

app.post('/nombres', (req, res) => {
    const { nombre } = req.body
    nombres.push(nombre.trim())
    console.log(nombre)
    res.send({ success: true, data: nombre })
})


// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`)
})