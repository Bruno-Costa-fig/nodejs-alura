
/*

O ReadStream por si só cria uma stream do arquivo, porém ele por
si só não pode receber callback e manipular o arquivo(stream). Para
isso utilizamos o WriteStream para criar o arquivo novo a partir da
stream gerada. Esse processo leva menos tempo do que a opção abaixo,
e é mais adequada quando se for trabalhar com arquivos grandes.

*/

const fs = require('fs');
const path = require('path')

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada) => {
    
    // aqui vamos descobrir qual a extensão do arquivo
    const tiposValidos = ["jpg", "png", "jpeg"];
    const tipo = path.extname(caminho);
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1; // tira o . para verificar

    if(tipoEhValido){
        const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`
        
        fs.createReadStream(caminho)
        // o pipe transforma o que antes era de leitura para escrita;
        .pipe(fs.createWriteStream(novoCaminho))
        // o .on nos possibilita usar o callback
            .on('finish', () => callbackImagemCriada(false, novoCaminho))
    } else {
        const erro = 'tipo é inválido';
        console.log("Error! Invalid type.")
        callbackImagemCriada(erro)
    }

}