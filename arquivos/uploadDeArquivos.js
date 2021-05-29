
/*

O ReadStream por si só cria uma stream do arquivo, porém ele por
si só não pode receber callback e manipular o arquivo(stream). Para
isso utilizamos o WriteStream para criar o arquivo novo a partir da
stream gerada. Esse processo leva menos tempo do que a opção abaixo,
e é mais adequada quando se for trabalhar com arquivos grandes.

*/

const fs = require('fs')

fs.createReadStream('./assets/salsicha.jpg')
    .pipe(fs.createWriteStream('./assets/salsicha-stream.jpg'))
    // o pipe transforma o que antes era de leitura para escrita;
    .on('finish', () => console.log('Imagem do salsicha concluida com sucesso'))
    // o .on nos possibilita usar o callback