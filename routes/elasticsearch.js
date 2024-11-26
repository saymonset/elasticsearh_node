const { Router } = require('express');

const { elasticGet, elasticPost, elasticBulkPost, searchDocuments, searchDystopianBooks,
    searchBooksByAuthorAndDate, searchBooksByFilterMustShoul } = require('../controllers/elasticsearch')

const routerES = Router();

routerES.get('/', elasticGet );
routerES.post('/', elasticPost );
routerES.post('/bulk', elasticBulkPost );
routerES.post('/search', searchDocuments );
routerES.post('/searchSeveral', searchDystopianBooks );
routerES.post('/searchFilter', searchBooksByAuthorAndDate );
routerES.post('/searchBooksByFilterMustShould', searchBooksByFilterMustShoul );

module.exports = routerES;