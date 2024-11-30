

const indexNameUsuario = 'usuario';
// Definición del índice y mapeos
const indexUsuarioEsDefinition = {
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
            nombre: {
                type: 'text',
                analyzer: 'standard'
            },
            correo: {
                type: 'text',
                analyzer: 'standard'
            },
            password: {
                type: 'text',
                analyzer: 'standard'
            },
            rol: {
                type: 'text',
                analyzer: 'standard'
            },
            estado: {
                type: 'boolean',
            },
            google: {
                type: 'boolean',
            }
        }
    }
};


module.exports = {
    indexUsuarioEsDefinition,
    indexNameUsuario
}