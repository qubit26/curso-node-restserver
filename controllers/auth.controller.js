const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req = request, res = response) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Datos incorrectos - correo'
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Datos incorrectos - usuario-estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Datos incorrectos - password'
            });
        }


        // Generar el JWT
        const token = await generarJWT(usuario.id, usuario.nombre);


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo ha salido mal, por favor hable con el administrador.',
            error
        });
    }

}

const googleSignIn = async(req = request, res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        // Si el usuario no existe en BD
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'xd',
                img,
                google: true

            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario está marcado como false en BD
        if (!usuario.estado) {
             return res.status(401).json({
                msg: 'Usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id, usuario.nombre);

        
        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}


module.exports = {
    login,
    googleSignIn
}