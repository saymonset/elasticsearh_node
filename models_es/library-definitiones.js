


// Definición del índice y mapeos
const indexDefinition = {
    settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
        analysis: {
            analyzer: {
                standard: {
                    type: 'standard'
                }
            }
        }
    },
    mappings: {
        properties: {
            title: {
                type: 'text',
                analyzer: 'standard'
            },
            author: {
                type: 'text',
                analyzer: 'standard'
            },
            description: {
                type: 'text',
                analyzer: 'standard'
            },
            published_date: {
                type: 'date'
            },
            published_url: {
                type: 'keyword'
            }
        }
    }
};


module.exports = {
    indexDefinition
}