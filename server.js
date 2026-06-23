const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema NoSQL de Mongoose
const ProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  existencia: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Producto = mongoose.model('Producto', ProductoSchema);

// ========================================
// GET - Obtener todos los productos
// ========================================
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener productos',
      error: error.message
    });
  }
});

// ========================================
// GET - Obtener un producto por ID
// ========================================
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al buscar producto',
      error: error.message
    });
  }
});

// ========================================
// POST - Crear producto
// ========================================
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      precio: req.body.precio,
      existencia: req.body.existencia
    });

    await nuevoProducto.save();

    res.status(201).json({
      mensaje: 'Producto registrado correctamente',
      producto: nuevoProducto
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar producto',
      error: error.message
    });
  }
});

// ========================================
// PUT - Editar producto
// ========================================
app.put('/productos/:id', async (req, res) => {
  try {

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        precio: req.body.precio,
        existencia: req.body.existencia
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: productoActualizado
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar producto',
      error: error.message
    });
  }
});

// ========================================
// DELETE - Eliminar producto
// ========================================
app.delete('/productos/:id', async (req, res) => {
  try {

    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }

    res.json({
      mensaje: 'Producto eliminado correctamente',
      producto: productoEliminado
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar producto',
      error: error.message
    });
  }
});

// ========================================
// Ruta principal
// ========================================
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API Inventario NoSQL funcionando correctamente'
  });
});

// ========================================
// Iniciar servidor
// ========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});