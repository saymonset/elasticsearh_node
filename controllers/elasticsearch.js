
const { response, request } = require('express');

const { indexDefinition } = require('../models_es/library-definitiones')

const { es } = require('../database/config-es')


const elasticGet = async(req = request, res = response) => {
    // Verificar si el índice se creó correctamente
    createIndex();
    res.json({
        "elasticsearch":"Nuevo mundo"
    });
}


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




//llenamosdata al index
const elasticPost = async(req = request, res = response) => {

    try {
        const { title, author, description, published_date, url} = req.body;
        // Define the document
        const document = {
            title, 
            author, 
            description,
            published_date, 
            url
        }
        // Indexar el documento
        const result = await es.index({
            index: indexName,
            body: document
        });
        
        res.json({
            result
        });
    } catch (error) {
        console.log(error)
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
            index: 'library',
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
            index: 'library',
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
            index: 'library',
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
            index: 'library',
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
const indexName = 'library';

const createIndex = async() => {
    try {
        const response = await es.indices.create({
            index: indexName,
            body: indexDefinition
        });
        console.log(`Índice '${indexName}' creado exitosamente:`, response);
    } catch (error) {
        console.error(`Error al crear el índice '${indexName}':`, error);
    }
}




//-------------


 



module.exports = {
    elasticGet,
    elasticPost,
    elasticBulkPost,
    searchDocuments,
    searchDystopianBooks,
    searchBooksByAuthorAndDate,
    searchBooksByFilterMustShoul
}