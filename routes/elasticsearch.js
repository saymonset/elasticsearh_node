const { Router } = require('express');

const { elasticGet, elasticBulkPost, searchDocuments, searchDystopianBooks,
    searchBooksByAuthorAndDate, searchBooksByFilterMustShoul } = require('../repositories/usuarios-es-repo')

const routerES = Router();

routerES.get('/', elasticGet );
routerES.post('/bulk', elasticBulkPost );
routerES.post('/search', searchDocuments );
routerES.post('/searchSeveral', searchDystopianBooks );
routerES.post('/searchFilter', searchBooksByAuthorAndDate );
routerES.post('/searchBooksByFilterMustShould', searchBooksByFilterMustShoul );

module.exports = routerES;