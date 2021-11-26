const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

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

const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoría con el ID: ${id}, no existe en la Base de Datos.`);
    }
}

const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con el ID: ${id}, no existe en la Base de Datos.`);
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida.`);
    }

    return true;

}


module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}