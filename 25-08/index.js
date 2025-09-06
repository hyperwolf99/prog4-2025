import express from 'express'

// Inicializar la aplicación
const app = express()
const port = 3000

// Ruta principal
app.get('/', (req, res) => {
    // Responde con string
    res.send('Hola Mundo!')
})

// Ruta de saludo
app.get('/saludo', (req, res) => {
    // Responde con objeto JSON
    res.send({mensaje: 'Hola desde la ruta de saludo!'})
})

// Ruta de nombres
app.get('/nombres', (req, res) => {
    // Responde con arreglos
    const nombres = ['Ana', 'Luis', 'Carlos', 'María']
    res.send(nombres)
})

app.get('/horarios', (req, res) => {
    // Responde con objeto JSON
    res.send({
        lunes: '18hs',
        viernes: '19hs',
    })
})

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`)
})