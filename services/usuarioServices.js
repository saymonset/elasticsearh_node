const { response, request } = require('express');
const Usuario = require('../models/usuario');

const { usuariosMongoRepo,
       usuarioCreateMongoRepo } = require('../repositories/usuarios-mongo-repo');
const { usuarioCreateESRepo ,
        createIndex,
        usuarioscGet} = require('../repositories/usuarios-es-repo')       

 const usuariosServ = async(req = request) => {
    //const resp = await  usuariosMongoRepo(req);
    // Si no hay definicion del indice de usuarios en ES, lo creamos;
    createIndex();
    //Creamos usuario en ES
    const respES = await usuarioscGet();
    return respES;
}
 const usuarioCreateServ = async(req = request) => {
    const resp = await  usuarioCreateMongoRepo(req);
    // Si no hay definicion del indice de usuarios en ES, lo creamos;
    createIndex();
    const respES = await usuarioCreateESRepo(resp);
    return respES;
}


module.exports = {
    usuariosServ,
    usuarioCreateServ,
    
}