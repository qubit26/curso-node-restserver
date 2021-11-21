const { request, response } = require("express");
const {Producto} = require('../models');


// obtenerProductos
const obtenerProductos = async(req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })

}

// obtenerProducto por id
const obtenerProducto = async(req = request, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    if (!producto.estado) {
        return res.status(404).json({
            msg: 'Producto inexistente'
        });
    }

    res.json({
        producto
    });

}

// crearProducto
const crearProducto = async(req = request, res = response) => {
    
    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);


}

// actualizarProducto
const actualizarProducto = async(req = request, res = response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if (data.nombre) {
        
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const buscarProducto = await Producto.findById(id);

    if (!buscarProducto.estado) {
        return res.status(404).json({
            msg: 'El producto que intentas actualizar no existe'
        })
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(productoActualizado);

}

// borrarProducto
const borrarProducto = async(req = request, res = response) => {

    const {id} = req.params;

    const buscarProducto = await Producto.findById(id);

    if (!buscarProducto.estado) {
        return res.status(404).json({
            msg: 'El producto que intentas borrar no existe'
        })
    }

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(productoBorrado);

}



module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}