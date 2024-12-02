const { response, request } = require('express');
const Usuario = require('../models/usuario');

const { usuariosMongoRepo,
       usuarioCreateMongoRepo,
       usuarioUpdateMongoRepo,
       usuarioDeleteMongoRepo } = require('../repositories/usuarios-mongo-repo');
const { usuarioCreateESRepo ,
        createIndex,
        usuariosESGet,
        usuarioUpdateESRepo} = require('../repositories/usuarios-es-repo')       

 const usuariosServ = async(req = request) => {
    // Si no hay definicion del indice de usuarios en ES, lo creamos;
    createIndex();
    //Obtenemos usuarios en ES
    const respES = await usuariosESGet();
    return respES;
}
 const usuarioCreateServ = async(req = request) => {
    const resp = await  usuarioCreateMongoRepo(req);
    // Si no hay definicion del indice de usuarios en ES, lo creamos;
    createIndex();
    //Creamosel usuario en ES con el indice que viene en mongo
    const respES = await usuarioCreateESRepo(resp);
    return respES;
}

const usuarioUpdateServ = async(req = request) => {
    //Actuaalizamos en mongo db
    const resp = await  usuarioUpdateMongoRepo(req);
   
    // //Creamosel usuario en ES con el indice que viene en mongo
     const respES = await usuarioUpdateESRepo(resp);
    return respES;
}

const usuarioDeleteServ = async(req = request) => {
    //Actuaalizamos en mongo db
    const resp = await  usuarioDeleteMongoRepo(req);
    console.log('------eliminado-------');
    console.log({resp});
   
    // //Creamosel usuario en ES con el indice que viene en mongo
    const respES = await usuarioUpdateESRepo(resp);
    return resp;
}


module.exports = {
    usuariosServ,
    usuarioCreateServ,
    usuarioUpdateServ,
    usuarioDeleteServ,
    
}