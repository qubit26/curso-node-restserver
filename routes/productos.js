const { Router, request, response } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esAdminRole, validarCategoria } = require('../middlewares');
const {
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto} = require('./../controllers/productos.controller');

const { existeCategoriaPorId, existeUsuarioPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


// Obtener todos los productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un in de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    // check('categoria').custom(validarCategoria),
    validarCampos
], crearProducto);

// Actualizar un producto por este id - privado - Cualquiera con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;