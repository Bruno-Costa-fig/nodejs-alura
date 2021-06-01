const conexao = require('./conexao')

const executaQuery = (query, parametros = "") => {
    return new Promise((resolve, reject) => {
        conexao.query(query, parametros, (erros, resultados, campos) => {
            if(erros) {
                reject(erros)
            } else {
                resolve(resultados)
            }
        })
    })
    // vamos trabalhar com promisses para pode devolver a função para o controller para 
    // lá ele poder dar a resposta para o cliente
}

module.exports = executaQuery;