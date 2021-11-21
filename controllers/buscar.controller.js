const { request, response } = require("express");
const {ObjectId} = require('mongoose').Types;

const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

// Buscar usuario
const buscarUsuario = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);

        if (!usuario.estado) {
            return res.status(404).json({
                msg: `El usuario con el id ${usuario._id} no existe en la base de datos`
            })
        }

        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
    
}

// Buscar categoria
const buscarCategoria = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);

        if (!categoria.estado) {
            return res.status(404).json({
                msg: `La categoría con el id ${categoria._id} no existe en la base de datos`
            })
        }

        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado: true});

    res.json({
        results: categorias
    });
    
}

// Buscar productos
const buscarProducto = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');

        if (!producto.estado) {
            return res.status(404).json({
                msg: `El producto con el id ${producto._id} no existe en la base de datos`
            })
        }

        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({nombre: regex, estado: true}).populate('categoria', 'nombre');

    res.json({
        results: productos
    });
    
}


const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {

        case 'usuarios':
            buscarUsuario(termino, res);
            break;
        
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        
        case 'productos':
            buscarProducto(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Error interno'
            });
            break;
    }


}


module.exports = {
    buscar
}