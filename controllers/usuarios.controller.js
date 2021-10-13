const {response,  request} = require('express');

const usuariosGet = (req = request, res = response) => { 

    const {q, nombre = 'No name', apikey, page = 1, limit = 4} = req.query;

    res.json({
        msg: 'Francesca GET - controlador',
        bonita: true,
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPut = (req, res) => {

    const {id} = req.params;

    res.status(500).json({
        msg: 'Francesca PUT - controlador',
        bonita: true,
        id
    });
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'Francesca POST - controlador',
        bonita: true,
        nombre,
        edad
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'Francesca DELETE - controlador',
        bonita: true
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'Francesca PATCH - controlador',
        bonita: true
    });
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}