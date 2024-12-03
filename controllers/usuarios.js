const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const { usuariosServ,
        usuarioCreateServ,
        usuarioUpdateServ,
        usuarioDeleteServ }  = require('../services/usuarioServices')


const usuariosGet = async(req = request, res = response) => {
    const resp = await usuariosServ(req);
    res.json(resp);
}






const usuariosPost = async(req, res = response) => {

    const usuario = await usuarioCreateServ(req);
    
   
    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const usuario = await usuarioUpdateServ(req);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

 
    const usuario = await usuarioDeleteServ(req);

    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}