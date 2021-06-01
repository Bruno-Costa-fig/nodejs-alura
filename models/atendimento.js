const moment = require('moment')
const atendimento = require('../controllers/atendimento')
const conexao = require('../infraestrutura/database/conexao')
const axios = require('axios')
const repositorio = require("../repositorios/atendimento")

class Atendimento {
    constructor(){

        this.dataEhValida = ({data, dataCriacao}) => moment(data).isSameOrAfter(dataCriacao);
        this.clienteEhValida = (tamanho) => tamanho >= 4;
        this.valida = parametros => this.validacoes.filter(campo => {
            const { nome } = campo;
            const parametro = parametros[nome];

            return !campo.valido(parametro)
        })

        this.validacoes = [
            {
                nome : "data",
                valido : this.dataEhValida,
                mensagem: "Data deve ser maior ou igual a data atual"
            },
            {
                nome : "cliente",
                valido : this.clienteEhValida,
                mensagem : "O nome do cliente deve ter pelo menos 4 caracteres"
            }
        ]
    }
    adiciona(atendimento) {
        // a ? significa que o parametro que estamos recebendo vai ser colocado li na query
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data).format('YYYY-MM-DD HH:MM:SS')
        // formatando a data do agendamento
        
        const parametros = {
            data: {data, dataCriacao},
            cliente: {tamanho: atendimento.cliente.length}
        }

        const erros = this.valida(parametros)
        const existemErros = erros.length

        if(existemErros){
            return new Promise((resolve, reject) => {
                reject(erros)
            })
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}

            return repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.insertId;
                    return {...atendimento, id}
                })
        }


    }

    lista() {
        return repositorio.lista();        
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id=${id}`

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            if(erro){
                res.status(400).json(erro)
            }else{
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data;
                res.status(200).send(atendimento)
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