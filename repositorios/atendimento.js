const query = require("../infraestrutura/database/queries")

class Atendimento {
    adiciona(atendimentos){
        const sql = "INSERT INTO atendimentos SET ?";
        return query(sql, atendimentos)
    }

    lista() {
        const sql = `SELECT * FROM atendimentos`;

        return query(sql)

    }
}

module.exports = new Atendimento();