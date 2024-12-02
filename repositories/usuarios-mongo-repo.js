const {  request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosMongoRepo = async(req = request) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);
    return {
        total,
        usuarios
    };
}

const usuarioCreateMongoRepo = async(req = request) => {
   const { nombre, correo, password, rol } = req.body;
   const usuario = new Usuario({ nombre, correo, password, rol });

   // Encriptar la contraseña
   const salt = bcryptjs.genSaltSync();
   usuario.password = bcryptjs.hashSync( password, salt );

   // Guardar en BD
   await usuario.save();

   return usuario
}

const usuarioUpdateMongoRepo = async(req = request) => {
    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;
    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto , { new: true });
    return usuario
 }
const usuarioDeleteMongoRepo = async(req = request) => {
 
    const { id } = req.params;
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } , { new: true } );
    return usuario
 }


module.exports = {
    usuariosMongoRepo,
    usuarioCreateMongoRepo,
    usuarioUpdateMongoRepo,
    usuarioDeleteMongoRepo
}
