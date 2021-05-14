const moment = require('moment')
const atendimento = require('../controllers/atendimento')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        // a ? significa que o parametro que estamos recebendo vai ser colocado li na query
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data).format('YYYY-MM-DD HH:MM:SS')
        // formatando a data do agendamento
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValida = atendimento.cliente.length >= 4

        const validacoes = [
            {
                nome : "data",
                valido : dataEhValida,
                mensagem: "Data deve ser maior ou igual a data atual"
            },
            {
                nome : "cliente",
                valido : clienteEhValida,
                mensagem : "O nome do cliente deve ter pelo menos 4 caracteres"
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = "INSERT INTO atendimentos SET ?";
    
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro){
                    res.status(400).json(erro)
                }else{
                    res.status(201).json(atendimento)
                }
            })
        }


    }

    lista(res) {
        const sql = `SELECT * FROM atendimentos`

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })

    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const resultado = resultados[0]
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).send(resultado)
            }
        })
    }

    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data).format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({...valores, id})
            }
        })

    }

    deleta(id, res){
        const sql = `DELETE FROM atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(202).send({id})
            }
        })
    }
}

module.exports = new Atendimento;