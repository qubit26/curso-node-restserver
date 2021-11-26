const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const {Usuario, Producto} = require('../models')


const cargarArchivo = async(req = request, res = response) => {

    try {
        
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        
        res.json({
            nombre
        });

    } catch (error) {
        res.status(400).json({error});
    }

}


const actualizarImagen = async(req = request, res = response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
                
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        console.log(pathImagen);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }



    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo;

    await modelo.save();



    res.json(modelo);

}


const actualizarImagenCloudinary = async(req = request, res = response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
                
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        const modeloArr = modelo.img.split('/');
        const nombre = modeloArr[modeloArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;

    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;

    await modelo.save();


    res.json(modelo);

}



const mostrarImagen = async(req = request, res = response) => {

    const {coleccion, id} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
                
            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        console.log(pathImagen);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
     
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}