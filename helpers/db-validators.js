const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la Base de Datos`);
    }
}

const correoExiste = async(correo) => {
    const verificarCorreo = await Usuario.findOne({correo});
    if (verificarCorreo) {
        throw new Error('Este correo ya se encuentra registrado en la Base de Datos, por favor intenta con otro.');
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con el ID: ${id}, no existe en la Base de Datos.`);
    }
}


module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId
}