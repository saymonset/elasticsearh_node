
const { response, request } = require('express');

const { indexUsuarioEsDefinition , indexNameUsuario:indexName} = require('../models_es/usuario-definitiones-es')

const { es } = require('../database/config-es')

const { getFromDataEsToUsuariosMapperEs } = require('../mapper/extract-data-usuarios-es')

//llenamosdata al index
const elasticBulkPost = async(req = request, res = response) => {
    try {
        const  bulkData  = req.body;
        const result = await es.bulk({ body: bulkData });
        res.json({
         result
        });
    } catch (error) {
        console.log(error);
    }
}



const usuariosESGet = async() => {
    // Realizar la consulta para obtener todos los documentos
    const resp = await es.search({
       index: indexName, // Reemplaza con el nombre de tu índice
       body: {
           query: {
               match_all: {} // Consulta para obtener todos los documentos
           }
       }
   });

  const usuarios = getFromDataEsToUsuariosMapperEs(resp);


return usuarios;
}

const usuarioUpdateESRepo = async({ estado, google, _id, nombre, correo, rol, password }) => {
    try {
        // Define the document with the fields you want to update
        const document = {
            doc: {
                estado, 
                google, 
                nombre, 
                correo, 
                rol,
                password
            }
        };
        // Use the update method instead of index
        const result = await es.update({
            index: indexName, // Nombre del índice
            id: _id.toString(), // Usar el ID de MongoDB como ID en Elasticsearch
            body: document
        });

        return result;
    } catch (error) {
        console.log('----------------error------------' + error);
    }
};




//llenamosdata al index
const usuarioCreateESRepo = async({estado, google, _id, nombre, correo, rol, password}) => {

    try {
        // Define the document
        const document = {
            estado, 
            google, 
            nombre, 
            correo, 
            rol,
            password
        }
        const result = await es.index({
            index: indexName, // Nombre del índice
            id: _id.toString(), // Usar el ID de MongoDB como ID en Elasticsearch
            body: document
        });
        return result;
    } catch (error) {
        console.log('----------------error------------'+error)
       // console.log(error)
    }
   
}


// Definir la consulta
const query = (author)=>{
    return  {

        match: {
            author
        }
    }
};

// Función para realizar la búsqueda
  searchDocuments = async (req, resp) => {
    try {

        const  { author } = req.body;
        console.log(query(author));
        const result = await es.search({
            index: indexName,
            body: {
                query: {
                    match: {
                        author
                    }
                }
            }

        });
        // resp.json(query(result));
        resp.json({result})
        //console.log(`Resultados de la búsqueda:`, result.body.hits.hits);
    } catch (error) {
        console.error(`Error al realizar la búsqueda:`, error);
    }
}


const searchDystopianBooks = async (req, resp) => {
    const { query } = req.body;
  
    try {
       
        const response = await es.search({
            index: indexName,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['title^2', 'author', 'description']
                    }
                }
            }
        });

        return resp.json({
            response
        });

        console.log('Search Results:', response.body.hits.hits);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};


const searchBooksByAuthorAndDate = async (req,resp) => {
    try {
        const {author, publishDate } = req.body;
        const response = await es.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        filter: [
                            { match: { author }},
                            { range: { published_date: { gte: publishDate }}}
                        ]
                    }
                }
            }
        });

        resp.json({
            response
        });

        console.log('Search Results:', response.hits.hits);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};


const searchBooksByFilterMustShoul = async (req,resp) => {
    try {
        const {
            title,
            author,
            author2,
            published_date

        } = req.body;

      
        const response = await es.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        must: [
                            { match: { title}}
                        ],
                        should: [
                            { match: { author }},
                            { match: { author: author2 }}
                        ],
                        filter: [
                            { range: { published_date: { gte: published_date }}}
                        ]
                    }
                }
            }
        });

        resp.json({
            response
        });

        console.log('Search Results:', response.hits.hits);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};
 

//--------------


// Crear el índice 'library'


const createIndex = async() => {
    let resp = {};
    try {
        // Verificar si el índice ya existe
        const existe = await es.indices.exists({ index: indexName });
        if (!existe) {
            const response = await es.indices.create({
                index: indexName,
                body: indexUsuarioEsDefinition
            });
            resp['A']= `Índice '${indexName}' creado exitosamente:`
            resp['B']= response;
        }else{
            resp['A']=`Índice '${indexName}' Existe!`;
        }
      
    } catch (error) {
        console.error(`Error al crear el índice '${indexName}':`);
    }
    return resp;
}




//-------------


 



module.exports = {
    usuariosESGet,
    createIndex,
    usuarioCreateESRepo,
    usuarioUpdateESRepo,
    elasticBulkPost,
    searchDocuments,
    searchDystopianBooks,
    searchBooksByAuthorAndDate,
    searchBooksByFilterMustShoul
}