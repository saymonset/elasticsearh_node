
const getUsuariosEs = (data)=>{

    // Recorrer los hits y extraer la información deseada
const results = data.hits.hits.map(hit => {
                return {
                    _id: hit._id,
                    estado: hit._source.estado,
                    google: hit._source.google,
                    nombre: hit._source.nombre,
                    correo: hit._source.correo,
                    rol: hit._source.rol,
                    password: hit._source.password
                };
            });
return results
}

module.exports = {
    getUsuariosEs
}