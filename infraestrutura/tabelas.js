class Tabelas {
    init(conexao) {
        // recebe a conexão lá do index.js
        this.conexao = conexao

        this.criarAtendimento()
    }

    criarAtendimento(){
        // query de criação de tabelas
        const sql = 'CREATE TABLE IF NOT EXISTS Atendimentos (id int NOT NULL AUTO_INCREMENT, cliente varchar(50) NOT NULL, pet varchar(20), servico varchar(20) NOT NULL, data datetime NOT NULL, dataCriacao datetime NOT NULL, status varchar(20) NOT NULL, observacoes text, PRIMARY KEY(id))'

        this.conexao.query(sql, (erro) => {
            if(erro){
                console.log(erro)
            }else{
                console.log("Tabela atendimentos criada com sucesso")
            }
        })
    }
}

module.exports = new Tabelas