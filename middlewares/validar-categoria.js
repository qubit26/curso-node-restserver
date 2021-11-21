const {request, response} = require('express');
const {Categoria} = require('../models');

const validarCategoria = async(req = request, res = response, next) => {

    const nombreCategoria = req.body.categoria;

    // const categoriaDB = await Categoria.findOne({nombre: nombreCategoria});

    // if (!categoriaDB) {
    //     return res.status(404).json({
    //         msg: `La categoria ${nombreCategoria} no existe`
    //     });
    // }

    console.log(nombreCategoria);

    next();

}

module.exports = validarCategoria;