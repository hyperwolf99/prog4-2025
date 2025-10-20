import { useEffect } from 'react'
import { useState } from 'react'

export function Usuarios( { token } ) {
    const [usuarios, setUsuarios] = useState([])

    const fetchUsuarios = async (token) => {
        if (!token){
            console.log("No hay token")
            return []
        }

        const response = await fetch("http://localhost:3000/usuarios", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const usuariosData = await response.json()
        if (!response.ok){
            console.log("Error al obtener usuarios", usuariosData.error)
            return
        }
        return usuariosData.data
    }

    useEffect(() => {
        fetchUsuarios(token).then((usuarios) => setUsuarios(usuarios))
    }, [token])

    return <ul>
        {usuarios.map((u) => <li key= {u.id}>{u.username} ({u.apellido}, {u.nombre})</li>)}
    </ul>
}