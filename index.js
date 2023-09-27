import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)

const datos = require('./datos.json')

const app = express()

const expossedPort = 1234

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hola Mundo!</h1><p>Texto Texto lalalalala</p>')
})

// 1) Obtención de todos los usuarios
app.get('/usuarios/', (req, res) => {
  try {
    const allUsuarios = datos.usuarios
    res.status(200).json(allUsuarios)
  } catch (error) {
    res.status(204).json({ "message":error})
  }
})
// 2) Obtención de un usuario a partir de un id
app.get('/usuarios/:id', (req, res) => {
  try {
    let usuarioId = parseInt(req.params.id)
    let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

    if (!usuarioEncontrado) {
      res.status(204).json({ "message": "Producto no encontrado"})
    }
    res.status(200).json(usuarioEncontrado)
  } catch (error) {
    res.status(204).json({"message": error})
  }
})

// 3) Creación de un usuario
app.post('/usuarios', (req, res) => {
  try {
    let bodyTemp = ''

    req.on('data', (chunk) => {
      bodyTemp += chunk.toString()
    })

    req.on('end', () => {
      const data = JSON.parse(bodyTemp)
      req.body = data
      datos.usuarios.push(req.body)
    })
    res.status(201).json({"message": "success"})
  } catch (error) {
    res.status(204).json({"message": "error"})
  }
})

// 4) Modifiacion de un usuario
app.patch('/usuarios/:id', (req, res) => {
  let idUsuarioAEditar = parseInt(req.params.id)
  let usuarioAActualizar = datos.usuarios.find((usuario) => usuario.id === idUsuarioAEditar)

  if (!usuarioAActualizar) {
    res.status(204).json({"message":"Usuario no encontrado"})
  }

  let bodyTemp = ''

  req.on('data', (chunk) => {
    bodyTemp += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(bodyTemp)
    req.body = data

    if (data.nombre) {
      usuarioAActualizar.nombre = data.nombre
    }

    if (data.edad) {
      usuarioAActualizar.edad = data.edad
    }

    if (data.email) {
      usuarioAActualizar.email = data.email
    }
    if (data.telefono) {
      usuarioAActualizar.telefono = data.telefono
    }

    res.status(200).send('Usuario actualizado')
  })
})

// 5) Borrar un usuario de los datos
app.delete('/usuarios/:id', (req, res) => {
  let idUsuarioBorrar = parseInt(req.params.id)
  let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioBorrar)

  if (!usuarioABorrar){
    res.status(204).json({"message":"Usuario no encontrado"})
  }

  let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
  try {
    datos.usuarios.splice(indiceUsuarioABorrar, 1)
    res.status(200).json({"message": "success"})
  } catch (error) {
    res.status(204).json({"message": "error"})
  }
})

// 6) Obtención  un precio a partir de un id
app.get('/productos/precio/:id', (req, res) => {
  try {
    let productoId = parseInt(req.params.id)
    let precioEncontrado = datos.productos.find((producto) => producto.id === productoId)

    if (!precioEncontrado) {
      res.status(204).json({ "message": "Producto no encontrado"})
    }
    res.status(200).json({"precio": precioEncontrado.precio})
  } catch (error) {
    res.status(204).json({"message": error})
  }
})

// 7) Obtener el nombre de un producto que se indica por id.
app.get('/productos/nombre/:id', (req, res) => {
  try {
    let productoId = parseInt(req.params.id)
    let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

    if (!productoEncontrado) {
      res.status(204).json({ "message": "Producto no encontrado"})
    }
    res.status(200).json({"Nombre": productoEncontrado.nombre})
  } catch (error) {
    res.status(204).json({"message": error})
  }
})

// 8) a obtener el teléfono de un usuario que se indica por id
app.get('/usuarios/telefono/:id', (req, res) => {
  try {
    let usuarioId = parseInt(req.params.id)
    let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

    if (!usuarioEncontrado) {
      res.status(204).json({ "message": "Producto no encontrado"})
    }
    res.status(200).json({"Telefono": usuarioEncontrado.telefono})
  } catch (error) {
    res.status(204).json({"message": error})
  }
})

//9) Obtener el nombre de un usuario que se indica por id
app.get('/usuarios/nombre/:id', (req, res) => {
  try {
    let usuarioId = parseInt(req.params.id)
    let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

    if (!usuarioEncontrado) {
      res.status(204).json({ "message": "Producto no encontrado"})
    }
    res.status(200).json({"Nombre": usuarioEncontrado.nombre})
  } catch (error) {
    res.status(204).json({"message": error})
  }
})

// 10)  obtener el total del stock actual de productos, la sumatoria de los precios individuales.
app.get('/productos', (req, res) => {
  try {
    const precioTotal = datos.productos.reduce((total, producto) => total + producto.precio, 0);
    const stockTotal = datos.productos.reduce((total, producto) => total + producto.stock, 0);

    res.status(200).json({ 
      precioTotal: precioTotal.toFixed(2),
      "stock total": stockTotal

    })
  } catch (error) {
    console.error(error)
    res.status(204).json({"message": "error"})
  }
})

app.listen(expossedPort, () => {
  console.log('Servidor escuchando en http://localhost:' + expossedPort)
})
